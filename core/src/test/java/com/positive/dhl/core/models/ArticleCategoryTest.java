package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
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
class ArticleCategoryTest {
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
	    ctx.addModelsForClasses(ArticleCategory.class);
	}

	@Test
	void test() {
		ArticleCategory blankArticleCategory = new ArticleCategory();
		
        ArticleCategory articleCategory = new ArticleCategory("/content/dhl/country/en/business", ctx.resourceResolver());
        assertEquals("/content/dhl/country/en/business", articleCategory.path);
        assertEquals(false, articleCategory.getExternal());
        assertNull(articleCategory.getCurrent());
        assertEquals(0, articleCategory.getIndex());

        assertEquals("Business", articleCategory.getTitle());
        assertEquals("/content/dam/dhl/site-image/category-nav/business.jpg", articleCategory.getListimage());
        
        articleCategory.setCurrent(true);
        articleCategory.setExternal(true);
        articleCategory.setIndex(1);
        articleCategory.setTitle("");
        articleCategory.setListimage("");
        
        assertEquals(true, articleCategory.getExternal());
        assertEquals(true, articleCategory.getCurrent());
        assertEquals(1, articleCategory.getIndex());
        assertEquals("", articleCategory.getTitle());
        assertEquals("", articleCategory.getListimage());
	}
}