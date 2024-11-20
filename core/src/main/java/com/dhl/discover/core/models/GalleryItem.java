package com.dhl.discover.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 *
 */
@Model(adaptables=Resource.class)
public class GalleryItem {
    @ValueMapValue
    @Named("title")
    @Optional
    public String title;
	
    @ValueMapValue
    @Named("brief")
    @Optional
    public String brief;
	
    @ValueMapValue
    @Named("imagemob")
    @Optional
    public String imagemob;
	
    @ValueMapValue
    @Named("imagetab")
    @Optional
    public String imagetab;
	
    @ValueMapValue
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
    	//no initialization required at the moment
	}
}