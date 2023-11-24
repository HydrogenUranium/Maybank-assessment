package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectAsset;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class ErrorBanner {

    @Inject
    private String title;

    @Inject
    private String description;

    @Inject
    private String buttonLink;

    @Inject
    private String buttonLabel;

    @InjectAsset
    private String image;

    @Inject
    @Default(values = "")
    private String altText;

}
