package com.positive.dhl.core.models;

import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import java.util.List;

import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleShowcaseTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private QueryBuilder builder;

    @Mock
    private PageUtilService pageUtils;

    @Mock
    private Page page;

    @Mock
    private Query query;

    @Mock
    private SearchResult searchResult;

    @Mock
    private Hit hitOne;

    @Mock
    private Hit hitTwo;

    @BeforeEach
    void setUp() throws Exception {
        context.addModelsForClasses(ArticleShowcase.class);
        context.registerService(QueryBuilder.class, builder);
        context.registerService(PageUtilService.class, pageUtils);
        mockInject(context, "currentPage", page);
        context.load().json("/com/positive/dhl/core/models/ArticleShowcase/content.json", "/content");
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void init_ShouldInitArticles_WhenArticlesAreConfiguredToUseCustomPicks() {
        initRequest("/content/home/jcr:content/par/article-showcase");
        ArticleShowcase showcase = request.adaptTo(ArticleShowcase.class);

        assertEquals(4, showcase.getArticles().size());
    }

    @Test
    void init_ShouldInitArticles_WhenArticlesAreConfiguredToUseLatestPosts() throws RepositoryException {
        when(pageUtils.getHomePage(any())).thenReturn(page);
        when(page.getPath()).thenReturn("");
        when(builder.createQuery(any(), any())).thenReturn(query);
        when(query.getResult()).thenReturn(searchResult);
        when(hitOne.getPath()).thenReturn("/content/article_1");
        when(hitTwo.getPath()).thenReturn("/content/article_2");
        when(searchResult.getHits()).thenReturn(List.of(hitOne, hitTwo));
        initRequest("/content/home/jcr:content/par/article-showcase_latest-posts");

        ArticleShowcase showcase = request.adaptTo(ArticleShowcase.class);

        List<Article> articles = showcase.getArticles();
        assertEquals(4, articles.size());
        assertEquals("/article_2", articles.get(0).getPath());
        assertEquals("/article_2", articles.get(1).getPath());
        assertEquals("/article_1", articles.get(2).getPath());
        assertEquals("/article_1", articles.get(3).getPath());
    }
}