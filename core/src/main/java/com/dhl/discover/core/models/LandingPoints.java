package com.dhl.discover.core.models;

import com.dhl.discover.core.injectors.InjectHomeProperty;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Getter
@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class LandingPoints {
	@Named("items")
	@ChildResource
	@Getter(AccessLevel.NONE)
	private Resource linksResource;

	@ValueMapValue
	private String image;

	@ValueMapValue
	@Default(values = "icon")
	private String pointType;

	@ValueMapValue
	@Default(values = "")
	private String altText;

	@InjectHomeProperty
	@Named("landingPoints-defaultIcon")
	private String defaultIcon;

	@ValueMapValue
	private String titleType;

	private final List<LandingPointItem> landingPointItems = new ArrayList<>();

	public List<LandingPointItem> getLandingPointItems() {
		return new ArrayList<>(landingPointItems);
	}

	public String getTitleType() {
		return titleType;
	}

	@PostConstruct
	protected void init() {
		if (linksResource != null) {
			Iterator<Resource> linkResources = linksResource.listChildren();
			while (linkResources.hasNext()) {
				LandingPointItem link = linkResources.next().adaptTo(LandingPointItem.class);
				if (link != null) {
					landingPointItems.add(link);
				}
			}
		}
	}
}