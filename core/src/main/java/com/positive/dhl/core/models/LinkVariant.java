package com.positive.dhl.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 *
 */
@Model(adaptables=Resource.class)
public class LinkVariant extends Link {
    @ValueMapValue
    public String home;

    /**
	 *
	 */
    public LinkVariant(String name, String link, String home) {
        super(name, link);
        this.home = home;
    }
}