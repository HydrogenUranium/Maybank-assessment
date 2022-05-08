package com.positive.dhl.core.models;
 
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class Stats {
	private List<Stat> statitems;

	@Inject
	@Named("items")
	private Resource linksResource;
	
    /**
	 * 
	 */
	public List<Stat> getStatitems() {
		return new ArrayList<Stat>(statitems);
	}

    /**
	 * 
	 */
	public void setStatitems(List<Stat> statitems) {
		this.statitems = new ArrayList<Stat>(statitems);
	}
	
    /**
	 * 
	 */
	@PostConstruct
	protected void init() {
		statitems = new ArrayList<Stat>();
		if (linksResource != null) {
			int count = 0;
			Iterator<Resource> linkResources = linksResource.listChildren();
			while (linkResources.hasNext()) {
				Stat stat = linkResources.next().adaptTo(Stat.class);
				if (stat != null) {
					stat.setIndex(++count);
					statitems.add(stat);
				}
			}
		}
	}
}