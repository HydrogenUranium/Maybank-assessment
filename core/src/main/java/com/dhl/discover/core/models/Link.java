package com.dhl.discover.core.models;


import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 *
 */
@Model(adaptables=Resource.class)
public class Link {
    @ValueMapValue
    public String name;

    @ValueMapValue
    public String url;
    
    /**
	 * 
	 */
    public Link(String name, String url) {
    		this.url = url;
    		this.name = name;
    }
}