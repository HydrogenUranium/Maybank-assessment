package com.positive.dhl.core.models;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.TagUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static com.positive.dhl.junitUtils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static com.positive.dhl.junitUtils.InjectorMock.mockInject;
import static com.positive.dhl.junitUtils.InjectorMock.mockInjectHomeProperty;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SearchBarModelTest {
    public static final String ROOT_TEST_PAGE_PATH = "/content";
    public static final String ARTICLE_RESOURCE_PATH = "/content/dhl/us/en-us/category-page/article-page-without-new-article-setup";

    private final AemContext context = new AemContext();
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private TagUtilService tagUtilService;

    @BeforeEach
    void setUp() throws InvalidTagFormatException {
        context.addModelsForClasses(SearchBarModel.class);
        context.registerService(TagUtilService.class, tagUtilService);
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, ROOT_TEST_PAGE_PATH);
    }

    private void initRequest(String path) {
        request.setPathInfo(path);

        Resource currentResource = resourceResolver.getResource(path);
        request.setResource(currentResource);

        Page currentPage = currentResource.adaptTo(Page.class);
        mockInject(context, "currentPage", currentPage);
    }

    @Test
    void test_withValidSetup() {
        initRequest(ARTICLE_RESOURCE_PATH);

        when(tagUtilService.getDefaultTrendingTopicsList(any(Resource.class))).thenReturn(List.of("Business", "China", "small business"));
        mockInjectHomeProperty(context, "searchBar-recentSearchesTitle" ,"Recent Searches");
        mockInjectHomeProperty(context, "searchBar-trendingTopicsTitle" ,"Trending Topics");
        mockInjectHomeProperty(context, "searchBar-articlesTitle" ,"Articles");
        mockInjectHomeProperty(context, "searchBar-searchResultPage" ,"/content/dhl/global/en-global/search-results");

        SearchBarModel searchBarModel = request.adaptTo(SearchBarModel.class);
        assertNotNull(searchBarModel);

        assertEquals("Recent Searches", searchBarModel.getRecentSearchesTitle());
        assertEquals("Trending Topics", searchBarModel.getTrendingTopicsTitle());
        assertEquals("Articles", searchBarModel.getArticlesTitle());
        assertEquals("[\"Business\",\"China\",\"small business\"]", searchBarModel.getTrendingTopics());
        assertEquals("/content/dhl/global/en-global/search-results", searchBarModel.getSearchResultPage());
    }

    @Test
    void test_withoutValidSetup() {
        initRequest(ARTICLE_RESOURCE_PATH);

        mockInjectHomeProperty(context, "searchBar-recentSearchesTitle" ,null);
        mockInjectHomeProperty(context, "searchBar-trendingTopicsTitle" ,null);
        mockInjectHomeProperty(context, "searchBar-articlesTitle" ,null);
        mockInjectHomeProperty(context, "searchBar-searchResultPage" ,null);

        SearchBarModel searchBarModel = request.adaptTo(SearchBarModel.class);
        assertNotNull(searchBarModel);

        assertNull(searchBarModel.getRecentSearchesTitle());
        assertNull(searchBarModel.getTrendingTopicsTitle());
        assertNull(searchBarModel.getArticlesTitle());
        assertEquals("[]", searchBarModel.getTrendingTopics());
        assertEquals("", searchBarModel.getSearchResultPage());
    }
}