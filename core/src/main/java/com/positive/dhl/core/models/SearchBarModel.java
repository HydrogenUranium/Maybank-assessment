package com.positive.dhl.core.models;

import com.google.gson.Gson;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.TagUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

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

    @InjectHomeProperty
    @Named("searchBar-recentSearchesTitle")
    private String recentSearchesTitle;

    @InjectHomeProperty
    @Named("searchBar-trendingTopicsTitle")
    private String trendingTopicsTitle;

    @InjectHomeProperty
    @Named("searchBar-articlesTitle")
    private String articlesTitle;

    @Getter(AccessLevel.NONE)
    @InjectHomeProperty
    @Named("searchBar-searchResultPage")
    private String searchResultPagePath;

    private String trendingTopics;
    private String searchResultPage;

    @PostConstruct
    private void init() {
        trendingTopics = new Gson().toJson(tagUtilService.getDefaultTrendingTopicsList());
        searchResultPage = StringUtils.isNoneBlank(searchResultPagePath) ? resourceResolver.map(searchResultPagePath) : StringUtils.EMPTY;
    }
}
