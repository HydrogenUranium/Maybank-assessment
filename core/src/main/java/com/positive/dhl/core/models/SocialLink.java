package com.positive.dhl.core.models;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class SocialLink {
    @Inject
    public String category;
    
    @Inject
    public String name;

    @Inject
    public String link;
    
    /**
	 * 
	 */
    public String categoryshort() {
    		switch (category) {
	    		case "youtube": return "yt";
	    		case "facebook": return "fb";
	    		case "instagram": return "ig";
	    		case "linkedin": return "li";
	    		case "twitter": return "tw";
	    		default: return "";
    		}
    }
    
    /**
	 * 
	 */
    public SocialLink(String category, String name, String link) {
    		this.link = link;
    		this.name = name;
    		this.category = category;
    }
}