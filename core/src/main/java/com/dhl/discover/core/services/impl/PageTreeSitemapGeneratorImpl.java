package com.dhl.discover.core.services.impl;

import com.adobe.aem.wcm.seo.localization.LanguageAlternativesService;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.constants.ChangeFrequencyEnum;
import com.dhl.discover.core.services.PageUtilService;
import org.jetbrains.annotations.NotNull;
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
import static com.day.cq.commons.jcr.JcrConstants.JCR_MIXINTYPES;
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
                "service.ranking:Integer=20"},
        service = {SitemapGenerator.class})
@Designate(ocd = PageTreeSitemapGeneratorImpl.Configuration.class)
public class PageTreeSitemapGeneratorImpl extends ResourceTreeSitemapGenerator {

    protected static final String HTML_EXTENSION = ".html";

    private boolean lastmodEnabled;
    private String lastmodSource;
    private boolean changefreqEnabled;
    private String changefreqDefaultValue;
    private boolean priorityEnabled;
    private String priorityDefaultValue;
    boolean languageAlternatesEnabled;

    @Reference
    private PageUtilService pageUtilService;

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
    protected void addResource(@NotNull String name, @NotNull Sitemap sitemap, Resource resource) throws SitemapException {
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
        var url = sitemap.addUrl(location);
        if (lastmodEnabled) {
            setLastmode(url, page);
        }
        if (changefreqEnabled) {
            url.setChangeFrequency(getChangeFrequency(page));
        }
        if (priorityEnabled) {
            url.setPriority(getPriority(page));
        }
        if (languageAlternatesEnabled) {
            setLanguageAlternates(url, page);
        }
        log.debug("Added the {} to Extended Sitemap", url);
    }

    private Url setLastmode(Url url, Page page) {
        Calendar lastmod = getLastmodDate(page);
        if (lastmod != null) {
            url.setLastModified(lastmod.toInstant());
        }

        return url;
    }

    private Url setLanguageAlternates(Url url, Page page) {
        for (Map.Entry<Locale, String> alternative : getAlternateLanguageLinks(page).entrySet()) {
            AlternateLanguageExtension ext = url.addExtension(AlternateLanguageExtension.class);
            if (ext == null) {
                log.debug("Could not create a AlternateLanguageExtension, aborting");
                break;
            }
            if (alternative.getKey().toLanguageTag().equals("en")) {
                ext.setDefaultLocale();
            } else {
                ext.setLocale(alternative.getKey());
            }
            ext.setHref(alternative.getValue());
        }

        return url;
    }

    @Override
    public boolean shouldInclude(@NotNull Resource resource) {
        return super.shouldInclude(resource) && Optional.ofNullable(resource.adaptTo(Page.class)).map(this::shouldInclude).orElse(Boolean.FALSE);
    }

    private boolean shouldInclude(Page page) {
        return isPublished(page) && !isNoIndex(page) && !isRedirect(page) && !isProtected(page) && isCanonical(page) && page.getContentResource() != null;
    }

    public boolean isCanonical(Page page) {
        return isCanonicalUrl(page, getCustomCanonicalUrl(page));
    }

    boolean isCanonicalUrl(Page page, String customCanonicalUrl) {
        Optional<ResourceResolver> resourceResolver = getResourceResolver(page);
        return StringUtils.isBlank(customCanonicalUrl) || (resourceResolver.isPresent() &&
                (customCanonicalUrl.equals(getExternalizedLink(page, resourceResolver.get())) || customCanonicalUrl.equals(page.getPath())));
    }

    private String getExternalizedLink(Page page, ResourceResolver resourceResolver) {
        return externalize(resourceResolver, page.getPath(), HTML_EXTENSION);
    }

