package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

import com.positive.dhl.core.components.EnvironmentConfiguration;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mock;

import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.osgi.service.cm.ConfigurationAdmin;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class AccountActionsTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private ConfigurationAdmin mockConfigurationAdmin;

		@Mock
		private EnvironmentConfiguration environmentConfiguration;

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
				ctx.registerService(EnvironmentConfiguration.class, environmentConfiguration);
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.registerService(ConfigurationAdmin.class, mockConfigurationAdmin);
	    ctx.addModelsForClasses(AccountActions.class);
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/en/culture/dhl-mo-salah");

		Map<String, Object> params = new HashMap<>();
		params.put("r", "test");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
        
		AccountActions accountActions = request.adaptTo(AccountActions.class);
        assertNotNull(accountActions);

        assertEquals("/content/dhl/en-global.html", accountActions.getBackUrl());
        assertEquals("/content/dhl/en/culture/dhl-mo-salah.html", accountActions.getBackUrlSelf());
        assertEquals("/content/dhl/login.html", accountActions.getLoginUrl());
        assertEquals("/content/dhl/login.html", accountActions.getLoginUrlNoRedirect());
        assertEquals("/content/dhl/register.html", accountActions.getRegisterUrl());
        assertEquals("/content/dhl/ship-now.html", accountActions.getShipNowUrl());
        assertEquals("/content/dhl/your-account.html", accountActions.getEditDetailsUrl());
        assertEquals("/content/dhl/forgotten-password.html", accountActions.getPasswordReminderUrl());
        assertEquals("/content/dhl/your-account/delete-account.html", accountActions.getDeleteAccountUrl());
        assertEquals("/content/dhl/your-account/delete-account/complete.html", accountActions.getDeleteAccountCompleteUrl());
        assertEquals("<h2>Global e-commerce and logistics insights<br />\r\n" + 
        		"</h2>\r\n" + 
        		"<p>Advice and inspiration from DHL</p>\r\n" + 
        		"", accountActions.getWelcomeMessage());
        assertEquals("<p>Log in to access the latest downloads, exclusive videos and white papers from the world of business, culture and <a>e-commerce.</a></p>\r\n" + 
        		"", accountActions.getLoginMessage());
        assertEquals("<p><a></a><a>Sign up for your Discover DHL account and get a regular downloadable hit of insider articles, white papers, industry expertise and more from all around the world.</a></p>\r\n" + 
        		"", accountActions.getSignupMessage());
        assertEquals("<p>Don't worry. We'll never post on your behalf. To learn more about how we protect your privacy, please read our <a href=\"/content/dhl/privacy.html\" target=\"_self\">Privacy Notice.</a></p>\r\n" + 
        		"", accountActions.getSignupPrivacyMessage());
        assertEquals("<p>Please read our <a href=\"/content/dhl/privacy.html\" target=\"_blank\" title=\"Privacy Notice\">Privacy Notice</a> to find out how your email will be used.<br />\r\n" + 
        		"</p>\r\n" + 
        		"", accountActions.getSignupEmailPrivacyMessage());
        assertEquals("<p>Yes, I would like to receive emails with information and offers from DHL, and can withdraw this consent at any time. </p>\r\n" + 
        		"", accountActions.getSignupTCMessage());
        assertEquals("<p>Now you have access to a world of new information, research and insight. For the very latest updates, come back and visit every week.<br />\r\n" + 
        		"</p>\r\n" + 
        		"", accountActions.getRegisterThanksMessage());
        assertEquals("<p>For global reach, business rates and state-of-the-art tracking, an account with DHL Express is your next step.</p>\r\n" + 
        		"", accountActions.getShipNowMessage());
        assertEquals("<p>Your unique Discover DHL password gives you personal access to all the latest content, competitions and collected knowledge on offer. By setting up an account with us, you'll be able to see exclusive content designed to give you a competitive advantage. Create your Discover DHL password here.</p>\r\n" + 
        		"", accountActions.getCreatePasswordMessage());
        assertEquals("<p>Read our <a href=\"/content/dhl/privacy.html\">Privacy Policy</a>.<br />\r\n" + 
        		"</p>\r\n" + 
        		"", accountActions.getCreatePasswordPrivacyMessage());
        assertEquals("<p>Now you have access to a world of new information, research and insight. For the very latest updates, come back and visit every week.</p>\r\n" + 
        		"", accountActions.getCreatePasswordThanksMessage());
        assertEquals("discover@dhl-news.com", accountActions.getContactEmail());
        assertEquals("Reach 220 territories across the world", accountActions.getApplyForAccountTitle());
        assertEquals("Serious about taking your brand global?", accountActions.getApplyForAccountSubtitle());
        assertEquals("Speak to a Specialist Today", accountActions.getApplyForAccountCta());
        assertEquals("/content/dhl/en/ship-now.html", accountActions.getApplyForAccountUrl());
        
        accountActions.setApplyForAccountPoints(new String[] { });
		accountActions.setBackUrl("");
		accountActions.setBackUrlSelf("");
		accountActions.setLoginUrl("");
		accountActions.setLoginUrlNoRedirect("");
		accountActions.setRegisterUrl("");
		accountActions.setShipNowUrl("");
		accountActions.setEditDetailsUrl("");
		accountActions.setPasswordReminderUrl("");
		accountActions.setDeleteAccountUrl("");
		accountActions.setDeleteAccountCompleteUrl("");
		accountActions.setWelcomeMessage("");
		accountActions.setLoginMessage("");
		accountActions.setSignupMessage("");
		accountActions.setSignupPrivacyMessage("");
		accountActions.setSignupEmailPrivacyMessage("");
		accountActions.setSignupTCMessage("");
		accountActions.setRegisterThanksMessage("");
		accountActions.setShipNowMessage("");
		accountActions.setCreatePasswordMessage("");
		accountActions.setCreatePasswordPrivacyMessage("");
		accountActions.setCreatePasswordThanksMessage("");
		accountActions.setContactEmail("");
		accountActions.setApplyForAccountTitle("");
		accountActions.setApplyForAccountSubtitle("");
		accountActions.setApplyForAccountCta("");
		accountActions.setApplyForAccountUrl("");

		assertEquals(0, accountActions.getApplyForAccountPoints().length);
        assertEquals("", accountActions.getBackUrl());
        assertEquals("", accountActions.getBackUrlSelf());
        assertEquals("", accountActions.getLoginUrl());
        assertEquals("", accountActions.getLoginUrlNoRedirect());
        assertEquals("", accountActions.getRegisterUrl());
        assertEquals("", accountActions.getShipNowUrl());
        assertEquals("", accountActions.getEditDetailsUrl());
        assertEquals("", accountActions.getPasswordReminderUrl());
        assertEquals("", accountActions.getDeleteAccountUrl());
        assertEquals("", accountActions.getDeleteAccountCompleteUrl());
        assertEquals("", accountActions.getWelcomeMessage());
        assertEquals("", accountActions.getLoginMessage());
        assertEquals("", accountActions.getSignupMessage());
        assertEquals("", accountActions.getSignupPrivacyMessage());
        assertEquals("", accountActions.getSignupEmailPrivacyMessage());
        assertEquals("", accountActions.getSignupTCMessage());
        assertEquals("", accountActions.getRegisterThanksMessage());
        assertEquals("", accountActions.getShipNowMessage());
        assertEquals("", accountActions.getCreatePasswordMessage());
        assertEquals("", accountActions.getCreatePasswordPrivacyMessage());
        assertEquals("", accountActions.getCreatePasswordThanksMessage());
        assertEquals("", accountActions.getContactEmail());
        assertEquals("", accountActions.getApplyForAccountTitle());
        assertEquals("", accountActions.getApplyForAccountSubtitle());
        assertEquals("", accountActions.getApplyForAccountCta());
        assertEquals("", accountActions.getApplyForAccountUrl());
	}
}