/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.models;

import com.google.gson.JsonObject;
import com.positive.dhl.core.components.EnvironmentConfiguration;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import java.text.MessageFormat;

/**
 * Sling model that makes the Marketo configuration values available to HTL
 * templates
 */
@Model(adaptables = SlingHttpServletRequest.class, resourceType = MarketoConfiguration.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)

public class MarketoConfiguration {

	@OSGiService
	EnvironmentConfiguration environmentConfiguration;

	static final String RESOURCE_TYPE = "apps/dhl/components/content/inlineshipnowmarketo";

	/**
	 * Marketo form id - that's how we identify specific form within Marketo project
	 */
	@ValueMapValue
	private String marketoFormId;

	/**
	 * Marketo munchkin id - also called Marketo project - is an identifier of a
	 * project in Marketo,
	 * it may contain one or more forms with different IDs
	 */
	@ValueMapValue
	private String marketoMunchkinId;
	/**
	 * Marketo hidden form id - identifier of the 'hidden' marketo form within
	 * Marketo project
	 */
	@ValueMapValue
	private String hiddenMarketoId;
	/**
	 * Marketo munchkin id - also called Marketo project - is an identifier of a
	 * 'hidden' project in Marketo,
	 * it may contain one or more forms with different IDs
	 */
	@ValueMapValue
	private String hiddenMarketoMunchkinId;
	/**
	 * This is a hostname where we try to get the form objects from
	 */
	@ValueMapValue
	private String marketoHostname;

	private static final String MKTO_FORM_PLACEHOLDER = "mktoForm_{0}";

	/**
	 * Provides the Marketo 'form' element ID value
	 * ({@code <form id="xxxx"></form>})
	 * 
	 * @return a {@link String} that represents the HTML id value of the Marketo
	 *         form element
	 */
	public String getFormIdAsDivId() {
		String defaultFormId = environmentConfiguration.getDefaultMarketoFormId();
		var marketoFormIdDiv = MessageFormat.format(MKTO_FORM_PLACEHOLDER, defaultFormId);
		if (null != marketoFormId && !marketoFormId.isBlank()) {
			marketoFormIdDiv = MessageFormat.format(MKTO_FORM_PLACEHOLDER, marketoFormId);
		}
		return marketoFormIdDiv;
	}

	/**
	 * Provides the Marketo 'form' element ID value
	 * ({@code <form id="xxxx"></form>})
	 * 
	 * @return a {@link String} that represents the HTML id value of the Marketo
	 *         form element
	 */
	public String getHiddenFormIdAsDivId() {
		String defaultHiddenFormId = environmentConfiguration.getDefaultMarketoHiddenFormId();
		var marketoFormIdDiv = MessageFormat.format(MKTO_FORM_PLACEHOLDER, defaultHiddenFormId);
		if (null != hiddenMarketoId && !hiddenMarketoId.isBlank()) {
			marketoFormIdDiv = MessageFormat.format(MKTO_FORM_PLACEHOLDER, hiddenMarketoId);
		}
		return marketoFormIdDiv;
	}

	/**
	 * Fetches the Marketo hostname
	 * 
	 * @return String representing marketo hostname
	 */
	public String getMarketoHostname() {
		if (null != marketoHostname && !marketoHostname.isBlank()) {
			return marketoHostname;
		}
		return "https://express-resource.dhl.com";
	}

	/**
	 * Provides marketo form id
	 * 
	 * @return String representing marketo form id, or default value
	 */
	public String getMarketoFormId() {
		if (marketoFormId != null && !marketoFormId.isBlank()) {
			return marketoFormId;
		}
		return "1795";
	}

	/**
	 * Provides marketo form id
	 * 
	 * @return String representing marketo form id, or default value
	 */
	public String getMarketoFormIdDummy() {
		JsonObject responseJson = new JsonObject();
		responseJson.addProperty("status", "ok");
		responseJson.addProperty("status1", "ok");
		responseJson.addProperty("status2", "ok");
		responseJson.addProperty("status3", "ok");
		responseJson.addProperty("status4", "ok");
		responseJson.addProperty("status5", "ok");
		responseJson.addProperty("status6", "ok");
		responseJson.addProperty("status7", "ok");
		responseJson.addProperty("status8", "ok");
		responseJson.addProperty("status9", "ok");
		responseJson.addProperty("status10", "ok");
		responseJson.addProperty("status13", "ok");
		responseJson.addProperty("status14", "ok");
		responseJson.addProperty("status15", "ok");
		responseJson.addProperty("status16", "ok");
		responseJson.addProperty("status17", "ok");
		if (marketoFormId != null && !marketoFormId.isBlank()) {
			return marketoFormId;
		}
		return "1795dummy";
	}

	/**
	 * Provides Marketo munchkinID
	 * 
	 * @return String representing munchkin id, or default value
	 */
	public String getMarketoMunchkinId() {
		if (marketoMunchkinId != null && !marketoMunchkinId.isBlank()) {
			return marketoMunchkinId;
		}
		return "903-EZK-832";
	}

	/**
	 * Provides 'hidden' marketo form id
	 * 
	 * @return String representing marketo hidden form id, or default value
	 */
	public String getHiddenMarketoId() {
		if (hiddenMarketoId != null && !hiddenMarketoId.isBlank()) {
			return hiddenMarketoId;
		}
		return "1756";
	}

	/**
	 * Provides 'hidden' marketo munchkin id
	 * 
	 * @return String representing munchkin id of hidden form, or default value
	 */
	public String getHiddenMarketoMunchkinId() {
		if (hiddenMarketoMunchkinId != null && !hiddenMarketoMunchkinId.isBlank()) {
			return hiddenMarketoMunchkinId;
		}
		return "078-ERT-522";
	}
}
