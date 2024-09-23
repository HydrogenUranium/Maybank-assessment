package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.services.AssetUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

/**
 *
 */
@Getter
@Setter
@Model(adaptables=Resource.class)
public class ArticleCategory {
	@OSGiService
	private AssetUtilService assetUtilService;

	@Inject
	@Getter(AccessLevel.NONE)
	private ResourceResolver resourceResolver;
	
    @Inject
	@Getter(AccessLevel.NONE)
	public String path;
	
    private Boolean current;
    private int index;
	private String title;
	private String listimage; // Deprecated
	private String pageImage;
	private Boolean external;

	public ArticleCategory() {
	}

	public ArticleCategory(String path, ResourceResolver resourceResolver) {
		this.resourceResolver = resourceResolver;
		this.path = path;
		this.external = false;
		this.init();
	}
    
    @PostConstruct
	protected void init() {
		var resource = resourceResolver.getResource(path);
		if (resource != null) {
	    		ValueMap properties = resource.adaptTo(ValueMap.class);
	    		if (properties != null) {
	    			String fullTitle = properties.get("jcr:content/jcr:title", "");
	    			title = properties.get("jcr:content/navTitle", "");
	    			if (StringUtils.isBlank(title)) {
	    				title = fullTitle;
	    			}

	    			listimage = properties.get("jcr:content/listimage", ""); // Deprecated
					pageImage = assetUtilService.getPageImagePath(resource);
				}
		}
	}
}