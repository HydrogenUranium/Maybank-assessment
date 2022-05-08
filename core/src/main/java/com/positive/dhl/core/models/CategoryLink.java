package com.positive.dhl.core.models;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class CategoryLink {
    @Inject
    public String category;
    
    @Inject
    public String name;

    @Inject
    public String link;
    
    /**
	 * 
	 */
    public CategoryLink(String category, String name, String link) {
    		this.link = link;
    		this.name = name;
    		this.category = category;
    }
}