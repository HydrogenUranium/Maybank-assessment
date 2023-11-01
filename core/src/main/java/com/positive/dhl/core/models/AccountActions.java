package com.positive.dhl.core.models;


import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.components.EnvironmentConfiguration;
import com.positive.dhl.core.services.PageUtilService;
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
	private SlingHttpServletRequest request;

	@Inject
	private ResourceResolver resourceResolver;

	@Inject
	private Page currentPage;

	@OSGiService
	private PageUtilService pageUtilServiceImpl;

	@OSGiService
	private EnvironmentConfiguration environmentConfiguration;


	private String homeUrl;
	private String backUrl;
	private String backUrlSelf;
	private String loginUrl;
	private String loginUrlNoRedirect;
	private String registerUrl;
	private String shipNowUrl;
	private String editDetailsUrl;
	private String passwordReminderUrl;
	private String deleteAccountUrl;
	private String deleteAccountCompleteUrl;
	private String welcomeMessage;
	private String loginMessage;
	private String signupMessage;
	private String signupPrivacyMessage;
	private String signupEmailPrivacyMessage;
	private String signupTCMessage;
	private String registerThanksMessage;
	private String shipNowMessage;
	private String createPasswordMessage;
	private String createPasswordPrivacyMessage;
	private String createPasswordThanksMessage;
	private String contactEmail;
	private String applyForAccountTitle;
	private String applyForAccountSubtitle;
	private String applyForAccountCta;
	private String applyForAccountUrl;
	private String[] applyForAccountPoints;
	private Boolean usethirdpartycookie;
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
				welcomeMessage = properties.get("welcomemessage", "");
				loginMessage = properties.get("loginmessage", "");

				signupMessage = properties.get("signupmessage", "");
				signupPrivacyMessage = properties.get("signupprivacymessage", "");
				signupEmailPrivacyMessage = properties.get("signupemailprivacymessage", "");
				signupTCMessage = properties.get("signuptcmessage", "");
				registerThanksMessage = properties.get("registerthanksmessage", "");

				createPasswordMessage = properties.get("createpasswordmessage", "");
				createPasswordPrivacyMessage = properties.get("createpasswordprivacymessage", "");
				createPasswordThanksMessage = properties.get("createpasswordthanksmessage", "");

				shipNowMessage = properties.get("shipnowmessage", "");

				shipnowmarketo = properties.get("shipnowmarketo", false);
				newslettermarketo = properties.get("newslettermarketo", false);
				downloadmarketo = properties.get("downloadmarketo", false);
				usethirdpartycookie = properties.get("usethirdpartycookie", false);

				contactEmail = "discover@dhl-news.com";
				applyForAccountTitle = "Reach 220 territories across the world";
				applyForAccountSubtitle = "Serious about taking your brand global?";
				applyForAccountCta = "Speak to a Specialist Today";
				applyForAccountUrl = home.getPath() + "/ship-now.html";
				applyForAccountPoints = new String[] {
					"Easy Shipping",
					"Preferential Business Rates",
					"Exclusive Tools",
					"Trusted Network"
				};

				homeUrl = home.getPath();
				loginUrlNoRedirect = properties.get("loginpage", "/content/dhl/login").concat(HTML_EXTENSION);
		        loginUrl = properties.get("loginpage", "/content/dhl/login").concat(HTML_EXTENSION);
		        registerUrl = properties.get("registerpage", "/content/dhl/register").concat(HTML_EXTENSION);
		        shipNowUrl = properties.get("shipnowpage", "/content/dhl/ship-now").concat(HTML_EXTENSION);
		        editDetailsUrl = properties.get("editdetailspage", "/content/dhl/your-account").concat(HTML_EXTENSION);
		        passwordReminderUrl = properties.get("passwordreminderpage", "/content/dhl/forgotten-password").concat(HTML_EXTENSION);
		        deleteAccountUrl = properties.get("deleteaccountpage", "/content/dhl/your-account/delete-account").concat(HTML_EXTENSION);
		        deleteAccountCompleteUrl = properties.get("deleteaccountcompletepage", "/content/dhl/your-account/delete-account/complete").concat(HTML_EXTENSION);

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
