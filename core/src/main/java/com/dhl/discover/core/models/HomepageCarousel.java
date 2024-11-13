package com.dhl.discover.core.models;
 
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * @deprecated (will be removed together with homepagecarousel )
 */
@Deprecated(since = "2.1", forRemoval = true)
@Model(adaptables=Resource.class)
public class HomepageCarousel {
	@ValueMapValue
	@Named("items")
	private static Resource linksResource;

	private static List<HomepageCarouselItem> carouselitems;
	
    /**
	 * 
	 */
	public static List<HomepageCarouselItem> getCarouselitems() {
		return new ArrayList<HomepageCarouselItem>(carouselitems);
	}

    /**
	 * 
	 */
	public static void setCarouselitems(List<HomepageCarouselItem> carouselitems) {
		HomepageCarousel.carouselitems = new ArrayList<HomepageCarouselItem>(carouselitems);
	}

    /**
	 * 
	 */
	@PostConstruct
	protected static void init() {
		carouselitems = new ArrayList<HomepageCarouselItem>();
		if (linksResource != null) {
			int count = 0;
			Iterator<Resource> linkResources = linksResource.listChildren();
			while (linkResources.hasNext()) {
				HomepageCarouselItem item = linkResources.next().adaptTo(HomepageCarouselItem.class);
				if (item != null) {
					item.setIndex(count);
					carouselitems.add(item);
					count++;
				}
			}
		}
	}
}