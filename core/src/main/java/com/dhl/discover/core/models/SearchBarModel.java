package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.google.gson.Gson;
import com.dhl.discover.core.injectors.InjectHomeProperty;
import com.dhl.discover.core.services.TagUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import javax.inject.Named;

@Getter
@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class SearchBarModel {
    @OSGiService
    private TagUtilService tagUtilService;

    @Getter(AccessLevel.NONE)
    @SlingObject
    private ResourceResolver resourceResolver;

    @ScriptVariable
    private Page currentPage;

    @InjectHomeProperty
    @Named("searchBar-recentSearchesTitle")
    private String recentSearchesTitleHomeProperty;

    @InjectHomeProperty
    @Named("searchBar-trendingTopicsTitle")
    private String trendingTopicsTitleHomeProperty;

    @InjectHomeProperty
    @Named("searchBar-searchButtonAriaLabel")
    private String searchButtonAriaLabelHomeProperty;

    @InjectHomeProperty
    @Named("searchBar-showThumbnail")
    private boolean showThumbnailHomeProperty;

    @InjectHomeProperty
    @Named("searchBar-openAriaLabel")
    private String openAriaLabelHomeProperty;

    @InjectHomeProperty
    @Named("searchBar-closeAriaLabel")
    private String closeAriaLabelHomeProperty;

    @InjectHomeProperty
    @Named("searchBar-searchInputAriaLabel")
    private String searchInputAriaLabelHomeProperty;

    @InjectHomeProperty
    @Named("searchBar-articlesTitle")
    private String articlesTitleHomeProperty;

    @Getter(AccessLevel.NONE)
    @InjectHomeProperty
    @Named("searchBar-searchResultPage")
    private String searchResultPagePath;

    @ValueMapValue
    private String recentSearchesTitle;

    @ValueMapValue
    private String trendingTopicsTitle;

    @ValueMapValue
    private String searchButtonAriaLabel;

    @ValueMapValue
    private boolean showThumbnail;

    @ValueMapValue
    private String openAriaLabel;

    @ValueMapValue
    private String closeAriaLabel;

    @ValueMapValue
    private String searchInputAriaLabel;

    @ValueMapValue
    private String articlesTitle;

    private String trendingTopics;
    private String searchResultPage;

    private String getValueWithFallback(String original, String fallback) {
        return StringUtils.isNotBlank(original) ? original : fallback;
    }

    private boolean getBooleanWithFallback(boolean original, boolean fallback) {
        return original || fallback;
    }

    @PostConstruct
    private void init() {
        recentSearchesTitle = getValueWithFallback(recentSearchesTitle, recentSearchesTitleHomeProperty);
        trendingTopicsTitle = getValueWithFallback(trendingTopicsTitle, trendingTopicsTitleHomeProperty);
        searchButtonAriaLabel = getValueWithFallback(searchButtonAriaLabel, searchButtonAriaLabelHomeProperty);
        openAriaLabel = getValueWithFallback(openAriaLabel, openAriaLabelHomeProperty);
        closeAriaLabel = getValueWithFallback(closeAriaLabel, closeAriaLabelHomeProperty);
        searchInputAriaLabel = getValueWithFallback(searchInputAriaLabel, searchInputAriaLabelHomeProperty);
        articlesTitle = getValueWithFallback(articlesTitle, articlesTitleHomeProperty);
        showThumbnail = getBooleanWithFallback(showThumbnail, showThumbnailHomeProperty);

        trendingTopics = new Gson().toJson(tagUtilService.getTrendingTopics(currentPage.getContentResource()));
        searchResultPage = StringUtils.isNoneBlank(searchResultPagePath) ? resourceResolver.map(searchResultPagePath) : StringUtils.EMPTY;
    }
}
