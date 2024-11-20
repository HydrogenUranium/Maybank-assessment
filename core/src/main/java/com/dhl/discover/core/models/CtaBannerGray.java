package com.dhl.discover.core.models;

import com.dhl.discover.core.injectors.InjectHomeProperty;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class CtaBannerGray {

    @Inject
    @Default(values = "custom")
    private String type;

    @Inject
    @Getter
    private String title;

    @InjectHomeProperty
    @Named("ctaBannerGray-individualShipper-title")
    private String titleGlobal;

    @Inject
    @Getter
    private String description;

    @InjectHomeProperty
    @Named("ctaBannerGray-individualShipper-description")
    private String descriptionGlobal;

    @Inject
    @Getter
    private String buttonLink;

    @InjectHomeProperty
    @Named("ctaBannerGray-individualShipper-buttonLink")
    private String buttonLinkGlobal;

    @Inject
    @Getter
    private String buttonLabel;

    @InjectHomeProperty
    @Named("ctaBannerGray-individualShipper-buttonLabel")
    private String buttonLabelGlobal;

    @Inject
    @Getter
    private String linkTarget;

    @InjectHomeProperty
    @Named("ctaBannerGray-individualShipper-linkTarget")
    private String linkTargetGlobal;

    @PostConstruct
    protected void init() {
        if(type.equals("individualShipper")) {
            title = titleGlobal;
            description = descriptionGlobal;
            buttonLink = buttonLinkGlobal;
            buttonLabel = buttonLabelGlobal;
            linkTarget = linkTargetGlobal;
        }
    }
}
