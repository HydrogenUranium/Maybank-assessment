/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.models;

import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling model representing the 'country' node in repository
 */
@Model(
		adaptables = { Resource.class, SlingHttpServletRequest.class }
)
@Getter
public class Country {

	@ValueMapValue(name="countryName")
	private String countryName;

	@ValueMapValue(name="callingCode")
	private long callingCode;

	@ValueMapValue(name="currency")
	private String currency;

}
