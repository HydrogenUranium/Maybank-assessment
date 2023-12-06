package com.positive.dhl.core.services;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.positive.dhl.core.models.Article;
import com.positive.dhl.core.models.ArticleGrid;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleServiceTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private QueryBuilder builder;

    @Mock
    private Query query;

    @Mock
    private SearchResult searchResult;

    @Mock
    private Hit hitOne;

    @Mock
    private Hit hitTwo;

    @Mock
    private ResourceResolverHelper resolverHelper;

    @InjectMocks
    private ArticleService articleService;

    @BeforeEach
    void setUp() throws RepositoryException {
        context.load().json("/com/positive/dhl/core/services/ArticleServiceTest/content.json", "/content");
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.addModelsForClasses(Article.class);

        when(builder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(query);
        when(query.getResult()).thenReturn(searchResult);
        when(hitOne.getPath()).thenReturn("/content/home/article_1");
        when(hitTwo.getPath()).thenReturn("/content/home/article_2");
        when(searchResult.getHits()).thenReturn(List.of(hitOne, hitTwo));
        var resolver = spy(context.resourceResolver());
        doNothing().when(resolver).close();
        when(resolverHelper.getReadResourceResolver()).thenReturn(resolver);

        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
        lenient().when(pathUtilService.resolveAssetPath(any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/prefix" + invocationOnMock.getArgument(0, String.class) : "";
        });
    }

    @Test
    void getLatestArticles_ShouldReturnArticles_WhenArticlesAreFound() {
        Article article1 = createArticleModel(context.resourceResolver().getResource("/content/home/article_1"));
        Article article2 = createArticleModel(context.resourceResolver().getResource("/content/home/article_2"));
        lenient().when(pageUtilService.getArticle(eq("/content/home/article_1"), any(ResourceResolver.class))).thenReturn(article1);
        lenient().when(pageUtilService.getArticle(eq("/content/home/article_2"), any(ResourceResolver.class))).thenReturn(article2);

        var articles = articleService.getLatestArticles("/content/home", 2);

        assertEquals(2, articles.size());
        assertEquals("/content/home/article_2", articles.get(0).getPath());
        assertEquals("/content/home/article_1", articles.get(1).getPath());
    }

    private Article createArticleModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}