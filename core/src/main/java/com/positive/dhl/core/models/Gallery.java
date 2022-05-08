package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

/**
 *
 */
@Model(adaptables=Resource.class)
public class Gallery {
	@Inject
	@Named("slides")
	@Optional
	private Resource slidesResource;

	private List<GalleryItem> slides;

    /**
	 * 
	 */
	public List<GalleryItem> getSlides() {
		return new ArrayList<GalleryItem>(slides);
	}

    /**
	 * 
	 */
	public void setSlides(List<GalleryItem> slides) {
		this.slides = new ArrayList<GalleryItem>(slides);
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
		slides = new ArrayList<GalleryItem>();
		if (slidesResource != null) {
			Iterator<Resource> optionResources = slidesResource.listChildren();
			while (optionResources.hasNext()) {
				GalleryItem item = optionResources.next().adaptTo(GalleryItem.class);
				if (item != null) {
					slides.add(item);
				}
			}
		}
	}
}
