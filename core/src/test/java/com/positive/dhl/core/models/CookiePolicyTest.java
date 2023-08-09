package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

import com.positive.dhl.core.services.PageUtilService;
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

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CookiePolicyTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.registerService(PageUtilService.class, new PageUtilService());
	    ctx.addModelsForClasses(CookiePolicy.class);
	}

	@Test
	void test() {
        // Mockito.when(mockQueryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(page1MockQuery);
		ctx.currentResource("/content/dhl/country/en/culture/dhl-mo-salah");

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("mode", "latest");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        CookiePolicy cookiePolicy = request.adaptTo(CookiePolicy.class);
        assertNotNull(cookiePolicy);
        assertEquals("<p>We use cookies on our website to improve your experience. View our <a title=\"Terms of Use\" href=\"/content/dhl/terms-of-use.html\" target=\"_blank\">Cookie Policy</a>.</p>\r\n" + 
        		"", cookiePolicy.getMessage());
        assertEquals("Accept", cookiePolicy.getOk());
        assertEquals("Learn more", cookiePolicy.getLearnMore());
        assertEquals("/content/dhl/terms-of-use.html", cookiePolicy.getLearnMoreLink());

        cookiePolicy.setMessage("");
        cookiePolicy.setOk("");
        cookiePolicy.setLearnMore("");
        cookiePolicy.setLearnMoreLink("");

        assertEquals("", cookiePolicy.getMessage());
        assertEquals("", cookiePolicy.getOk());
        assertEquals("", cookiePolicy.getLearnMore());
        assertEquals("", cookiePolicy.getLearnMoreLink());
	}
}