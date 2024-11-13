package com.dhl.discover.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.dhl.discover.core.services.PageUtilService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
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

    @Mock
    private SearchResult searchResult;

    @Mock
    private Hit hit;

    @Mock
    private PageUtilService pageUtilServiceMock;

    @Mock
    private Article article;

    @Mock
    private Iterator<Resource> resourceIterator;

    @BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/dhl/discover/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.registerService(PageUtilService.class, pageUtilServiceMock);
	    ctx.addModelsForClasses(PageNotFound.class);
	}

	@Test
	void test() throws RepositoryException {
        Mockito.when(mockQueryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(page1MockQuery);
		ctx.currentResource("/content/dhl/country/en/culture/dhl-mo-salah");

        when(page1MockQuery.getResult()).thenReturn(searchResult);
        when(searchResult.getHits()).thenReturn(List.of(hit));
        Resource articlePageResource = ctx.resourceResolver().getResource("/content/dhl/country/en/culture/dhl-mo-salah/jcr:content");
        when(hit.getProperties()).thenReturn(articlePageResource.getValueMap());
        when(hit.getPath()).thenReturn("/content/dhl/country/en/culture/dhl-mo-salah");
        when(searchResult.getResources()).thenReturn(resourceIterator);
        when(pageUtilServiceMock.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        Map<String, Object> params = new HashMap<String, Object>();
		params.put("mode", "latest");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        PageNotFound pageNotFound = request.adaptTo(PageNotFound.class);
        assertNotNull(pageNotFound);
        assertEquals(1, pageNotFound.getTrendingArticles().size());
        pageNotFound.setTrendingArticles(new ArrayList<Article>());
        assertEquals(0, pageNotFound.getTrendingArticles().size());

        assertEquals("/content/dhl/country/en/culture/dhl-mo-salah.html", pageNotFound.getSearchResultsPage());
        pageNotFound.setSearchResultsPage("/content/dhl/country/en/searchResultsPage");
        assertEquals("/content/dhl/country/en/searchResultsPage", pageNotFound.getSearchResultsPage());
    }
}