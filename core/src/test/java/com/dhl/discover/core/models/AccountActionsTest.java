package com.dhl.discover.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

import com.dhl.discover.core.components.EnvironmentConfiguration;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.LaunchService;
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
	    ctx.load().json("/com/dhl/discover/core/models/SiteContent.json", "/content");
		ctx.registerService(EnvironmentConfiguration.class, environmentConfiguration);
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.registerService(ConfigurationAdmin.class, mockConfigurationAdmin);
        var launchService = ctx.registerService(LaunchService.class, new LaunchService());
        ctx.registerInjectActivateService(PageUtilService.class, "launchService", launchService);
	    ctx.addModelsForClasses(AccountActions.class);
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/country/en/culture/dhl-mo-salah");

		Map<String, Object> params = new HashMap<>();
		params.put("r", "test");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
        
		AccountActions accountActions = request.adaptTo(AccountActions.class);
        assertNotNull(accountActions);

        assertEquals("/content/dhl/country/en", accountActions.getBackUrl());
        assertEquals("/content/dhl/country/en/culture/dhl-mo-salah.html", accountActions.getBackUrlSelf());
        assertEquals("/content/dhl/your-account.html", accountActions.getEditDetailsUrl());
        assertEquals("""
<p>Please read our <a href="/content/dhl/privacy.html" target="_blank" title="Privacy Notice">Privacy Notice</a> to find out how your email will be used.<br />
</p>""", accountActions.getSignupEmailPrivacyMessage());
        assertEquals("<p>Yes, I would like to receive emails with information and offers from DHL, and can withdraw this consent at any time. </p>\r\n" + 
        		"", accountActions.getSignupTCMessage());
        assertEquals("<p>For global reach, business rates and state-of-the-art tracking, an account with DHL Express is your next step.</p>\r\n" +
        		"", accountActions.getShipNowMessage());
        assertEquals("discover@dhl-news.com", accountActions.getContactEmail());

		accountActions.setBackUrl("");
		accountActions.setBackUrlSelf("");
		accountActions.setEditDetailsUrl("");
		accountActions.setSignupEmailPrivacyMessage("");
		accountActions.setSignupTCMessage("");
		accountActions.setShipNowMessage("");
		accountActions.setContactEmail("");

        assertEquals("", accountActions.getBackUrl());
        assertEquals("", accountActions.getBackUrlSelf());
        assertEquals("", accountActions.getEditDetailsUrl());
        assertEquals("", accountActions.getSignupEmailPrivacyMessage());
        assertEquals("", accountActions.getSignupTCMessage());
        assertEquals("", accountActions.getShipNowMessage());
        assertEquals("", accountActions.getContactEmail());
	}
}