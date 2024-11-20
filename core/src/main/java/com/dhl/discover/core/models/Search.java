package com.dhl.discover.core.models;

import com.google.gson.Gson;
import com.dhl.discover.core.services.TagUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;

@Getter
@Model(adaptables = Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class Search {
    @Getter(AccessLevel.NONE)
    @Self
    private Resource resource;

    @OSGiService
    private TagUtilService tagUtilService;

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String descriptionFormat;

    @ValueMapValue
    private String descriptionFormatNoResults;

    @ValueMapValue
    private String popularSearchesTitle;

    @ValueMapValue
    private String sortByTitle;

    @ValueMapValue
    private String latestSortOptionTitle;

    @ValueMapValue
    private String relevanceSortOptionTitle;

    @ValueMapValue
    private String showMoreResultsButtonTitle;

    @ValueMapValue
    private String searchButtonAriaLabel;

    @ValueMapValue
    private String searchInputAriaLabel;

    private String popularTopics;

    @PostConstruct
    private void init() {
        popularTopics = new Gson().toJson(tagUtilService.getTrendingTopics(resource));
    }
}
