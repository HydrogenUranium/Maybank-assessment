package com.positive.dhl.core.services.impl;

import com.adobe.aem.wcm.seo.localization.LanguageAlternativesService;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.constants.ChangeFrequencyEnum;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.sitemap.SitemapException;
import org.apache.sling.sitemap.SitemapUtil;
import org.apache.sling.sitemap.builder.Sitemap;
import org.apache.sling.sitemap.builder.Url;
import org.apache.sling.sitemap.builder.extensions.AlternateLanguageExtension;
import org.apache.sling.sitemap.spi.generator.ResourceTreeSitemapGenerator;
import org.apache.sling.sitemap.spi.generator.SitemapGenerator;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.osgi.service.metatype.annotations.Option;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import static com.adobe.aem.wcm.seo.SeoTags.PN_CANONICAL_URL;
import static com.adobe.aem.wcm.seo.SeoTags.PN_ROBOTS_TAGS;
import static com.day.cq.wcm.api.constants.NameConstants.NN_CONTENT;
import static com.day.cq.wcm.api.constants.NameConstants.PN_CREATED;
import static com.day.cq.wcm.api.constants.NameConstants.PN_PAGE_LAST_MOD;
import static com.day.cq.wcm.api.constants.NameConstants.PN_PAGE_LAST_REPLICATED;
import static com.day.cq.wcm.api.constants.NameConstants.PN_REDIRECT_TARGET;

@Slf4j
@Component(
        property = {
                "service.description=DHL Discovery SitemapGenerator implementation that extend Apache Sling Sitemap Generator " +
                        "and overthrow OOTB com.adobe.aem.wcm.seo.impl.sitemap.PageTreeSitemapGeneratorImpl" +
                        "to include optional attributes ('priority' and 'frequency') into sitemap",
                "service.ranking:Integer=20" },
        service = { SitemapGenerator.class })
@Designate(ocd = PageTreeSitemapGeneratorImpl.Configuration.class)
public class PageTreeSitemapGeneratorImpl extends ResourceTreeSitemapGenerator {

    protected static final String HTML_EXTENSION = ".html";

    private boolean lastmodEnabled;
    private String lastmodSource;
    private boolean changefreqEnabled;
    private String changefreqDefaultValue;
    private boolean priorityEnabled;
    private String priorityDefaultValue;
    private boolean languageAlternatesEnabled;

    @Reference
    private LanguageAlternativesService languageAlternativesService;

    @Reference
    private ReplicationStatusCheck replicationStatusCheck;

    @Activate
    protected void activate(Configuration configuration) {
        this.lastmodEnabled = configuration.enableLastModified();
        this.lastmodSource = configuration.lastModifiedSource();
        this.changefreqEnabled = configuration.enableChangefreq();
        this.changefreqDefaultValue = configuration.changefreqDefaultValue();
        this.priorityEnabled = configuration.enablePriority();
        this.priorityDefaultValue = configuration.priorityDefaultValue();
        this.languageAlternatesEnabled = configuration.enableLanguageAlternates();
    }

    @Override
    protected void addResource(String name, Sitemap sitemap, Resource resource) throws SitemapException {
        Page page = resource.adaptTo(Page.class);
        if (page == null) {
            log.debug("Skipping resource at {}: not a page", resource.getPath());
            return;
        }
        String location = getCanonicalUrl(page);
        if (StringUtils.isBlank(location)) {
            log.debug("Skipping resource at {}: externalised location is null", resource.getPath());
            return;
        }
        Url url = sitemap.addUrl(location);
        if (lastmodEnabled) {
            Calendar lastmod = getLastmodDate(page);
            if (lastmod != null) {
                url.setLastModified(lastmod.toInstant());
            }
        }
        if (changefreqEnabled) {
            url.setChangeFrequency(getChangeFrequency(resource));
        }
        if (priorityEnabled) {
            url.setPriority(getPriority(resource));
        }
        if (languageAlternatesEnabled) {
            for (Map.Entry<Locale, String> alternative : getAlternateLanguageLinks(page).entrySet()) {
                AlternateLanguageExtension ext = url.addExtension(AlternateLanguageExtension.class);
                if (ext == null) {
                    log.debug("Could not create a AlternateLanguageExtension, aborting");
                    break;
                }
                ext.setLocale(alternative.getKey());
                ext.setHref(alternative.getValue());
            }
        }
        log.debug("Added the {} to Extended Sitemap", url);
    }

    @Override
    public boolean shouldInclude(Resource resource) {
        return super.shouldInclude(resource) && Optional.ofNullable(resource.adaptTo(Page.class)).map(this::shouldInclude).orElse(Boolean.FALSE);
    }

