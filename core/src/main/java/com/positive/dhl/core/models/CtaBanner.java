package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.models.common.TrackableAbstract;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.UUID;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class CtaBanner extends TrackableAbstract {

    @ValueMapValue
    @Default(values = "custom")
    private String type;

    @ValueMapValue
    @Getter
    private String title;

    @ValueMapValue
    @Getter
    private String topTitle;

    @Getter
    private boolean disabled = false;

    @InjectHomeProperty
    @Named("ctaBanner-article-bottom-disabled")
    @Default(booleanValues = false)
    private boolean disabledGlobal;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-title")
    private String titleGlobal;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-topTitle")
    private String topTitleGlobal;

    @ValueMapValue
    @Getter
    private String mobileBackgroundImage;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-mobileBackgroundImage")
    private String mobileBackgroundImageGlobal;

    @ValueMapValue
    @Getter
    private String tabletBackgroundImage;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-tabletBackgroundImage")
    private String tabletBackgroundImageGlobal;

    @ValueMapValue
    @Getter
    private String desktopBackgroundImage;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-desktopBackgroundImage")
    private String desktopBackgroundImageGlobal;

    @ValueMapValue
    @Getter
    private String buttonName;

    @InjectHomeProperty
    @Named("ctaBanner-article-subscribeToOurNewsletter-buttonName")
    private String buttonNameGlobal;

    @ValueMapValue
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
            disabled = disabledGlobal;
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