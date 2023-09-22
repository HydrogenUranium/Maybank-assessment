package com.positive.dhl.core.models;

import javax.inject.Inject;

import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class LanguageVariant {
	@Getter
	@Setter
	public String region;

    @Inject
    public String name;

	@Inject
	public String home;

    @Inject
    public String link;
    
    @Inject
    public String acceptlanguages;
    
    @Inject
    public boolean deflt;
    
    @Inject
    public boolean current;

	@Inject
	public boolean exact;
	
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
	public boolean getDeflt() {
		return deflt;
	}

    /**
	 * 
	 */
	public void setDeflt(boolean deflt) {
		this.deflt = deflt;
	}

	/**
	 *
	 */
	public boolean getCurrent() {
		return current;
	}

	/**
	 *
	 */
	public void setCurrent(boolean current) {
		this.current = current;
	}

	/**
	 *
	 */
	public boolean getExact() {
		return exact;
	}

	/**
	 *
	 */
	public void setExact(boolean exact) {
		this.exact = exact;
	}
    
    /**
	 * 
	 */
    public LanguageVariant(String name, String home, String link, String acceptlanguages, boolean deflt, boolean current, boolean exact) {
		this.home = home;
		this.link = link;
		this.acceptlanguages = acceptlanguages;
		this.name = name;
		this.deflt = deflt;
		this.current = current;
		this.exact = exact;
    }
}