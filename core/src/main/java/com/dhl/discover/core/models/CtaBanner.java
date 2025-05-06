package com.dhl.discover.core.models;

import com.dhl.discover.core.injectors.InjectHomeProperty;
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
public class CtaBanner {

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
            mobileBackgroundImage = mobileBackgroundImageGlobal;
            tabletBackgroundImage = tabletBackgroundImageGlobal;
            desktopBackgroundImage = desktopBackgroundImageGlobal;
            buttonName = buttonNameGlobal;
            buttonLink = buttonLinkGlobal;
        }
    }
}