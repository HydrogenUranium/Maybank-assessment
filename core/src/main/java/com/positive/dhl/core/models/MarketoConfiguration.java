/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.models;

import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling model that makes the Marketo configuration values available to HTL templates
 */
@Model(
		adaptables = SlingHttpServletRequest.class,
		resourceType = MarketoConfiguration.RESOURCE_TYPE,
		defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)

public class MarketoConfiguration {

	static final String RESOURCE_TYPE = "apps/dhl/components/content/inlineshipnowmarketo/v2";

	/**
	 * Marketo form id - that's how we identify specific form within Marketo project
	 */
	@ValueMapValue
	private @Getter String marketoFormId;
	/**
	 * Marketo munchkin id - also called Marketo project - is an identifier of a project in Marketo,
	 * it may contain one or more forms with different IDs
	 */
	@ValueMapValue
	private @Getter String marketoMunchkinId;
	/**
	 * Marketo hidden form id - identifier of the 'hidden' marketo form within Marketo project
	 */
	@ValueMapValue
	private @Getter String hiddenMarketoId;
	/**
	 * Marketo munchkin id - also called Marketo project - is an identifier of a 'hidden' project in Marketo,
	 * it may contain one or more forms with different IDs
	 */
	@ValueMapValue
	private @Getter String hiddenMarketoMunchkinId;
	/**
	 * This is a hostname where we try to get the form objects from
	 */
	@ValueMapValue
	private @Getter String marketoHostname;
}
