package com.dhl.discover.core.models;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 *
 */
@Model(adaptables=Resource.class)
public class ArticleCategory {
	@SlingObject
	private ResourceResolver resourceResolver;
	
    @ValueMapValue
    public String path;
	
    private Boolean current;
    private int index;
	private String title;
	private String pageImage;
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
	public String getPageImage() {
		return pageImage;
	}

    /**
	 *
	 */
	public void setPageImage(String pageImage) {
		this.pageImage = pageImage;
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
		var resource = resourceResolver.getResource(path);
		if (resource != null) {
	    		ValueMap properties = resource.adaptTo(ValueMap.class);
	    		if (properties != null) {
	    			String fullTitle = properties.get("jcr:content/jcr:title", "");
	    			title = properties.get("jcr:content/navTitle", fullTitle);

	    			pageImage = properties.get("jcr:content/cq:featuredimage/fileReference", "");
	    		}
		}
	}
}