package com.positive.dhl.core.models;


import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;

import com.positive.dhl.core.services.GeneralSiteConfigurationService;
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
	@Inject
	private SlingHttpServletRequest request;

	@Inject
	private ResourceResolver resourceResolver;
    
	@Inject
	private Page currentPage;

	@OSGiService
	GeneralSiteConfigurationService generalSiteConfigurationService;

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
    protected void init() throws RepositoryException {
		Base64 base64 = new Base64(true);
		Page home = currentPage.getAbsoluteParent(2);

		if (home != null) {
			ValueMap properties = home.adaptTo(ValueMap.class);

			if (properties != null) {
				welcomeMessage = properties.get("jcr:content/welcomemessage", "");
				loginMessage = properties.get("jcr:content/loginmessage", "");

				signupMessage = properties.get("jcr:content/signupmessage", "");
				signupPrivacyMessage = properties.get("jcr:content/signupprivacymessage", "");
				signupEmailPrivacyMessage = properties.get("jcr:content/signupemailprivacymessage", "");
				signupTCMessage = properties.get("jcr:content/signuptcmessage", "");
				registerThanksMessage = properties.get("jcr:content/registerthanksmessage", "");

				createPasswordMessage = properties.get("jcr:content/createpasswordmessage", "");
				createPasswordPrivacyMessage = properties.get("jcr:content/createpasswordprivacymessage", "");
				createPasswordThanksMessage = properties.get("jcr:content/createpasswordthanksmessage", "");

				shipNowMessage = properties.get("jcr:content/shipnowmessage", "");

				shipnowmarketo = properties.get("jcr:content/shipnowmarketo", false);
				newslettermarketo = properties.get("jcr:content/newslettermarketo", false);
				downloadmarketo = properties.get("jcr:content/downloadmarketo", false);
				usethirdpartycookie = properties.get("jcr:content/usethirdpartycookie", false);

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
				loginUrlNoRedirect = properties.get("jcr:content/loginpage", "/content/dhl/login").concat(".html");
		        loginUrl = properties.get("jcr:content/loginpage", "/content/dhl/login").concat(".html");
		        registerUrl = properties.get("jcr:content/registerpage", "/content/dhl/register").concat(".html");
		        shipNowUrl = properties.get("jcr:content/shipnowpage", "/content/dhl/ship-now").concat(".html");
		        editDetailsUrl = properties.get("jcr:content/editdetailspage", "/content/dhl/your-account").concat(".html");
		        passwordReminderUrl = properties.get("jcr:content/passwordreminderpage", "/content/dhl/forgotten-password").concat(".html");
		        deleteAccountUrl = properties.get("jcr:content/deleteaccountpage", "/content/dhl/your-account/delete-account").concat(".html");
		        deleteAccountCompleteUrl = properties.get("jcr:content/deleteaccountcompletepage", "/content/dhl/your-account/delete-account/complete").concat(".html");

				assetprefix = "";
				if (this.generalSiteConfigurationService != null) {
					assetprefix = this.generalSiteConfigurationService.getAssetprefix();
				}

		        // url handling if we've bypassed dispatcher - checking QS params
				backUrlSelf = currentPage.getPath().concat(".html");

				boolean hasBackUrl = false;
				backUrl = request.getParameter("r");
				if (!(backUrl == null || backUrl.trim().length() == 0)) {
					byte[] decoded = base64.decode(backUrl);
					Resource page = resourceResolver.getResource(new String(decoded));
					if (page != null) {
						hasBackUrl = true;
						backUrl = page.getPath().concat(".html");
					}
				}

				if (!hasBackUrl) {
					backUrl = "/content/dhl/discover/en-global.html";
				}
			}
		}
	}
}