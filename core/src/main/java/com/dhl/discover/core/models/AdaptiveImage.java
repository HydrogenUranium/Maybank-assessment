package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.dhl.discover.core.injectors.InjectChildImageModel;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import javax.inject.Named;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class AdaptiveImage {
    @Self
    private Image defaultImageModel;

    @InjectChildImageModel
    @Named("mobileImage")
    protected Image mobileImageModel;

    @InjectChildImageModel
    @Named("tabletImage")
    protected Image tabletImageModel;

    @InjectChildImageModel
    @Named("desktopImage")
    protected Image desktopImageModel;
}
