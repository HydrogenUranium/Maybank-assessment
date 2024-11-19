package com.positive.dhl.core.models.common;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class Tab {

    @ValueMapValue
    private String image;

    @ValueMapValue
    private String imageAltText;

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String body;

    public String getImageAltText() {
        return StringUtils.defaultIfBlank(imageAltText,title);
    }
}
