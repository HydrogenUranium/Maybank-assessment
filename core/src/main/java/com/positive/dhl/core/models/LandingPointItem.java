package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class LandingPointItem {
	@Inject
    public String title;

    @Inject
    public String content;

	private int index;
	
    /**
	 * 
	 */
    public int getIndex() {
		return index;
	}

    /**
	 * 
	 */
	public void setIndex(int index) {
		this.index = index;
	}

    /**
	 * 
	 */
    @PostConstruct
	protected void init() {
    	
	}
}