package com.dhl.discover.core.models;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.inject.Named;

/**
 *
 */
@Model(adaptables=Resource.class)
public class ConfigurableMarketoForm {
	@ValueMapValue
	@Named("marketoid")
	@Optional
	public String marketoid;

	@ValueMapValue
	@Named("marketoformid")
	@Optional
	public String marketoformid;

	@ValueMapValue
	@Named("marketohiddenformid")
	@Optional
	public String marketohiddenformid;

	@ValueMapValue
	@Named("marketohost")
	@Optional
	public String marketohost;

	@ValueMapValue
	@Named("thanksurl")
	@Optional
	public String thanksurl;

	@ValueMapValue
	@Named("formtitle")
	@Optional
	public String formtitle;

	@ValueMapValue
	@Named("shipnowtitle")
	@Optional
	public String shipnowtitle;

	@ValueMapValue
	@Named("shipnowcontent")
	@Optional
	public String shipnowcontent;

	public String getVisibleFormHost(){
		return !StringUtils.isAnyBlank(marketohost, marketoformid) ? marketohost : "https://express-resource.dhl.com";
	}
}
