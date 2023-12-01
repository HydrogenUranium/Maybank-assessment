package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

import java.util.ArrayList;

import javax.jcr.Session;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
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
class CategoryListingTest {
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
	    ctx.addModelsForClasses(CategoryListing.class);
	}

	@Test
	void test() {
        Resource resource = ctx.resourceResolver().getResource("/content/dhl/country/en/jcr:content/parother/categorylist");
        assertNotNull(resource);
        
        CategoryListing categoryListing = resource.adaptTo(CategoryListing.class);
        assertNotNull(categoryListing);
        assertNotNull(categoryListing.getCategory1());
        assertNotNull(categoryListing.getCategory2());
        assertNotNull(categoryListing.getCategory3());
        assertNotNull(categoryListing.getCategory4());
        assertNotNull(categoryListing.getCategory5());
        assertNotNull(categoryListing.getCategory6());
        
        CategoryListingItem item = categoryListing.getCategory1();
        assertNull(item.getName());
        assertNull(item.getArticles());
        
        item.setName("");
        item.setArticles(new ArrayList<Article>());

        assertEquals("", item.getName());
        assertEquals(0, item.getArticles().size());

        categoryListing.setCategory1(null);
        categoryListing.setCategory2(null);
        categoryListing.setCategory3(null);
        categoryListing.setCategory4(null);
        categoryListing.setCategory5(null);
        categoryListing.setCategory6(null);

        assertNull(categoryListing.getCategory1());
        assertNull(categoryListing.getCategory2());
        assertNull(categoryListing.getCategory3());
        assertNull(categoryListing.getCategory4());
        assertNull(categoryListing.getCategory5());
        assertNull(categoryListing.getCategory6());
	}
}