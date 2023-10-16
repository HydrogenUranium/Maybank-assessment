package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectHomeProperty;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Named;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class ArticleAuthorBannerModel {
    @Getter
    @InjectHomeProperty
    @Named("authorBanner-title")
    private String title;

    @Getter
    @InjectHomeProperty
    @Named("authorBanner-brief")
    private String brief;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-followLabel")
    private String followLabel;

    @InjectHomeProperty
    @Getter
    @Named("articleHeader-followPath")
    private String followPath;
}
