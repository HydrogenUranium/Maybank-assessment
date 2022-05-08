package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

/**
 *
 */
@Model(adaptables=Resource.class)
public class CompetitionMultiChoice extends Competition {
	@Inject
	@Named("options")
	@Optional
	private Resource optionsResource;

	private List<String> options;
	
    /**
	 * 
	 */
	public List<String> getOptions() {
		return new ArrayList<String>(options);
	}

    /**
	 * 
	 */
	public void setOptions(List<String> options) {
		this.options = new ArrayList<String>(options);
	}

    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
		options = new ArrayList<String>();
		if (optionsResource != null) {
			Iterator<Resource> optionResources = optionsResource.listChildren();
			while (optionResources.hasNext()) {
				
				ValueMap item = optionResources.next().adaptTo(ValueMap.class);
				if (item != null) {
					options.add(item.get("text", ""));
				}
			}
		}
	}
}
