package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.jcr.Session;

import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PageNotFoundTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
	    ctx.addModelsForClasses(PageNotFound.class);
	}

	@Test
	void test() {
        Mockito.when(mockQueryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(page1MockQuery);
		ctx.currentResource("/content/dhl/en/culture/dhl-mo-salah");

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("mode", "latest");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        PageNotFound pageNotFound = request.adaptTo(PageNotFound.class);
        assertNotNull(pageNotFound);
        assertEquals(0, pageNotFound.getTrendingArticles().size());

        pageNotFound.setTrendingArticles(new ArrayList<Article>());

        assertEquals(0, pageNotFound.getTrendingArticles().size());
	}
}