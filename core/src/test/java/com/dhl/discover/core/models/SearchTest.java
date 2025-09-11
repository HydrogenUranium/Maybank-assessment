package com.dhl.discover.core.models;

import com.day.cq.tagging.InvalidTagFormatException;
import com.dhl.discover.core.services.TagUtilService;
import com.google.gson.Gson;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SearchTest {

    private final AemContext context = new AemContext();

    @Mock
    private TagUtilService tagUtilService;

    @BeforeEach
    void setUp() throws InvalidTagFormatException {
        context.addModelsForClasses(Search.class);
        context.registerService(TagUtilService.class, tagUtilService);
        context.create().resource("/content/search",
                "title", "Search Results",
                "descriptionFormat", "<p>Browse search results for <b>{0}</b> (Showing {1} of {2} results)</p>",
                "descriptionFormatNoResults", "<p> No results found for <b>{0}</b>",
                "popularSearchesTitle", "Popular searches",
                "sortByTitle", "Sort By",
                "latestSortOptionTitle", "Latest",
                "relevanceSortOptionTitle", "Relevance",
                "showMoreResultsButtonTitle", "Show More Results",
                "searchButtonAriaLabel", "Search",
                "searchInputAriaLabel", "Enter search term");
    }

    @Test
    void test() {
        List<String> mockTopics = Arrays.asList("Business", "China");
        when(tagUtilService.getTrendingTopics(any(Resource.class))).thenReturn(mockTopics);

        Resource resource = context.resourceResolver().getResource("/content/search");
        Search search = resource.adaptTo(Search.class);

        assertNotNull(search);
        assertEquals("Search Results", search.getTitle());
        assertEquals("<p>Browse search results for <b>{0}</b> (Showing {1} of {2} results)</p>", search.getDescriptionFormat());
        assertEquals("<p> No results found for <b>{0}</b>", search.getDescriptionFormatNoResults());
        assertEquals("Popular searches", search.getPopularSearchesTitle());
        assertEquals("Sort By", search.getSortByTitle());
        assertEquals("Latest", search.getLatestSortOptionTitle());
        assertEquals("Relevance", search.getRelevanceSortOptionTitle());
        assertEquals("Show More Results", search.getShowMoreResultsButtonTitle());
        assertEquals("Search", search.getSearchButtonAriaLabel());
        assertEquals("Enter search term", search.getSearchInputAriaLabel());

        verify(tagUtilService).getTrendingTopics(resource);

        String expectedJson = new Gson().toJson(mockTopics);
        assertEquals(expectedJson, search.getPopularTopics());
    }
}