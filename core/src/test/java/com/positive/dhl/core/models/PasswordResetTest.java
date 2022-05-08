package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.jcr.Session;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PasswordResetTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
	    ctx.addModelsForClasses(PasswordReset.class);
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl");

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("username", "username");
		params.put("token", "token");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        PasswordReset passwordReset = request.adaptTo(PasswordReset.class);
		assert passwordReset != null;
		assertEquals("username", passwordReset.getUsername());
		assertEquals("token", passwordReset.getToken());
		assertNull(passwordReset.getResponseText());
		assertEquals(0, passwordReset.getResults().size());
		
		passwordReset.setUsername("");
		passwordReset.setToken("");
		passwordReset.setResponseText("");
		passwordReset.setResults(new ArrayList<Article>());

		assertEquals("", passwordReset.getUsername());
		assertEquals("", passwordReset.getToken());
		assertEquals("", passwordReset.getResponseText());
		assertEquals(0, passwordReset.getResults().size());
	}
}
