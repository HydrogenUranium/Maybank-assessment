package com.positive.dhl.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import javax.inject.Inject;
import javax.inject.Named;

/**
 *
 */
@Model(adaptables=Resource.class)
public class ConfigurableMarketoForm {
	@Inject
	@Named("marketoid")
	@Optional
	public String marketoid;

	@Inject
	@Named("marketoformid")
	@Optional
	public String marketoformid;

	@Inject
	@Named("marketohiddenformid")
	@Optional
	public String marketohiddenformid;

	@Inject
	@Named("marketohost")
	@Optional
	public String marketohost;

	@Inject
	@Named("thanksurl")
	@Optional
	public String thanksurl;

	@Inject
	@Named("formtitle")
	@Optional
	public String formtitle;

	@Inject
	@Named("shipnowtitle")
	@Optional
	public String shipnowtitle;

	@Inject
	@Named("shipnowcontent")
	@Optional
	public String shipnowcontent;

	public String getVisibleFormHost(){
		return (null != marketohost && !marketoformid.isBlank()) ? marketohost : "https://express-resource.dhl.com";
	}
}
