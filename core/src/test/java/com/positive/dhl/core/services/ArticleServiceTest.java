package com.positive.dhl.core.services;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleServiceTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

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
        when(builder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(query);
        when(query.getResult()).thenReturn(searchResult);
        when(hitOne.getPath()).thenReturn("/content/home/article_1");
        when(hitTwo.getPath()).thenReturn("/content/home/article_2");
        when(searchResult.getHits()).thenReturn(List.of(hitOne, hitTwo));
        var resolver = spy(context.resourceResolver());
        doNothing().when(resolver).close();
        when(resolverHelper.getReadResourceResolver()).thenReturn(resolver);
    }

    @Test
    void getLatestArticles_ShouldReturnArticles_WhenArticlesAreFound() {
        var articles = articleService.getLatestArticles("/content/home", 2);

        assertEquals(2, articles.size());
        assertEquals("/content/home/article_2", articles.get(0).getPath());
        assertEquals("/content/home/article_1", articles.get(1).getPath());
    }
}