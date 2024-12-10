package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables= Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class LinkModel {

    @Getter
    @ValueMapValue
    private String linkName;

    @Getter
    @ValueMapValue
    private String linkPath;

    @Getter
    @ValueMapValue
    private String linkIcon;
}
