package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class CtaBannerGray {

    @ValueMapValue
    @Getter
    private String title;

    @ValueMapValue
    @Getter
    private String description;

    @ValueMapValue
    @Getter
    private String buttonLink;

    @ValueMapValue
    @Getter
    private String buttonLabel;

    @ValueMapValue
    @Getter
    private String linkTarget;
}
