package com.positive.dhl.core.models;

import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import java.text.MessageFormat;

/**
 * Sling model that makes the Marketo configuration values available to HTL templates
 */
@Model(
		adaptables = SlingHttpServletRequest.class,
		defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Getter
public class MarketoConfiguration {

	/**
	 * Marketo form id - that's how we identify specific form within Marketo project
	 */
	@ValueMapValue
	@Default(values = "1795")
	private String marketoFormId;

	/**
	 * Marketo munchkin id - also called Marketo project - is an identifier of a project in Marketo,
	 * it may contain one or more forms with different IDs
	 */
	@ValueMapValue
	@Default(values = "903-EZK-832")
	private  String marketoMunchkinId;
	/**
	 * Marketo hidden form id - identifier of the 'hidden' marketo form within Marketo project
	 */
	@ValueMapValue
	@Default(values = "1756")
	private  String hiddenMarketoId;
	/**
	 * Marketo munchkin id - also called Marketo project - is an identifier of a 'hidden' project in Marketo,
	 * it may contain one or more forms with different IDs
	 */
	@ValueMapValue
	@Default(values = "078-ERT-522")
	private  String hiddenMarketoMunchkinId;
	/**
	 * This is a hostname where we try to get the form objects from
	 */
	@ValueMapValue
	@Default(values = "https://express-resource.dhl.com")
	private String marketoHostname;

	private static final String MKTO_FORM_PLACEHOLDER = "mktoForm_{0}";

	/**
	 * Provides the Marketo 'form' element ID value ({@code <form id="xxxx"></form>})
	 * @return a {@link String} that represents the HTML id value of the Marketo form element
	 */
	public String getFormIdAsDivId(){
		var marketoFormIdDiv = MessageFormat.format(MKTO_FORM_PLACEHOLDER, getMarketoFormId());
		if(null != marketoFormId && !marketoFormId.isBlank()){
			marketoFormIdDiv = MessageFormat.format(MKTO_FORM_PLACEHOLDER, marketoFormId);
		}
		return marketoFormIdDiv;
	}

	/**
	 * Provides the Marketo 'form' element ID value ({@code <form id="xxxx"></form>})
	 * @return a {@link String} that represents the HTML id value of the Marketo form element
	 */
	public String getHiddenFormIdAsDivId(){
		var marketoFormIdDiv = MessageFormat.format(MKTO_FORM_PLACEHOLDER,getHiddenMarketoId());
		if(null != hiddenMarketoId && !hiddenMarketoId.isBlank()){
			marketoFormIdDiv = MessageFormat.format(MKTO_FORM_PLACEHOLDER, hiddenMarketoId);
		}
		return marketoFormIdDiv;
	}
}
