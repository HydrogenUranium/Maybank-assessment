package com.positive.dhl.core.models;


import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.components.EnvironmentConfiguration;
import com.positive.dhl.core.services.PageUtilService;
import org.apache.commons.codec.binary.Base64;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

/**
 *
 */
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

    /**
	 * 
	 */
	public String getHomeUrl() {
		return homeUrl;
	}

    /**
	 * 
	 */
	public void setHomeUrl(String homeUrl) {
		this.homeUrl = homeUrl;
	}
	
    /**
	 * 
	 */
	public String getBackUrl() {
		return backUrl;
	}

    /**
	 * 
	 */
	public void setBackUrl(String backUrl) {
		this.backUrl = backUrl;
	}

    /**
	 * 
	 */
	public String getBackUrlSelf() {
		return backUrlSelf;
	}

    /**
	 * 
	 */
	public void setBackUrlSelf(String backUrlSelf) {
		this.backUrlSelf = backUrlSelf;
	}

    /**
	 * 
	 */
	public String getLoginUrl() {
		return loginUrl;
	}

    /**
	 * 
	 */
	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}

    /**
	 * 
	 */
	public String getLoginUrlNoRedirect() {
		return loginUrlNoRedirect;
	}

    /**
	 * 
	 */
	public void setLoginUrlNoRedirect(String loginUrlNoRedirect) {
		this.loginUrlNoRedirect = loginUrlNoRedirect;
	}

    /**
	 * 
	 */
	public String getRegisterUrl() {
		return registerUrl;
	}

    /**
	 * 
	 */
	public void setRegisterUrl(String registerUrl) {
		this.registerUrl = registerUrl;
	}

    /**
	 * 
	 */
	public String getShipNowUrl() {
		return shipNowUrl;
	}

    /**
	 * 
	 */
	public void setShipNowUrl(String shipNowUrl) {
		this.shipNowUrl = shipNowUrl;
	}

    /**
	 * 
	 */
	public String getEditDetailsUrl() {
		return editDetailsUrl;
	}

    /**
	 * 
	 */
	public void setEditDetailsUrl(String editDetailsUrl) {
		this.editDetailsUrl = editDetailsUrl;
	}

    /**
	 * 
	 */
	public String getPasswordReminderUrl() {
		return passwordReminderUrl;
	}

    /**
	 * 
	 */
	public void setPasswordReminderUrl(String passwordReminderUrl) {
		this.passwordReminderUrl = passwordReminderUrl;
	}

    /**
	 * 
	 */
	public String getDeleteAccountUrl() {
		return deleteAccountUrl;
	}

    /**
	 * 
	 */
	public void setDeleteAccountUrl(String deleteAccountUrl) {
		this.deleteAccountUrl = deleteAccountUrl;
	}

    /**
	 * 
	 */
	public String getDeleteAccountCompleteUrl() {
		return deleteAccountCompleteUrl;
	}

    /**
	 * 
	 */
	public void setDeleteAccountCompleteUrl(String deleteAccountCompleteUrl) {
		this.deleteAccountCompleteUrl = deleteAccountCompleteUrl;
	}

    /**
	 * 
	 */
	public String getWelcomeMessage() {
		return welcomeMessage;
	}

    /**
	 * 
	 */
	public void setWelcomeMessage(String welcomeMessage) {
		this.welcomeMessage = welcomeMessage;
	}

    /**
	 * 
	 */
	public String getLoginMessage() {
		return loginMessage;
	}

    /**
	 * 
	 */
	public void setLoginMessage(String loginMessage) {
		this.loginMessage = loginMessage;
	}

    /**
	 * 
	 */
	public String getSignupMessage() {
		return signupMessage;
	}

    /**
	 * 
	 */
	public void setSignupMessage(String signupMessage) {
		this.signupMessage = signupMessage;
	}

    /**
	 * 
	 */
	public String getSignupPrivacyMessage() {
		return signupPrivacyMessage;
	}

    /**
	 * 
	 */
	public void setSignupPrivacyMessage(String signupPrivacyMessage) {
		this.signupPrivacyMessage = signupPrivacyMessage;
	}

    /**
	 * 
	 */
	public String getSignupEmailPrivacyMessage() {
		return signupEmailPrivacyMessage;
	}

    /**
	 * 
	 */
	public void setSignupEmailPrivacyMessage(String signupEmailPrivacyMessage) {
		this.signupEmailPrivacyMessage = signupEmailPrivacyMessage;
	}

    /**
	 * 
	 */
	public String getSignupTCMessage() {
		return signupTCMessage;
	}

    /**
	 * 
	 */
	public void setSignupTCMessage(String signupTCMessage) {
		this.signupTCMessage = signupTCMessage;
	}

    /**
	 * 
	 */
	public String getRegisterThanksMessage() {
		return registerThanksMessage;
	}

    /**
	 * 
	 */
	public void setRegisterThanksMessage(String registerThanksMessage) {
		this.registerThanksMessage = registerThanksMessage;
	}

    /**
	 * 
	 */
	public String getShipNowMessage() {
		return shipNowMessage;
	}

    /**
	 * 
	 */
	public void setShipNowMessage(String shipNowMessage) {
		this.shipNowMessage = shipNowMessage;
	}

    /**
	 * 
	 */
	public String getCreatePasswordMessage() {
		return createPasswordMessage;
	}

    /**
	 * 
	 */
	public void setCreatePasswordMessage(String createPasswordMessage) {
		this.createPasswordMessage = createPasswordMessage;
	}

    /**
	 * 
	 */
	public String getCreatePasswordPrivacyMessage() {
		return createPasswordPrivacyMessage;
	}

    /**
	 * 
	 */
	public void setCreatePasswordPrivacyMessage(String createPasswordPrivacyMessage) {
		this.createPasswordPrivacyMessage = createPasswordPrivacyMessage;
	}

    /**
	 * 
	 */
	public String getCreatePasswordThanksMessage() {
		return createPasswordThanksMessage;
	}

    /**
	 * 
	 */
	public void setCreatePasswordThanksMessage(String createPasswordThanksMessage) {
		this.createPasswordThanksMessage = createPasswordThanksMessage;
	}

    /**
	 * 
	 */
	public String getContactEmail() {
		return contactEmail;
	}

    /**
	 * 
	 */
	public Boolean getShipnowmarketo() {
		return shipnowmarketo;
	}

    /**
	 * 
	 */
	public Boolean getNewslettermarketo() {
		return newslettermarketo;
	}

	/**
	 *
	 */
	public Boolean getDownloadmarketo() {
		return downloadmarketo;
	}

	/**
	 *
	 */
	public Boolean getUsethirdpartycookie() {
		return usethirdpartycookie;
	}

    /**
	 * 
	 */
	public void setContactEmail(String contactEmail) {
		this.contactEmail = contactEmail;
	}

    /**
	 * 
	 */
	public String getApplyForAccountTitle() {
		return applyForAccountTitle;
	}

    /**
	 * 
	 */
	public void setApplyForAccountTitle(String applyForAccountTitle) {
		this.applyForAccountTitle = applyForAccountTitle;
	}

    /**
	 * 
	 */
	public String getApplyForAccountSubtitle() {
		return applyForAccountSubtitle;
	}

    /**
	 * 
	 */
	public void setApplyForAccountSubtitle(String applyForAccountSubtitle) {
		this.applyForAccountSubtitle = applyForAccountSubtitle;
	}

    /**
	 * 
	 */
	public String getApplyForAccountCta() {
		return applyForAccountCta;
	}

    /**
	 * 
	 */
	public void setApplyForAccountCta(String applyForAccountCta) {
		this.applyForAccountCta = applyForAccountCta;
	}

    /**
	 * 
	 */
	public String getApplyForAccountUrl() {
		return applyForAccountUrl;
	}

    /**
	 * 
	 */
	public void setApplyForAccountUrl(String applyForAccountUrl) {
		this.applyForAccountUrl = applyForAccountUrl;
	}

    /**
	 * 
	 */
	public String[] getApplyForAccountPoints() {
		return applyForAccountPoints.clone();
	}

    /**
	 * 
	 */
	public void setApplyForAccountPoints(String[] applyForAccountPoints) {
		this.applyForAccountPoints = applyForAccountPoints.clone();
	}

    /**
	 * 
	 */
	public void setShipnowmarketo(Boolean shipnowmarketo) {
		this.shipnowmarketo = shipnowmarketo;
	}

    /**
	 * 
	 */
	public void setNewslettermarketo(Boolean newslettermarketo) {
		this.newslettermarketo = newslettermarketo;
	}

	/**
	 *
	 */
	public void setDownloadmarketo(Boolean downloadmarketo) {
		this.downloadmarketo = downloadmarketo;
	}

	/**
	 *
	 */
	public void setUsethirdpartycookie(Boolean usethirdpartycookie) {
		this.usethirdpartycookie = usethirdpartycookie;
	}

	/**
	 *
	 */
	public String getAssetprefix() { return assetprefix; }

	/**
	 *
	 */
	public void setAssetprefix(String assetprefix) { this.assetprefix = assetprefix; }

    /**
	 * 
	 */
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

				boolean hasBackUrl = false;
				backUrl = request.getParameter("r");
				if (!(backUrl == null || backUrl.trim().length() == 0)) {
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