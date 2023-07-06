package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.components.EnvironmentConfiguration;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

/**
 * 
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class TopBanner {
	@Inject
	private Page currentPage;
	
	private Boolean hasbanner;
	private String title;
    private String subtitle;
    private String img;
    private String url;
    private String urltitle;

	@OSGiService
	private EnvironmentConfiguration environmentConfiguration;
    
    /**
	 * 
	 */
    public Boolean getHasbanner() {
		return hasbanner;
	}

    /**
	 * 
	 */
    public void setHasbanner(Boolean hasbanner) {
		this.hasbanner = hasbanner;
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
    public String getSubtitle() {
		return subtitle;
	}

    /**
	 * 
	 */
    public void setSubtitle(String subtitle) {
		this.subtitle = subtitle;
	}

    /**
	 * 
	 */
    public String getImg() {
		return img;
	}

    /**
	 * 
	 */
    public void setImg(String img) {
		this.img = img;
	}

    /**
	 * 
	 */
	public String getUrl() {
		return url;
	}

    /**
	 * 
	 */
	public void setUrl(String url) {
		this.url = url;
	}

    /**
	 * 
	 */
	public String getUrltitle() {
		return urltitle;
	}

    /**
	 * 
	 */
	public void setUrltitle(String urltitle) {
		this.urltitle = urltitle;
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
    	hasbanner = false;
    	
		Page home = currentPage.getAbsoluteParent(2);
		ValueMap properties = home.adaptTo(ValueMap.class);
		if (properties != null) {
			String prefix = "0";
			
			ValueMap currentPageProperties = currentPage.adaptTo(ValueMap.class);
			if (currentPageProperties != null) {
				prefix = currentPageProperties.get("jcr:content/topbanner", "0");
			}
			
			if (("1").equals(prefix) || ("2").equals(prefix)) {
				hasbanner = true;
			}

			String assetPrefix = environmentConfiguration.getAssetPrefix();
			title = properties.get("jcr:content/topbanner" + prefix + "title", "");
			subtitle = properties.get("jcr:content/topbanner" + prefix + "subtitle", "");
			img = properties.get("jcr:content/topbanner" + prefix + "img", "");
			if (!img.isBlank()) {
				img = assetPrefix + img;
			}
			
			url = properties.get("jcr:content/topbanner" + prefix + "url", "");
			urltitle = properties.get("jcr:content/topbanner" + prefix + "urltitle", "");
		}
    }
}