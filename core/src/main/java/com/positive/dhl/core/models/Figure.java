package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import com.day.cq.dam.api.DamConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import com.day.cq.dam.api.Asset;

/**
 *
 */
@Model(adaptables=Resource.class)
public class Figure {
	@Inject
	private ResourceResolver resourceResolver;
    
	@Inject
	@Named("alignment")
	@Optional
	private String alignment;

	@Inject
	@Named("imagernd")
	@Optional
	private String imagernd;

	@Inject
	@Named("caption1")
	@Optional
	private String caption1;

	@Inject
	@Named("caption2")
	@Optional
	private String caption2;

	@Inject
	@Named("content")
	@Optional
	private String content;
	
	private String alt;

	
    public String getAlignment() {
		return alignment;
	}


	public void setAlignment(String alignment) {
		this.alignment = alignment;
	}


	public String getImagernd() {
		return imagernd;
	}


	public void setImagernd(String imagernd) {
		this.imagernd = imagernd;
	}


	public String getCaption1() {
		return caption1;
	}


	public void setCaption1(String caption1) {
		this.caption1 = caption1;
	}


	public String getCaption2() {
		return caption2;
	}


	public void setCaption2(String caption2) {
		this.caption2 = caption2;
	}


	public String getAlt() {
		return alt;
	}


	public void setAlt(String alt) {
		this.alt = alt;
	}


	public String getContent() {
		return content;
	}


	public void setContent(String content) {
		this.content = content;
	}


	/**
	 * 
	 */
	@PostConstruct
	protected void init() {
		if ((imagernd != null) && (imagernd.length() > 0)) {
			Resource resource = resourceResolver.getResource(imagernd);
			if (resource != null) {
				Asset asset = resource.adaptTo(Asset.class);
				
				if (asset != null) {
					alt = asset.getMetadataValue(DamConstants.DC_DESCRIPTION);
				}
			}
		}

		resourceResolver.close();
	}
}
	