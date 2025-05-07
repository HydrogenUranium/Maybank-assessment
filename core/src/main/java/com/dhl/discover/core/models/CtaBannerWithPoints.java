package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class})
public class CtaBannerWithPoints {
    @ValueMapValue
    @Optional
    @Getter
    private String title;

    @ValueMapValue
    @Getter
    @Optional
    private String mobileBackgroundImage;

    @ValueMapValue
    @Getter
    @Optional
    private String tabletBackgroundImage;

    @ValueMapValue
    @Getter
    @Optional
    private String desktopBackgroundImage;

    @ValueMapValue
    @Getter
    @Optional
    private String buttonName;

    @ValueMapValue
    @Getter
    @Optional
    private String buttonLink;

    @Getter
    private final String id = "cta-banner_" + UUID.randomUUID();

    @Getter
    private List<String> points = new ArrayList<>();

}