    private boolean shouldInclude(Page page) {
        return isPublished(page) && !isNoIndex(page) && !isRedirect(page) && !isProtected(page) && isCanonical(page);
    }

    public boolean isCanonical(Page page) {
        String canonicalUrl = page.getProperties().get(PN_CANONICAL_URL, String.class);
        return isCanonicalUrl(page, canonicalUrl);
    }

    private boolean isCanonicalUrl(Page page, String customCanonicalUrl) {
        Optional<ResourceResolver> resourceResolver = getResourceResolver(page);
        return StringUtils.isBlank(customCanonicalUrl) || (resourceResolver.isPresent() &&
                (customCanonicalUrl.equals(getExternalizedLink(page, resourceResolver.get()))) || customCanonicalUrl.equals(page.getPath()));
    }

    private String getExternalizedLink(Page page, ResourceResolver resourceResolver) {
        return externalize(resourceResolver, page.getPath(), HTML_EXTENSION);
    }

    public String getCanonicalUrl(Page page) {
        String canonicalUrl = page.getProperties().get(PN_CANONICAL_URL, String.class);
        if (isCanonicalUrl(page, canonicalUrl)) {
            return externalize(page.adaptTo(Resource.class), HTML_EXTENSION);
        }
        if (canonicalUrl.charAt(0) != '/') {
            return canonicalUrl;
        }
        ResourceResolver resourceResolver = page.getContentResource().getResourceResolver();
        Resource canonicalResource = resourceResolver.resolve(canonicalUrl);
        if (ResourceUtil.isNonExistingResource(canonicalResource)) {
            boolean hasExtension = canonicalUrl.matches(".+\\.\\w{2,5}$");
            return externalize(canonicalResource, hasExtension ? HTML_EXTENSION : StringUtils.EMPTY);
        }
        String resolutionPathInfo = canonicalResource.getResourceMetadata().getResolutionPathInfo();
        if (StringUtils.isBlank(resolutionPathInfo)) {
            resolutionPathInfo = HTML_EXTENSION;
        }
        return externalize(canonicalResource, resolutionPathInfo);
    }

    public Map<Locale, String> getAlternateLanguageLinks(Page page) {
        Map<Locale, Page> languageAlternatives = languageAlternativesService.getLanguageAlternatives(page);
        languageAlternatives.values().removeIf(alternative -> !this.shouldInclude(alternative));
        if (languageAlternatives.isEmpty() || (languageAlternatives.size() == 1 && languageAlternatives.containsValue(page))) {
            return Collections.emptyMap();
        }
        Map<Locale, String> hrefs = new LinkedHashMap<>();
        for (final Map.Entry<Locale, Page> alternative : languageAlternatives.entrySet()) {
            Page alternativePage = alternative.getValue();
            String href = getCanonicalUrl(alternativePage);
            if (href != null) {
                hrefs.put(alternative.getKey(), href);
            }
        }
        return hrefs;
    }

    public boolean isPublished(Page page) {
        return replicationStatusCheck.isPublished(page);
    }

    public boolean isNoIndex(Page page) {
        return Arrays.asList(page.getProperties().get(PN_ROBOTS_TAGS, new String[0])).contains("noindex");
    }

    public boolean isRedirect(Page page) {
        return page.getProperties().get(PN_REDIRECT_TARGET, String.class) != null;
    }

    public boolean isProtected(Page page) {
        return Optional.ofNullable(page.adaptTo(Resource.class)).map(this::isProtected).orElse(Boolean.FALSE);
    }

    private boolean isProtected(Resource resource) {
        return Optional.of(resource)
                .map(r -> r.getValueMap().get("jcr:mixinTypes", String[].class))
                .map(Arrays::asList)
                .map(mixins -> mixins.contains("granite:AuthenticationRequired"))
                .orElse(Boolean.FALSE);
    }

    private Calendar getLastmodDate(Page page) {
        if (lastmodSource.equals(PN_PAGE_LAST_REPLICATED)) {
            Optional<Calendar> lastReplicatedAt =
                    Optional.ofNullable(page.getContentResource())
                            .map(contentResource -> contentResource.adaptTo(ReplicationStatus.class))
                            .map(ReplicationStatus::getLastPublished);
            if (lastReplicatedAt.isPresent()) {
                return lastReplicatedAt.get();
            }
        }
        else {
            Optional<Calendar> createdAt =
                    Optional.ofNullable(page.getContentResource())
                            .map(Resource::getValueMap)
                            .map(properties -> properties.get(PN_CREATED, Calendar.class));
            Optional<Calendar> lastModifiedAt = Optional.ofNullable(page.getLastModified());
            if (lastModifiedAt.isPresent() && (!createdAt.isPresent() || (lastModifiedAt.get()).after(createdAt.get()))) {
                return lastModifiedAt.get();
            }
            if (createdAt.isPresent()) {
                return createdAt.get();
            }
        }
        return null;
    }

