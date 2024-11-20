package com.dhl.discover.core.models;

import com.day.cq.tagging.InvalidTagFormatException;
import com.dhl.discover.core.services.TagUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
        context.load().json("/com/dhl/discover/core/models/SearchComponent/content.json", "/content/home/search/jcr:content");
    }

    @Test
    void test() {
        Resource resource = context.resourceResolver().getResource("/content/home/search/jcr:content/search");
        when(tagUtilService.getTrendingTopics(resource)).thenReturn(List.of("Business", "China"));

        Search search = resource.adaptTo(Search.class);

        assertNotNull(search);
        assertEquals("Popular searches", search.getPopularSearchesTitle());
        assertEquals("[\"Business\",\"China\"]", search.getPopularTopics());
        assertEquals("Search Results", search.getTitle());
        assertEquals("<p>Browse search results for <b>{0}</b> (Showing {1} of {2} results)</p>", search.getDescriptionFormat());
        assertEquals("<p> No results found for <b>{0}</b>", search.getDescriptionFormatNoResults());
        assertEquals("Sort By", search.getSortByTitle());
        assertEquals("Latest", search.getLatestSortOptionTitle());
        assertEquals("Show More Results", search.getShowMoreResultsButtonTitle());
    }
}