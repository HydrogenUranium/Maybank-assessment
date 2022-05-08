package com.positive.dhl.core.models;

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
public class GalleryItem {
    @Inject
    @Named("title")
    @Optional
    public String title;
	
    @Inject
    @Named("brief")
    @Optional
    public String brief;
	
    @Inject
    @Named("imagemob")
    @Optional
    public String imagemob;
	
    @Inject
    @Named("imagetab")
    @Optional
    public String imagetab;
	
    @Inject
    @Named("imagedt")
    @Optional
    public String imagedt;

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