    private String externalize(Resource resource, String selectorExtensionSuffix) {
        ResourceResolver resourceResolver = resource.getResourceResolver();
        return externalize(resourceResolver, resource.getPath(), selectorExtensionSuffix);
    }

    private String externalize(ResourceResolver resourceResolver, String url, String selectorExtensionSuffix) {
        String path = url + selectorExtensionSuffix;
        return resourceResolver.map(path);
    }

    private Optional<ResourceResolver> getResourceResolver(Page page) {
        return Optional.ofNullable(page)
                .map(Page::getContentResource)
                .map(Resource::getResourceResolver);
    }

    private Url.ChangeFrequency getChangeFrequency(Resource resource) {
        Optional<String> specificPageValueOptional = Optional.ofNullable(resource.getChild(NN_CONTENT))
                .map(Resource::getValueMap)
                .map(props -> props.get("sitemapChangefreq", String.class));
        return specificPageValueOptional
                .map(ChangeFrequencyEnum::getChangeFrequencyByLabel)
                .orElseGet(() -> ChangeFrequencyEnum.getChangeFrequencyByLabel(changefreqDefaultValue));
    }

    private double getPriority(Resource resource) {
        Optional<Double> specificPageValueOptional = Optional.ofNullable(resource.getChild(NN_CONTENT))
                .map(Resource::getValueMap)
                .map(props -> props.get("sitemapPriority", Double.class));
        if (specificPageValueOptional.isPresent()) {
            return specificPageValueOptional.get();
        }

        if (StringUtils.equals(priorityDefaultValue, "pageDepth")) {
            double priority = 1.0;
            while (resource != null && !SitemapUtil.isSitemapRoot(resource)) {
                resource = resource.getParent();
                priority -= 0.1;
            }

            return Math.round(priority * 10) / 10.0;
        }
        return Double.parseDouble(priorityDefaultValue);
    }

    @ObjectClassDefinition(name = "DHL Discovery - Page Tree Sitemap Generator")
    @interface Configuration {
        @AttributeDefinition(
                name = "Add Last Modified",
                description = "If enabled, a Page's last published date will be set as last modified date to an url entry")
        boolean enableLastModified() default true;

        @AttributeDefinition(
                name = "Last Modified Source",
                description = "The source from which to obtain the last modified date. " +
                        "If running on author it makes sense to use cq:lastReplicated in order to prevent unpublished changes to impact the last modified date. " +
                        "For cq:lastModified the most recent of jcr:created and cq:lastModified is used. Defaults to cq:lastModified",
                options = { @Option(label = PN_PAGE_LAST_MOD, value = PN_PAGE_LAST_MOD), @Option(label = PN_PAGE_LAST_REPLICATED, value = PN_PAGE_LAST_REPLICATED) })
        String lastModifiedSource() default PN_PAGE_LAST_REPLICATED;

        @AttributeDefinition(
                name = "Add Changefreq Attribute",
                description = "If enabled, the '<changefreq>always</changefreq>' attribute will be added to sitemap " +
                        "to describe documents that change each time they are accessed")
        boolean enableChangefreq() default true;

        @AttributeDefinition(
                name = "Changefreq default value",
                description = "This value will be used if there is no custom Changefreq value in the page properties",
                options = {
                        @Option(label = "always", value = "always"),
                        @Option(label = "hourly", value = "hourly"),
                        @Option(label = "daily", value = "daily"),
                        @Option(label = "weekly", value = "weekly"),
                        @Option(label = "monthly", value = "monthly"),
                        @Option(label = "yearly", value = "yearly"),
                        @Option(label = "never", value = "never"),
                })
        String changefreqDefaultValue() default "always";

        @AttributeDefinition(
                name = "Add Priority Attribute",
                description = "If enabled, the '<priority>' attribute will be added to sitemap " +
                        "to lets the search engines know which pages you deem most important for the crawlers.")
        boolean enablePriority() default true;

        @AttributeDefinition(
                name = "Priority default value",
                description = "This value will be used if there is no custom Priority value in the page properties",
                options = {
                        @Option(label = "Dynamically, based on page level depth", value = "pageDepth"),
                        @Option(label = "0.9", value = "0.9"),
                        @Option(label = "0.8", value = "0.8"),
                })
        String priorityDefaultValue() default "pageDepth";

        @AttributeDefinition(name = "Add Language Alternates", description = "If enabled, a Page's language copies " +
                "will be added as language alternates to the an url entry")
        boolean enableLanguageAlternates() default true;
    }
}
