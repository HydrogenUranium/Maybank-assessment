package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
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
class AllCategoriesTest {
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
	    ctx.addModelsForClasses(AllCategories.class);
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/country/en/register");

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("mode", "latest");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        AllCategories allCategories = request.adaptTo(AllCategories.class);
        assertNotNull(allCategories);
        assertEquals(8, allCategories.getCategoryLinks().size());

        allCategories.setCategoryLinks(new ArrayList<CategoryLinkGroup>());

        assertEquals(0, allCategories.getCategoryLinks().size());
	}
}