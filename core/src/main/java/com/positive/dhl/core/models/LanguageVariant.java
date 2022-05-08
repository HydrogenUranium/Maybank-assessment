package com.positive.dhl.core.models;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class LanguageVariant {
    @Inject
    public String name;

	@Inject
	public String home;

    @Inject
    public String link;
    
    @Inject
    public String acceptlanguages;
    
    @Inject
    public Boolean deflt;
    
    @Inject
    public Boolean current;

	@Inject
	public Boolean exact;
	
    /**
	 * 
	 */
	public String getName() {
		return name;
	}

    /**
	 * 
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 *
	 */
	public String getHome() {
		return home;
	}

	/**
	 *
	 */
	public void setHome(String home) {
		this.home = home;
	}

    /**
	 * 
	 */
	public String getLink() {
		return link;
	}

    /**
	 * 
	 */
	public void setLink(String link) {
		this.link = link;
	}
	
    /**
	 * 
	 */
	public String getAcceptLanguages() {
		return acceptlanguages;
	}

    /**
	 * 
	 */
	public void setAcceptLanguages(String acceptlanguages) {
		this.acceptlanguages = acceptlanguages;
	}
	
    /**
	 * 
	 */
	public Boolean getDeflt() {
		return deflt;
	}

    /**
	 * 
	 */
	public void setDeflt(Boolean deflt) {
		this.deflt = deflt;
	}

	/**
	 *
	 */
	public Boolean getCurrent() {
		return current;
	}

	/**
	 *
	 */
	public void setCurrent(Boolean current) {
		this.current = current;
	}

	/**
	 *
	 */
	public Boolean getExact() {
		return exact;
	}

	/**
	 *
	 */
	public void setExact(Boolean exact) {
		this.exact = exact;
	}
    
    /**
	 * 
	 */
    public LanguageVariant(String name, String home, String link, String acceptlanguages, Boolean deflt, Boolean current, Boolean exact) {
		this.home = home;
		this.link = link;
		this.acceptlanguages = acceptlanguages;
		this.name = name;
		this.deflt = deflt;
		this.current = current;
		this.exact = exact;
    }
}