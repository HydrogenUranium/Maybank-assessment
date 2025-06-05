package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;

import javax.annotation.PostConstruct;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
        defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)

@Getter
public class CtaBannerV2 extends AdaptiveImage {

    @ValueMapValue
    private String topTitle;

    private static final boolean disabled = false;

    @Self
    private Image defaultImageModel;

    @PostConstruct
    protected void init() {
        super.initModel();
    }
}
