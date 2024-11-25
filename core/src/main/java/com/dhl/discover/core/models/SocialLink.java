package com.dhl.discover.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 *
 */
@Model(adaptables=Resource.class)
public class SocialLink {
    @ValueMapValue
    public String category;
    
    @ValueMapValue
    public String name;

    @ValueMapValue
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