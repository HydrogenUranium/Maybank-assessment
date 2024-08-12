package com.positive.dhl.core.models.multifields;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class Tab {

    @Inject
    private String image;

    @Inject
    private String imageAltText;

    @Inject
    private String title;

    @Inject
    private String body;

    public String getImageAltText() {
        return StringUtils.isNoneBlank(imageAltText) ? imageAltText : title;
    }
}
