package com.positive.dhl.core.services;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;
import com.day.cq.wcm.api.PageManager;
import com.positive.dhl.core.models.Article;
import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.jetbrains.annotations.Nullable;
import org.osgi.service.component.annotations.Component;

import java.util.*;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.adobe.aem.wcm.seo.SeoTags.PN_ROBOTS_TAGS;
import static org.apache.jackrabbit.JcrConstants.JCR_LANGUAGE;
import static org.apache.sling.jcr.resource.api.JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY;

@Component(service = PageUtilService.class)
public class PageUtilService {

    public static final int HOME_PAGE_LEVEL = 3;
    public static final int CATEGORY_PAGE_LEVEL = HOME_PAGE_LEVEL + 1;
    public static final int HOME_PAGE_DEPTH = HOME_PAGE_LEVEL + 1;

    public static final String HOME_PAGE_DYNAMIC_RESOURCE_TYPE = "dhl/components/pages/editable-home-page";
    public static final String CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE = "dhl/components/pages/editable-category-page";

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
                .orElse(null);
    }

    public Page getHomePage(Resource resource) {
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
        Page ancestor = getAncestorPageByPredicate(currentPage,
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
        ValueMap homePageProperties = getHomePageProperties(page);
        String jcrLanguageProperty = homePageProperties.get(JCR_LANGUAGE, StringUtils.EMPTY);

        if (StringUtils.isBlank(jcrLanguageProperty) || StringUtils.equals(jcrLanguageProperty, "en")) {
            String acceptLanguagesProperty = homePageProperties.get("acceptlanguages", StringUtils.EMPTY);
            Locale localeBasedOnAcceptLanguages = acceptLanguagesProperty.contains("-")
                    ? new Locale(acceptLanguagesProperty.split("-")[0], acceptLanguagesProperty.split("-")[1])
                    : new Locale(acceptLanguagesProperty);
            return LocaleUtils.isAvailableLocale(localeBasedOnAcceptLanguages) && !StringUtils.isBlank(acceptLanguagesProperty)
                    ? localeBasedOnAcceptLanguages : new Locale("en");
        }

        return jcrLanguageProperty.contains("_")
                ? new Locale(jcrLanguageProperty.split("_")[0], jcrLanguageProperty.split("_")[1])
                : new Locale(jcrLanguageProperty);
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
}