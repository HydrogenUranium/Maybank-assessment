package com.positive.dhl.core.models;

import javax.inject.Inject;

import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class LanguageVariant {
	@Inject
	private ResourceResolver resourceResolver;

	@Getter
	@Setter
	public String region;

    @Inject
	@Getter
    public String name;

	@Inject
	@Getter
	public String home;

    @Inject
	@Getter
    public String link;
    
    @Inject
	@Getter
    public String acceptlanguages;
    
    @Inject
	@Getter
    public boolean deflt;
    
    @Inject
	@Getter
    public boolean current;

	@Inject
	@Getter
	public boolean exact;
	
    public LanguageVariant(String name, String home, String link, String acceptlanguages, boolean deflt, boolean current, boolean exact) {
		this.home = home;
		this.link = resourceResolver.map(link);
		this.acceptlanguages = acceptlanguages;
		this.name = name;
		this.deflt = deflt;
		this.current = current;
		this.exact = exact;
    }
}