    public String getCanonicalUrl(Page page) {
        String canonicalUrl = getCustomCanonicalUrl(page);
        if (isCanonicalUrl(page, canonicalUrl)) {
            return externalize(page.adaptTo(Resource.class), HTML_EXTENSION);
        }
        if (canonicalUrl.charAt(0) != '/') {
            return canonicalUrl;
        }
        Optional<ResourceResolver> resourceResolver = getResourceResolver(page);
        if (resourceResolver.isEmpty()) {
            return StringUtils.EMPTY;
        }
        var canonicalResource = resourceResolver.get().resolve(canonicalUrl);
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

    private String getCustomCanonicalUrl(Page page) {
        return Optional.ofNullable(page.adaptTo(Resource.class))
                .map(r -> r.getValueMap().get(PN_CANONICAL_URL, String.class))
                .stream().findAny().orElse(StringUtils.EMPTY);
    }

    public Map<Locale, String> getAlternateLanguageLinks(Page page) {
        Map<Locale, Page> languageAlternatives = languageAlternativesService.getLanguageAlternatives(page);
        languageAlternatives.values().removeIf(alternative -> !this.shouldInclude(alternative));
        if (languageAlternatives.isEmpty() || (languageAlternatives.size() == 1 && languageAlternatives.containsValue(page))) {
            return Collections.emptyMap();
        }
        Map<Locale, String> hrefs = new LinkedHashMap<>();
        for (final Map.Entry<Locale, Page> alternative : languageAlternatives.entrySet()) {
            var alternativePage = alternative.getValue();
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
        return pageUtilService.hasNoIndex(page, true);
    }

    public boolean isRedirect(Page page) {
        return Optional.ofNullable(page)
                .filter(Page::hasContent)
                .map(Page::getContentResource)
                .map(Resource::getValueMap)
                .map(p -> p.get(PN_REDIRECT_TARGET, String.class))
                .isPresent();
    }

    public boolean isProtected(Page page) {
        return Optional.ofNullable(page)
                .map(p -> p.adaptTo(Resource.class))
                .map(Resource::getValueMap)
                .map(p -> p.get(JCR_MIXINTYPES, String[].class))
                .map(Arrays::asList)
                .map(mp -> mp.contains("granite:AuthenticationRequired"))
                .orElse(Boolean.FALSE);
    }

    private Calendar getLastmodDate(Page page) {
        if (lastmodSource.equals(PN_PAGE_LAST_REPLICATED)) {
            Optional<Calendar> lastReplicatedAt =
                    Optional.ofNullable(page)
                            .filter(Page::hasContent)
                            .map(Page::getContentResource)
                            .map(contentResource -> contentResource.adaptTo(ReplicationStatus.class))
                            .map(ReplicationStatus::getLastPublished);
            if (lastReplicatedAt.isPresent()) {
                return lastReplicatedAt.get();
            }
        } else {
            Optional<Calendar> createdAt =
                    Optional.ofNullable(page)
                            .filter(Page::hasContent)
                            .map(Page::getContentResource)
                            .map(Resource::getValueMap)
                            .map(properties -> properties.get(PN_CREATED, Calendar.class));
            Optional<Calendar> lastModifiedAt = Optional.ofNullable(page).map(Page::getLastModified);
            if (lastModifiedAt.isPresent() && (createdAt.isEmpty() || (lastModifiedAt.get()).after(createdAt.get()))) {
                return lastModifiedAt.get();
            }
            if (createdAt.isPresent()) {
                return createdAt.get();
            }
        }
        return null;
    }

    String externalize(Resource resource, String selectorExtensionSuffix) {
        return resource != null ? externalize(resource.getResourceResolver(), resource.getPath(), selectorExtensionSuffix) : StringUtils.EMPTY;
    }

    private String externalize(ResourceResolver resourceResolver, String url, String selectorExtensionSuffix) {
        String path = url + selectorExtensionSuffix;
        return resourceResolver.map(path);
    }

    Optional<ResourceResolver> getResourceResolver(Page page) {
        return Optional.ofNullable(page)
                .filter(Page::hasContent)
                .map(Page::getContentResource)
                .map(Resource::getResourceResolver);
    }

    private Url.ChangeFrequency getChangeFrequency(Page page) {
        var changeFrequency = getPageChangeFrequency(page);
        if (changeFrequency == null) {
            changeFrequency = getPageChangeFrequency(getInheritanceEnabledPage(page, "sitemapChangefreqInherit"));
        }
        return changeFrequency != null ? changeFrequency : ChangeFrequencyEnum.getChangeFrequencyByLabel(changefreqDefaultValue);
    }

    private Url.ChangeFrequency getPageChangeFrequency(Page page) {
        return Optional.ofNullable(page)
                .filter(Page::hasContent)
                .map(Page::getContentResource)
                .map(Resource::getValueMap)
                .map(props -> props.get("sitemapChangefreq", String.class))
                .map(ChangeFrequencyEnum::getChangeFrequencyByLabel)
                .orElse(null);
    }

    private double getPriority(Page page) {
        double priority = getPagePriority(page);
        if (priority == 0.0) {
            priority = getPagePriority(getInheritanceEnabledPage(page, "sitemapPriorityInherit"));
        }
        return priority != 0.0 ? priority : getDefaultPriority(page);
    }

    private double getPagePriority(Page page) {
        return Optional.ofNullable(page)
                .filter(Page::hasContent)
                .map(Page::getContentResource)
                .map(Resource::getValueMap)
                .map(props -> props.get("sitemapPriority", Double.class))
                .orElse(0.0);
    }

    private double getDefaultPriority(Page page) {
        Resource resource = page.adaptTo(Resource.class);
        if (StringUtils.equals(priorityDefaultValue, "pageDepth")) {
            var priority = 1.0;
            while (resource != null && !SitemapUtil.isSitemapRoot(resource)) {
                resource = resource.getParent();
                priority -= 0.1;
            }
            return Math.round(priority * 10) / 10.0;
        } else {
            return Double.parseDouble(priorityDefaultValue);
        }
    }

    private Page getInheritanceEnabledPage(Page inheritanceEnabledPage, String inheritedProperty) {
        return pageUtilService
                .getAncestorPageByPredicate(inheritanceEnabledPage, page -> page.getProperties().get(inheritedProperty, false));
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
                options = {@Option(label = PN_PAGE_LAST_MOD, value = PN_PAGE_LAST_MOD), @Option(label = PN_PAGE_LAST_REPLICATED, value = PN_PAGE_LAST_REPLICATED)})
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
        String changefreqDefaultValue() default "hourly";

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
        String priorityDefaultValue() default "0.9";

        @AttributeDefinition(name = "Add Language Alternates", description = "If enabled, a Page's language copies " +
                "will be added as language alternates to the an url entry")
        boolean enableLanguageAlternates() default true;
    }
}
