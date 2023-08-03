package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;

import static com.positive.dhl.core.constants.DiscoverConstants.HOME_PAGE_LEVEL;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class CookiePolicy {
	@Inject
	private Page currentPage;

	private String message;
	private String ok;
	private String learnMore;
	private String learnMoreLink;

    /**
	 * 
	 */
	public String getMessage() {
		return message;
	}

    /**
	 * 
	 */
	public void setMessage(String message) {
		this.message = message;
	}

    /**
	 * 
	 */
	public String getOk() {
		return ok;
	}

    /**
	 * 
	 */
	public void setOk(String ok) {
		this.ok = ok;
	}

    /**
	 * 
	 */
	public String getLearnMore() {
		return learnMore;
	}

    /**
	 * 
	 */
	public void setLearnMore(String learnMore) {
		this.learnMore = learnMore;
	}

    /**
	 * 
	 */
	public String getLearnMoreLink() {
		return learnMoreLink;
	}

    /**
	 * 
	 */
	public void setLearnMoreLink(String learnMoreLink) {
		this.learnMoreLink = learnMoreLink;
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() {
		Page home = currentPage.getAbsoluteParent(HOME_PAGE_LEVEL);

		if (home == null) {
			return;
		}

		ValueMap properties = home.adaptTo(ValueMap.class);
		
		if (properties != null) {
			message = properties.get("jcr:content/cookiemessage", "");
			ok = "Accept";
			learnMore = "Learn more";
			learnMoreLink = properties.get("jcr:content/cookielearnmore", "#").concat(".html");
		}
	}
}