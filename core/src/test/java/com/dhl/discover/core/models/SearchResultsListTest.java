package com.dhl.discover.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.*;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SearchResultsListTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

	@Mock
	private ResourceResolver resourceResolver;
	
	@Mock
	private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

	@Mock
	private Session session;

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

	@Mock
	private Page page;

	@BeforeEach
	void setUp() throws Exception {
		ctx.load().json("/com/dhl/discover/core/models/SiteContent.json", "/content");
		ctx.registerService(QueryBuilder.class, mockQueryBuilder);
		ctx.registerService(PageUtilService.class, pageUtilServiceMock);
		ctx.addModelsForClasses(PageNotFound.class);
		ctx.currentResource("/content/dhl/country/en/search-results");

		when(mockQueryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(page1MockQuery);
		when(searchResult.getHits()).thenReturn(List.of(hit));
		when(hit.getPath()).thenReturn("/content/dhl/country/en/culture/dhl-mo-salah");
		when(searchResult.getResources()).thenReturn(resourceIterator);
		when(pageUtilServiceMock.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);
		when(pageUtilServiceMock.getHomePage(any(Page.class))).thenReturn(page);
		when(page.getPath()).thenReturn("/content/dhl/country/en");
	}

	@Test
	void testSortByTitle() {
		ctx.currentResource("/content/dhl/country/en/search-results");
		when(page1MockQuery.getResult()).thenReturn(searchResult);

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("searchfield", "subscription");
		params.put("sort", "title");
		params.put("searchResultsType", "");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
        
		SearchResultsList searchResultsList = request.adaptTo(SearchResultsList.class);
		assertNotNull(searchResultsList);

		assertNull(searchResultsList.getTest());
		assertEquals("", searchResultsList.getSearchResultsType());
		assertEquals("subscription", searchResultsList.getSearchTerm());
		assertFalse(searchResultsList.getNoSearchTerm());
		assertEquals("title", searchResultsList.getSortBy());
		assertEquals(0, searchResultsList.getCountArticles());
		assertEquals(0, searchResultsList.getCountVideo());
		assertEquals(0, searchResultsList.getCountCompetition());
		assertEquals(0, searchResultsList.getCountDownload());
		assertEquals(0, searchResultsList.getCountInteractive());

		searchResultsList.setResults(new ArrayList<Article>());
		searchResultsList.setResultSummary(new HashMap<String, Integer>());
		searchResultsList.setTrendingArticles(new ArrayList<Article>());
		searchResultsList.setSearchTerm("search-term");
		searchResultsList.setSortBy("date");
		searchResultsList.setNoSearchTerm(true);
		searchResultsList.setPagedResults(new ArrayList<Article>());
		searchResultsList.setNumPages(0);
		searchResultsList.setPageNumber(0);
		searchResultsList.setTotalResults(0);
		searchResultsList.setPreviousPageNumber(0);
		searchResultsList.setNextPageNumber(0);
		searchResultsList.setPageNumbers(new ArrayList<Integer>());

		assertEquals(0, searchResultsList.getResults().size());
		assertEquals(0, searchResultsList.getResultSummary().size());
		assertEquals(0, searchResultsList.getTrendingArticles().size());
		assertEquals("search-term", searchResultsList.getSearchTerm());
		assertEquals("date", searchResultsList.getSortBy());
		assertEquals(0, searchResultsList.getPagedResults().size());
		assertEquals(0, searchResultsList.getNumPages());
		assertEquals(0, searchResultsList.getPageNumber());
		assertEquals(0, searchResultsList.getTotalResults());
		assertEquals(0, searchResultsList.getPreviousPageNumber());
		assertEquals(0, searchResultsList.getNextPageNumber());
		assertEquals(0, searchResultsList.getPageNumbers().size());
	}

	@Test
	void testSortByDate() throws RepositoryException {
		when(page1MockQuery.getResult()).thenReturn(null, searchResult);
		Resource articlePageResource = ctx.resourceResolver().getResource("/content/dhl/country/en/culture/dhl-mo-salah/jcr:content");
		when(hit.getProperties()).thenReturn(articlePageResource.getValueMap());

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("searchfield", "subscription");
		params.put("sort", "date");
		params.put("searchResultsType", "");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
		
		SearchResultsList searchResultsList = request.adaptTo(SearchResultsList.class);

		assertNotNull(searchResultsList);
		assertEquals("date", searchResultsList.getSortBy());
	}
}
