package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.api.resource.Resource;
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
class HomepageArticlesPanelTest {
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
	    ctx.addModelsForClasses(HomepageArticlesPanel.class, Article.class);
	}

	@Test
	void test() {
        Resource resource = ctx.resourceResolver().getResource("/content/dhl/en/jcr:content/par/articlelisthomepage");
        assertNotNull(resource);

        HomepageArticlesPanel homepageArticle = resource.adaptTo(HomepageArticlesPanel.class);
        assertNotNull(homepageArticle);

        assertNotNull(homepageArticle.getFirstArticle());
        assertNotNull(homepageArticle.getSecondArticle());
        assertNotNull(homepageArticle.getThirdArticle());

        homepageArticle.setFirstArticle(null);
        homepageArticle.setSecondArticle(null);
        homepageArticle.setThirdArticle(null);

        assertNull(homepageArticle.getFirstArticle());
        assertNull(homepageArticle.getSecondArticle());
        assertNull(homepageArticle.getThirdArticle());
	}
}