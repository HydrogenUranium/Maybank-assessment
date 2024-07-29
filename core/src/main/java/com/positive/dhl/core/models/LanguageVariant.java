package com.positive.dhl.core.models;

import javax.inject.Inject;
import javax.inject.Named;

import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
@Getter
public class LanguageVariant {
	@Setter
	public String region;

	@Inject
	public String name;

	@Inject
	@Named("jcr:title")
	public String title;

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

	public LanguageVariant(String name, String title, String home, String link, String acceptlanguages, boolean deflt, boolean current, boolean exact) {
		this.home = home;
		this.title = title;
		this.link = link;
		this.acceptlanguages = acceptlanguages;
		this.name = name;
		this.deflt = deflt;
		this.current = current;
		this.exact = exact;
	}
}