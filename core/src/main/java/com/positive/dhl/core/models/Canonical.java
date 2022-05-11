package com.positive.dhl.core.models;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class Canonical {
    @Inject
    public String url;

    /**
	 * 
	 */
    public Canonical(String url) {
        this.url = url;
    }
}
