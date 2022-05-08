package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.jcr.Session;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
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
	private QueryBuilder queryBuilder;

    @Mock
    private Query page1MockQuery;

	@Mock
	private Session session;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, queryBuilder);
	    ctx.addModelsForClasses(SearchResultsList.class);
	}

	@Test
	void testSortByTitle() {
		Mockito.when(queryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(page1MockQuery);
		ctx.currentResource("/content/dhl/en/search-results");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("searchfield", "subscription");
		params.put("sort", "title");
		params.put("searchResultsType", "");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
        
		SearchResultsList searchResultsList = request.adaptTo(SearchResultsList.class);

		assert searchResultsList != null;
		assertEquals("subscription", searchResultsList.getSearchTerm());
		assertFalse(searchResultsList.getNoSearchTerm());
		assertEquals("title", searchResultsList.getSortBy());
		assertEquals(0, searchResultsList.getCountArticles());
		assertEquals(0, searchResultsList.getCountVideo());
		assertEquals(0, searchResultsList.getCountCompetition());
		assertEquals(0, searchResultsList.getCountDownload());
		assertEquals(0, searchResultsList.getCountInteractive());
		assertEquals(0, searchResultsList.getCountAll());
		
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
	void testSortByDate() {
		Mockito.when(queryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(page1MockQuery);
		ctx.currentResource("/content/dhl/en/search-results");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("searchfield", "subscription");
		params.put("sort", "date");
		params.put("searchResultsType", "");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
		
		SearchResultsList searchResultsList = request.adaptTo(SearchResultsList.class);

		assert searchResultsList != null;
		assertEquals("date", searchResultsList.getSortBy());
	}

}
