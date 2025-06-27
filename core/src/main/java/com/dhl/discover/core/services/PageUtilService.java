package com.dhl.discover.core.services;

import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.day.cq.wcm.api.PageManager;
import com.dhl.discover.core.models.Article;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.Nullable;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.adobe.aem.wcm.seo.SeoTags.PN_ROBOTS_TAGS;
import static org.apache.sling.jcr.resource.api.JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY;

@Component(service = PageUtilService.class)
public class PageUtilService implements Serializable {

    public static final int HOME_PAGE_LEVEL = 3;
    public static final int CATEGORY_PAGE_LEVEL = HOME_PAGE_LEVEL + 1;
    public static final int HOME_PAGE_DEPTH = HOME_PAGE_LEVEL + 1;

    public static final String CONTENT_ROOT_PATH = "/content";
    public static final String ROOT_PAGE_PATH = "/content/dhl";
    public static final String HOME_PAGE_DYNAMIC_RESOURCE_TYPE = "dhl/components/pages/editable-home-page";
    public static final String CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE = "dhl/components/pages/editable-category-page";

    @Reference
    private transient LaunchService launchService;

    @Reference
    private transient ModelFactory modelFactory;

    public int getHomePageLevel() {
        return HOME_PAGE_LEVEL;
    }

    /**
     * Returns the home page of the given page. By {@code home page} we understand the page that holds various component
     * configuration entries in its jcr:content
     * @param page is a {@link Page} that we try to get the homepage of
     * @return {@code Page} objec that represents the 'home' page (with properties informing the components configurations) or {@code null} if none has been found
     */
    public Page getHomePage(Page page) {
        return Optional.ofNullable(page)
                .map(p -> p.getAbsoluteParent(getHomePageLevel()))
                .map(launchService::resolveOutOfScopeLaunchPage)
                .orElse(null);
    }

    public String getHomePagePath(String pagePath) {
        return Optional.ofNullable(pagePath)
                .map(path -> path.startsWith("/content/dhl/language-masters") ?
                        Pattern.compile("^(/content/dhl/language-masters/(en-master|\\w{2}_?(\\w{2})?))").matcher(path) :
                        Pattern.compile("^(/content/dhl/(global|\\w{2})/(\\w{2})-(global|\\w{2}))").matcher(path))
                .filter(Matcher::find)
                .map(m -> m.group(1))
                .orElse(StringUtils.EMPTY);
    }

    public Page getHomePage(Resource resource) {
        if (resource == null) {
            return null;
        }
        return getHomePage(getPage(resource));
    }

    public Page getAncestorPageByPredicate(Page page, Predicate<Page> predicate) {
        return Optional.ofNullable(page)
                .map(Page::getParent)
                .map(parent -> predicate.test(parent) ? parent : getAncestorPageByPredicate(parent, predicate))
                .orElse(null);
    }

    public boolean hasNoIndex(Page currentPage) {
        if(currentPage == null) {
            return false;
        }
        return Arrays.asList(currentPage.getProperties().get(PN_ROBOTS_TAGS, new String[0])).contains("noindex");
    }

    public boolean hasInheritedNoIndex(Page currentPage) {
        var ancestor = getAncestorPageByPredicate(currentPage,
                page -> page.getProperties().get("noIndexRobotsTagsInherit", false));

        return hasNoIndex(ancestor);
    }

    public boolean hasNoIndex(Page currentPage, boolean checkInheritance) {
        if (checkInheritance) {
            return hasNoIndex(currentPage) || hasInheritedNoIndex(currentPage);
        }
        return hasNoIndex(currentPage);
    }

    /**
     * Returns the {@link ValueMap} (properties) of AEM Page. This implementation is dependent on AEM Page api
     * @param page is a {@link Page} object whose properties we want to get
     * @return a {@code ValueMap} that represents the properties of the page or {@code ValueMap.EMPTY} if the page is {@code null}
     */
    public ValueMap getPageProperties(Page page) {
        return Optional.ofNullable(page)
                .map(Page::getProperties)
                .orElse(ValueMap.EMPTY);
    }

    public ValueMap getHomePageProperties(Page page) {
        return getPageProperties(getHomePage(page));
    }

    public List<Page> getAllHomePages(Page rootPage) {
        return rootPage == null || rootPage.getDepth() > HOME_PAGE_DEPTH
                ? null
                : getAllHomePages(rootPage, new LinkedList<>());
    }

