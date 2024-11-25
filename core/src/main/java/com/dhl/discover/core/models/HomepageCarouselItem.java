package com.dhl.discover.core.models;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * (will be removed together with homepagecarousel )
 */
//@Deprecated(since = "2.1", forRemoval = true)
@Model(adaptables=Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class HomepageCarouselItem {
    @ValueMapValue
    public String imagemob;
	
    @ValueMapValue
    public String imagetab;
	
    @ValueMapValue
    public String imagedt;

    @ValueMapValue
    public String title;

    @ValueMapValue
    public String subtitle;

    @ValueMapValue
    public String readtime;

    @ValueMapValue
    public Date date;
    
    @ValueMapValue
    public String description;

    @ValueMapValue
    public String mediatype;

    @ValueMapValue
    public String ctatext;

    @ValueMapValue
    public String ctapath;

    @ValueMapValue
    public String ctagrouppath;

    private String dateformatted;
    private String dateformattedfriendly;
	private int index;
	
    /**
	 * 
	 */
    public String getDateformatted() {
		return dateformatted;
	}

    /**
	 * 
	 */
	public void setDateformatted(String dateformatted) {
		this.dateformatted = dateformatted;
	}

    /**
	 * 
	 */
	public String getDateformattedfriendly() {
		return dateformattedfriendly;
	}

    /**
	 * 
	 */
	public void setDateformattedfriendly(String dateformattedfriendly) {
		this.dateformattedfriendly = dateformattedfriendly;
	}

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
	    	dateformatted = (new SimpleDateFormat("yyyy-MM-dd")).format(date);
	    	dateformattedfriendly = (new SimpleDateFormat("dd MMMM yyyy")).format(date);
	}
}