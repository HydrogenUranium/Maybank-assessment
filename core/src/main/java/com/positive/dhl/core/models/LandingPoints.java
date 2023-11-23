package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectAsset;
import com.positive.dhl.core.injectors.InjectHomeAssetProperty;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Getter
@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class LandingPoints {
	@Inject
	@Named("items")
	@ChildResource
	private Resource linksResource;

	@InjectAsset
	private String image;

	@Inject
	@Default(values = "icon")
	private String pointType;

	@Inject
	@Default(values = "")
	private String altText;

	@InjectHomeAssetProperty
	@Named("landingPoints-defaultIcon")
	private String defaultIcon;

	private final List<LandingPointItem> landingPointItems = new ArrayList<>();

	public List<LandingPointItem> getLandingPointItems() {
		return new ArrayList<>(landingPointItems);
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