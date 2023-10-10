package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectAsset;
import com.positive.dhl.core.injectors.InjectHomeAssetProperty;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.UUID;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class CtaBanner {

    @Inject
    @Default(values = "custom")
    private String type;

    @Inject
    @Getter
    private String title;

    @Inject
    @Getter
    private String topTitle;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-title")
    private String titleGlobal;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-topTitle")
    private String topTitleGlobal;

    @InjectAsset
    @Getter
    private String mobileBackgroundImage;

    @InjectHomeAssetProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-mobileBackgroundImage")
    private String mobileBackgroundImageGlobal;

    @InjectAsset
    @Getter
    private String tabletBackgroundImage;

    @InjectHomeAssetProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-tabletBackgroundImage")
    private String tabletBackgroundImageGlobal;

    @InjectAsset
    @Getter
    private String desktopBackgroundImage;

    @InjectHomeAssetProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-desktopBackgroundImage")
    private String desktopBackgroundImageGlobal;

    @Inject
    @Getter
    private String buttonName;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-buttonName")
    private String buttonNameGlobal;

    @Inject
    @Getter
    private String buttonLink;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-buttonLink")
    private String buttonLinkGlobal;

    @Getter
    private final String id = "cta-banner_" + UUID.randomUUID();

    @PostConstruct
    protected void init() {
        if(type.equals("subscribeNewsletter")) {
            title = titleGlobal;
            topTitle = topTitleGlobal;
            mobileBackgroundImage = mobileBackgroundImageGlobal;
            tabletBackgroundImage = tabletBackgroundImageGlobal;
            desktopBackgroundImage = desktopBackgroundImageGlobal;
            buttonName = buttonNameGlobal;
            buttonLink = buttonLinkGlobal;
        }
    }
}