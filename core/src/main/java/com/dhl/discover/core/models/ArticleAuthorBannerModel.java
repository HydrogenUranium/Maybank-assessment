package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.injectors.InjectHomeProperty;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

@Model(adaptables=SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleAuthorBannerModel {
    @Inject
    private Page currentPage;

    @Getter
    @InjectHomeProperty
    @Named("authorBanner-title")
    private String title;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-followLabel")
    private String followLabel;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-followPath")
    private String followPath;

    @Getter
    private String brief;

    @PostConstruct
    protected void init() {
        ValueMap currentPageProperties = currentPage.getProperties();
        if (currentPageProperties != null ) {
            brief = currentPageProperties.get("authorBriefDescription", String.class);
        }
    }
}
