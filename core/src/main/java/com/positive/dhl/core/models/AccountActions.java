package com.positive.dhl.core.models;


import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.components.EnvironmentConfiguration;
import com.positive.dhl.core.services.PageUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.codec.binary.Base64;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

/**
 * Utility model that acts as a 'middle-man' between the component on a particular AEM page
 * and properties configured on the home-page level (relative to the page that contains the component that uses this model)
 */
@Getter
@Setter
@Model(adaptables=SlingHttpServletRequest.class)
public class AccountActions {
	protected static final String HTML_EXTENSION = ".html";

	@Inject
	@Getter(AccessLevel.NONE)
	private SlingHttpServletRequest request;

	@Inject
	@Getter(AccessLevel.NONE)
	private ResourceResolver resourceResolver;

	@Inject
	@Getter(AccessLevel.NONE)
	private Page currentPage;

	@OSGiService
	@Getter(AccessLevel.NONE)
	private PageUtilService pageUtilServiceImpl;

	@OSGiService
	@Getter(AccessLevel.NONE)
	private EnvironmentConfiguration environmentConfiguration;


	private String homeUrl;
	private String backUrl;
	private String backUrlSelf;
	private String shipNowUrl;
	private String editDetailsUrl;
	private String signupEmailPrivacyMessage;
	private String signupTCMessage;
	private String shipNowMessage;
	private String contactEmail;
	private Boolean shipnowmarketo;
	private Boolean newslettermarketo;
	private Boolean downloadmarketo;
	private String assetprefix;

	@PostConstruct
    protected void init() {
		Base64 base64 = new Base64(true);
		Page home = pageUtilServiceImpl.getHomePage(currentPage);


		assetprefix = environmentConfiguration.getAssetPrefix();


		if (home != null) {
			ValueMap properties = pageUtilServiceImpl.getPageProperties(home);

			if (!properties.isEmpty()) {
				signupEmailPrivacyMessage = properties.get("signupemailprivacymessage", "");
				signupTCMessage = properties.get("signuptcmessage", "");

				shipNowMessage = properties.get("shipnowmessage", "");

				shipnowmarketo = properties.get("shipnowmarketo", false);
				newslettermarketo = properties.get("newslettermarketo", false);
				downloadmarketo = properties.get("downloadmarketo", false);

				contactEmail = "discover@dhl-news.com";

				homeUrl = home.getPath();
		        shipNowUrl = properties.get("shipnowpage", "/content/dhl/ship-now").concat(HTML_EXTENSION);
		        editDetailsUrl = properties.get("editdetailspage", "/content/dhl/your-account").concat(HTML_EXTENSION);

		        // url handling if we've bypassed dispatcher - checking QS params
				backUrlSelf = currentPage.getPath().concat(HTML_EXTENSION);

				var hasBackUrl = false;
				backUrl = request.getParameter("r");
				if (!(backUrl == null || backUrl.trim().isEmpty())) {
					byte[] decoded = base64.decode(backUrl);
					Resource page = resourceResolver.getResource(new String(decoded));
					if (page != null) {
						hasBackUrl = true;
						backUrl = page.getPath().concat(HTML_EXTENSION);
					}
				}

				if (!hasBackUrl) {
					backUrl = homeUrl;
				}
			}
		}
	}
}
