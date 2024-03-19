package com.positive.dhl.core.models;

import com.positive.dhl.core.services.PathUtilService;
import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables= Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class LinkModel {
    @OSGiService
    private PathUtilService pathUtilService;

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
