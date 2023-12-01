package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.TagUtilService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
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

import java.util.Arrays;
import java.util.Locale;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HomepageArticlesPanelTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.registerService(PageUtilService.class, pageUtilService);
        ctx.registerService(TagUtilService.class, tagUtilService);
        ctx.addModelsForClasses(HomepageArticlesPanel.class, Article.class);

        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
	}

	@Test
	void test() {
        Article article = createArticleModel(ctx.resourceResolver().getResource("/content/dhl/country/en"));
        when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        Resource resource = ctx.resourceResolver().getResource("/content/dhl/country/en/jcr:content/par/articlelisthomepage");
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

    private Article createArticleModel(Resource resource) {
        return ctx.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}