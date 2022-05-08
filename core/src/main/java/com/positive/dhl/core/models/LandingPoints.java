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
public class LandingPoints {
	@Inject
	@Named("items")
	@Optional
	private Resource linksResource;

	private List<LandingPointItem> landingpointitems;
	
    /**
	 * 
	 */
	public List<LandingPointItem> getLandingpointitems() {
		return new ArrayList<LandingPointItem>(landingpointitems);
	}

    /**
	 * 
	 */
	public void setLandingpointitems(List<LandingPointItem> landingpointitems) {
		this.landingpointitems = new ArrayList<LandingPointItem>(landingpointitems);
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
		landingpointitems = new ArrayList<LandingPointItem>();
		if (linksResource != null) {
			int count = 0;
			Iterator<Resource> linkResources = linksResource.listChildren();
			while (linkResources.hasNext()) {
				LandingPointItem link = linkResources.next().adaptTo(LandingPointItem.class);
				if (link != null) {
					link.setIndex(++count);
					landingpointitems.add(link);
				}
			}
		}
	}
}