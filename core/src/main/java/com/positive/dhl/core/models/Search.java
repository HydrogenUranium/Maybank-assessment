package com.positive.dhl.core.models;

import com.google.gson.Gson;
import com.positive.dhl.core.services.TagUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

@Getter
@Model(adaptables = Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class Search {
    @Getter(AccessLevel.NONE)
    @Self
    private Resource resource;

    @OSGiService
    private TagUtilService tagUtilService;

    @Inject
    private String title;

    @Inject
    private String descriptionFormat;

    @Inject
    private String descriptionFormatNoResults;

    @Inject
    private String popularSearchesTitle;

    @Inject
    private String sortByTitle;

    @Inject
    private String latestSortOptionTitle;

    @Inject
    private String showMoreResultsButtonTitle;

    private String popularTopics;

    @PostConstruct
    private void init() {
        popularTopics = new Gson().toJson(tagUtilService.getDefaultTrendingTopicsList(resource));
    }
}
