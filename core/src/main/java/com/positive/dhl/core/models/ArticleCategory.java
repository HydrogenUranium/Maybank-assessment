package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class ArticleCategory {
	@Inject
	private ResourceResolver resourceResolver;
	
    @Inject
    public String path;
	
    private Boolean current;
    private int index;
	private String title;
	private String listimage;
	private Boolean external;
	
    /**
	 * 
	 */
	public Boolean getCurrent() {
		return current;
	}

    /**
	 * 
	 */
	public void setCurrent(Boolean current) {
		this.current = current;
	}

    /**
	 * 
	 */
	public int getIndex() {
		return index;
	}

    /**
	 * 
	 */
	public void setIndex(int index) {
		this.index = index;
	}

    /**
	 * 
	 */
	public String getTitle() {
		return title;
	}

    /**
	 * 
	 */
	public void setTitle(String title) {
		this.title = title;
	}

    /**
	 * 
	 */
	public String getListimage() {
		return listimage;
	}

    /**
	 * 
	 */
	public void setListimage(String listimage) {
		this.listimage = listimage;
	}

    /**
	 * 
	 */
	public Boolean getExternal() {
		return external;
	}

    /**
	 * 
	 */
	public void setExternal(Boolean external) {
		this.external = external;
	}

    /**
	 * 
	 */
	public ArticleCategory() { }
	
    /**
	 * 
	 */
	public ArticleCategory(String path, ResourceResolver resourceResolver) {
		this.resourceResolver = resourceResolver;
		this.path = path;
		this.external = false;
		this.init();
	}
    
    /**
	 * 
	 */
    @PostConstruct
	protected void init() {
		Resource resource = resourceResolver.getResource(path);
		if (resource != null) {
	    		ValueMap properties = resource.adaptTo(ValueMap.class);
	    		if (properties != null) {
	    			String fullTitle = properties.get("jcr:content/jcr:title", "");
	    			title = properties.get("jcr:content/navTitle", "");
	    			if ((title == null) || (title.trim().length() == 0)) {
	    				title = fullTitle;
	    			}

	    			listimage = properties.get("jcr:content/listimage", "");
	    		}
		}
	}
}