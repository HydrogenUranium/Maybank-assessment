package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class Stat {
	private int index;

	@Inject
    public String title;

    @Inject
    public String content;
	
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
    	//default initialization
	}
}