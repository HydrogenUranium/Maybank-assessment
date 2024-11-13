package com.dhl.discover.core.models;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

/**
 * @deprecated (will be removed together with homepagecarousel )
 */
@Deprecated(since = "2.1", forRemoval = true)
@Model(adaptables=Resource.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class HomepageCarouselItem {
    @Inject
    public String imagemob;
	
    @Inject
    public String imagetab;
	
    @Inject
    public String imagedt;

    @Inject
    public String title;

    @Inject
    public String subtitle;

    @Inject
    public String readtime;

    @Inject
    public Date date;
    
    @Inject
    public String description;

    @Inject
    public String mediatype;

    @Inject
    public String ctatext;

    @Inject
    public String ctapath;

    @Inject
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