package com.positive.dhl.core.models;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.google.gson.Gson;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;
import javax.inject.Named;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Getter
@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class SearchBarModel {
    private static final String TRENDING_TOPICS_TAGS_NAMESPACE = "dhlsuggested:";

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

    private String trendingTopics;

    @PostConstruct
    private void init() {
        trendingTopics = receiveDefaultTrendingTopicsList();
    }

    private String receiveDefaultTrendingTopicsList() {
        TagManager tagManager = resourceResolver.adaptTo(TagManager.class);

        List<String> trendingTopicsList = new ArrayList<>();
        if (tagManager != null) {
            var trendingTopicsTagsNamespace = tagManager.resolve(TRENDING_TOPICS_TAGS_NAMESPACE);
            if (null != trendingTopicsTagsNamespace) {
                Iterator<Tag> trendingTopicsTags = trendingTopicsTagsNamespace.listChildren();
                while (trendingTopicsTags.hasNext()) {
                    trendingTopicsList.add(trendingTopicsTags.next().getTitle());
                }
                trendingTopicsList.sort(String::compareTo);
            }
        }

        return new Gson().toJson(trendingTopicsList);
    }
}
