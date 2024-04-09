package com.positive.dhl.core.models;

import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class ErrorBanner {

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String description;

    @ValueMapValue
    private String buttonLink;

    @ValueMapValue
    private String refreshPageButtonLabel;

    @ValueMapValue
    private String buttonLabel;

    @ValueMapValue
    @Default(values = "")
    private String image;

    @ValueMapValue
    @Default(values = "")
    private String altText;

}
