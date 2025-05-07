package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import java.util.UUID;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class CtaBanner {

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

    @ValueMapValue
    @Getter
    private String tabletBackgroundImage;

    @ValueMapValue
    @Getter
    private String desktopBackgroundImage;

    @ValueMapValue
    @Getter
    private String buttonName;

    @ValueMapValue
    @Getter
    private String buttonLink;

    @Getter
    private final String id = "cta-banner_" + UUID.randomUUID();

}