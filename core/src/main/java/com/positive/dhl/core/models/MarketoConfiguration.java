package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.text.MessageFormat;

/**
 * Sling model that makes the Marketo configuration values available to HTL templates
 */
@Model(
		adaptables = SlingHttpServletRequest.class,
		defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Slf4j
public class MarketoConfiguration {

	@OSGiService
	private PageUtilService pageUtilService;

	@Inject
	private Page currentPage;

	@Inject
	private String marketoSourceType;

	/**
	 * Marketo form id - that's how we identify specific form within Marketo project
	 */
	@ValueMapValue
	private String marketoFormId;

	/**
	 * Marketo munchkin id - also called Marketo project - is an identifier of a project in Marketo,
	 * it may contain one or more forms with different IDs
	 */
	@ValueMapValue
	@Getter
	private  String marketoMunchkinId;
	/**
	 * Marketo hidden form id - identifier of the 'hidden' marketo form within Marketo project
	 */
	@ValueMapValue
	@Getter
	private  String hiddenMarketoId;
	/**
	 * Marketo munchkin id - also called Marketo project - is an identifier of a 'hidden' project in Marketo,
	 * it may contain one or more forms with different IDs
	 */
	@ValueMapValue
	@Getter
	private  String hiddenMarketoMunchkinId;
	/**
	 * This is a hostname where we try to get the form objects from
	 */
	@ValueMapValue
	@Default(values = "https://express-resource.dhl.com")
	@Getter
	private String marketoHostname;

	private static final String MKTO_FORM_PLACEHOLDER = "mktoForm_{0}";

	@PostConstruct
	public void init(){
		log.debug("MarketoConfiguration init() method called");
		log.debug("MarketoConfiguration marketoSourceType: {}", marketoSourceType);
	}

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

	/**
	 * Provides the Marketo formID (visible form)
	 * @return String representing the Marketo formID or {@code null} if not present
	 */
	public String getMarketoFormId() {
		if(null != marketoFormId){
			return marketoFormId;
		}
		return null;
	}

	/**
	 * Utility method utilizing {@link PageUtilService} to figure out whether the page (where the comoponent using this model is)
	 * belongs to 'global' (is in path /content/dhl/global).
	 * This method returns boolean {@code true} if yes, otherwise {@code false}.
	 * Also returns {@code false} if the page is {@code null} or some other error occurred during acquisition.
	 */
	public boolean isGlobalPage(){
		return pageUtilService.isGlobalPage(currentPage);
	}

}