    public List<Page> getAllHomePages(ResourceResolver resolver) {
        return getAllHomePages(getPage(ROOT_PAGE_PATH, resolver));
    }

    public boolean isHomePage(Page page) {
        if(page == null) {
            return false;
        }
        ValueMap pageProperties = page.getProperties();
        String resourceType = pageProperties.get(SLING_RESOURCE_TYPE_PROPERTY, "");
        boolean isHomePageResourceType = resourceType.equals(HOME_PAGE_DYNAMIC_RESOURCE_TYPE);
        return page.getDepth() == HOME_PAGE_DEPTH && isHomePageResourceType;
    }

    private List<Page> getAllHomePages(Page page, List<Page> list) {
        Iterator<Page> pageIterator = page.listChildren(new PageFilter(false, false));
        while (pageIterator.hasNext()) {
            var childPage = pageIterator.next();
            if (isHomePage(childPage)) {
                list.add(childPage);
            }
            if (childPage.getDepth() < HOME_PAGE_DEPTH) {
                getAllHomePages(childPage, list);
            }
        }
        return list;
    }

    public String getCountryCodeByPagePath(Page page) {
        return Optional.ofNullable(page)
                .map(Page::getPath)
                .map(pagePath -> Pattern.compile("/content/dhl/(global|\\w{2})/.*").matcher(pagePath))
                .filter(Matcher::find)
                .map(m -> m.group(1))
                .orElse(StringUtils.EMPTY);
    }

    public Locale getLocale(Page page) {
        return page.getLanguage();
    }

    public Locale getLocale(String pagePath, ResourceResolver resolver) {
        return getLocale(getPage(pagePath, resolver));
    }

    public Locale getLocale(Resource resource) {
        return getLocale(getPage(resource));
    }

    public Page getPage(Resource resource) {
        return Optional.ofNullable(resource)
                .map(Resource::getResourceResolver)
                .map(rr -> rr.adaptTo(PageManager.class))
                .map(pm -> pm.getContainingPage(resource))
                .orElse(null);
    }

    public Page getPage(String resourcePath, ResourceResolver resourceResolver) {
        return Optional.ofNullable(resourcePath)
                .map(resourceResolver::getResource)
                .map(this::getPage)
                .orElse(null);
    }

    /**
     * Utility method that helps determine if the provided page belongs to 'global' (is in path /content/dhl/global).
     * @param currentPage is an instance of {@link Page} that we want to check
     * @return boolean {@code true} if we page is in global, otherwise {@code false}
     */
    public boolean isGlobalPage(Page currentPage) {
	    return this.getCountryCodeByPagePath(currentPage).equalsIgnoreCase("global");
    }

    /**
     * This method allows get {@link Article} model object by path.
     * @param articlePagePath is a path of the Article {@link Page}
     * @param resourceResolver is a {@link ResourceResolver}
     * @return {@code Article} if the articlePagePath links to the Article otherwise {@code null}
     */
    @Nullable
    public Article getArticle(String articlePagePath, ResourceResolver resourceResolver) {
        return Optional.ofNullable(articlePagePath)
                .filter(StringUtils::isNoneBlank)
                .map(resourceResolver::getResource)
                .map(r -> r.adaptTo(Article.class))
                .orElse(null);
    }

    @Nullable
    public Article getArticle(String articlePagePath, SlingHttpServletRequest request) {
        return Optional.ofNullable(articlePagePath)
                .filter(StringUtils::isNoneBlank)
                .map(path -> request.getResourceResolver().getResource(path))
                .map(r -> modelFactory.createModelFromWrappedRequest(request, r, Article.class))
                .orElse(null);
    }

    /**
     * Checks if a given AEM page is published.
     *
     * @param page the AEM `Page` object to check for publication status. May be null.
     * @return {@code true} if the page is published (last replication action was `ACTIVATE`), {@code false} otherwise.
     */
    public boolean isPublished(Page page) {
        return Optional.ofNullable(page)
                .filter(Page::hasContent)
                .map(Page::getContentResource)
                .map(r -> r.adaptTo(ReplicationStatus.class))
                .map(replicationStatus -> replicationStatus.getLastReplicationAction() == ReplicationActionType.ACTIVATE)
                .orElse(Boolean.FALSE);
    }
}