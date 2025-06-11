package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;

@Getter
@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
        defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class CtaBannerV2 extends AdaptiveImage {

    @ValueMapValue
    protected String title;

    @ValueMapValue
    private String topTitle;

    @Self
    private Image defaultImageModel;

    @ValueMapValue
    protected String buttonName;

    @ValueMapValue
    protected String buttonLink;

}
