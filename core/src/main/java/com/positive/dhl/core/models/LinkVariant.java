package com.positive.dhl.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

/**
 *
 */
@Model(adaptables=Resource.class)
public class LinkVariant extends Link {
    @Inject
    public String home;

    /**
	 *
	 */
    public LinkVariant(String name, String link, String home) {
        super(name, link);
        this.home = home;
    }
}