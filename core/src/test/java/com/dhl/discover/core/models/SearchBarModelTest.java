package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.TagUtilService;
import com.google.gson.Gson;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static com.dhl.discover.junitUtils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static com.dhl.discover.junitUtils.InjectorMock.mockInjectHomeProperty;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
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
    void setUp() throws Throwable {
        context.addModelsForClasses(SearchBarModel.class);
        context.registerService(TagUtilService.class, tagUtilService);
        lenient().when(tagUtilService.getTrendingTopics(any(Resource.class))).thenReturn(List.of("Business", "China", "small business"));

        Page page = context.create().page("/content/dhl/global/en-global");
        context.currentPage(page);
    }

    private void initRequest(String path) {
        request.setPathInfo(path);

        Resource currentResource = resourceResolver.getResource(path);
        request.setResource(currentResource);

        Page currentPage = currentResource.adaptTo(Page.class);
        context.currentPage(currentPage);
    }

    @Test
    void test_withLocalSetup() {
        String componentPath = "/content/dhl/global/en-global/jcr:content/search-bar";

        Page page = context.create().page("/content/dhl/global/en-global");
        context.load().json("/com/dhl/discover/core/models/SearchBarModel/content.json", componentPath);
        when(tagUtilService.getTrendingTopics(any(Resource.class))).thenReturn(List.of("Business", "China", "small business"));
        context.currentPage(page);
        request.setPathInfo(componentPath);
        request.setResource(context.resourceResolver().getResource(componentPath));

        mockInjectHomeProperty(context, "searchBar-searchResultPage" ,"/content/dhl/global/en-global/search-results");

        SearchBarModel searchBarModel = request.adaptTo(SearchBarModel.class);
        assertNotNull(searchBarModel);

        assertEquals("Recently searched", searchBarModel.getRecentSearchesTitle());
        assertEquals("Trending topics", searchBarModel.getTrendingTopicsTitle());
        assertEquals("Go to search result page", searchBarModel.getSearchButtonAriaLabel());
        assertEquals("Open Search Bar", searchBarModel.getOpenAriaLabel());
        assertEquals("Close Search Bar", searchBarModel.getCloseAriaLabel());
        assertEquals("Articles", searchBarModel.getArticlesTitle());
        assertEquals("[\"Business\",\"China\",\"small business\"]", searchBarModel.getTrendingTopics());
        assertEquals("/content/dhl/global/en-global/search-results", searchBarModel.getSearchResultPage());
    }

    @Test
    void test_withValidSetup() throws PersistenceException {
        if (context.resourceResolver().getResource(ROOT_TEST_PAGE_PATH) != null) {
            context.resourceResolver().delete(context.resourceResolver().getResource(ROOT_TEST_PAGE_PATH));
        }
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, ROOT_TEST_PAGE_PATH);
        initRequest(ARTICLE_RESOURCE_PATH);

        mockInjectHomeProperty(context, "searchBar-recentSearchesTitle" ,"Recent Searches");
        mockInjectHomeProperty(context, "searchBar-trendingTopicsTitle" ,"Trending Topics");
        mockInjectHomeProperty(context, "searchBar-articlesTitle" ,"Articles");
        mockInjectHomeProperty(context, "searchBar-searchButtonAriaLabel" ,"search");
        mockInjectHomeProperty(context, "searchBar-openAriaLabel" ,"open");
        mockInjectHomeProperty(context, "searchBar-closeAriaLabel" ,"close");
        mockInjectHomeProperty(context, "searchBar-searchResultPage" ,"/content/dhl/global/en-global/search-results");

        SearchBarModel searchBarModel = request.adaptTo(SearchBarModel.class);
        assertNotNull(searchBarModel);

        assertEquals("Recent Searches", searchBarModel.getRecentSearchesTitle());
        assertEquals("Trending Topics", searchBarModel.getTrendingTopicsTitle());
        assertEquals("search", searchBarModel.getSearchButtonAriaLabel());
        assertEquals("open", searchBarModel.getOpenAriaLabel());
        assertEquals("close", searchBarModel.getCloseAriaLabel());
        assertEquals("Articles", searchBarModel.getArticlesTitle());
        assertEquals("[\"Business\",\"China\",\"small business\"]", searchBarModel.getTrendingTopics());
        assertEquals("/content/dhl/global/en-global/search-results", searchBarModel.getSearchResultPage());
    }

    @Test
    void test_withoutValidSetup() {
        if (context.resourceResolver().getResource(ROOT_TEST_PAGE_PATH) != null) {
            try {
                context.resourceResolver().delete(context.resourceResolver().getResource(ROOT_TEST_PAGE_PATH));
            } catch (PersistenceException e) {
                throw new RuntimeException(e);
            }
        }

        context.load().json(NEW_CONTENT_STRUCTURE_JSON, ROOT_TEST_PAGE_PATH);
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
        assertEquals("[\"Business\",\"China\",\"small business\"]", searchBarModel.getTrendingTopics());
    }

    @Test
    void testPropertyInjection() {
        // Create a component
        Resource componentResource = context.create().resource("/content/dhl/global/en-global/jcr:content/search-bar");

        // Setup home properties with different values for each property
        mockInjectHomeProperty(context, "searchBar-recentSearchesTitle", "Recent Searches");
        mockInjectHomeProperty(context, "searchBar-trendingTopicsTitle", "Trending Topics");
        mockInjectHomeProperty(context, "searchBar-searchButtonAriaLabel", "Search Button");
        mockInjectHomeProperty(context, "searchBar-showThumbnail", true);
        mockInjectHomeProperty(context, "searchBar-openAriaLabel", "Open Search");
        mockInjectHomeProperty(context, "searchBar-closeAriaLabel", "Close Search");
        mockInjectHomeProperty(context, "searchBar-searchInputAriaLabel", "Search Input");
        mockInjectHomeProperty(context, "searchBar-articlesTitle", "Articles");

        // Set current resource and adapt
        context.request().setResource(componentResource);
        SearchBarModel model = context.request().adaptTo(SearchBarModel.class);

        // Verify all properties were injected correctly
        assertNotNull(model);

        // Since we're testing the property injection and not the fallback logic,
        // we need to check the private fields directly using reflection
        try {
            java.lang.reflect.Field recentSearchesField = SearchBarModel.class.getDeclaredField("recentSearchesTitleHomeProperty");
            recentSearchesField.setAccessible(true);
            assertEquals("Recent Searches", recentSearchesField.get(model));

            java.lang.reflect.Field trendingTopicsField = SearchBarModel.class.getDeclaredField("trendingTopicsTitleHomeProperty");
            trendingTopicsField.setAccessible(true);
            assertEquals("Trending Topics", trendingTopicsField.get(model));

            java.lang.reflect.Field searchButtonField = SearchBarModel.class.getDeclaredField("searchButtonAriaLabelHomeProperty");
            searchButtonField.setAccessible(true);
            assertEquals("Search Button", searchButtonField.get(model));

            java.lang.reflect.Field showThumbnailField = SearchBarModel.class.getDeclaredField("showThumbnailHomeProperty");
            showThumbnailField.setAccessible(true);
            assertEquals(true, showThumbnailField.get(model));

            java.lang.reflect.Field openAriaField = SearchBarModel.class.getDeclaredField("openAriaLabelHomeProperty");
            openAriaField.setAccessible(true);
            assertEquals("Open Search", openAriaField.get(model));

            java.lang.reflect.Field closeAriaField = SearchBarModel.class.getDeclaredField("closeAriaLabelHomeProperty");
            closeAriaField.setAccessible(true);
            assertEquals("Close Search", closeAriaField.get(model));

            java.lang.reflect.Field searchInputField = SearchBarModel.class.getDeclaredField("searchInputAriaLabelHomeProperty");
            searchInputField.setAccessible(true);
            assertEquals("Search Input", searchInputField.get(model));

            java.lang.reflect.Field articlesField = SearchBarModel.class.getDeclaredField("articlesTitleHomeProperty");
            articlesField.setAccessible(true);
            assertEquals("Articles", articlesField.get(model));

            // Verify the ScriptVariable injection for currentPage
            java.lang.reflect.Field currentPageField = SearchBarModel.class.getDeclaredField("currentPage");
            currentPageField.setAccessible(true);
            Page injectedPage = (Page) currentPageField.get(model);
            assertNotNull(injectedPage);
            assertEquals("/content/dhl/global/en-global", injectedPage.getPath());

        } catch (Exception e) {
            fail("Failed to access fields via reflection: " + e.getMessage());
        }
    }

    @Test
    void testPropertyInjectionWithMixedValues() {
        Page testPage = context.create().page("/content/dhl/global/en-global");
        context.currentPage(testPage);
        // Create a component
        Resource componentResource = context.create().resource("/content/dhl/global/en-global/jcr:content/search-bar");

        // Setup some home properties but not others
        mockInjectHomeProperty(context, "searchBar-recentSearchesTitle", "Recent Searches");
        mockInjectHomeProperty(context, "searchBar-trendingTopicsTitle", "Trending Topics");
        // Deliberately not setting searchButtonAriaLabel
        mockInjectHomeProperty(context, "searchBar-showThumbnail", false);
        // Deliberately not setting openAriaLabel
        mockInjectHomeProperty(context, "searchBar-closeAriaLabel", "Close Search");
        mockInjectHomeProperty(context, "searchBar-searchInputAriaLabel", "Search Input");
        // Deliberately not setting articlesTitle

        // Set current resource and adapt
        context.request().setResource(componentResource);
        SearchBarModel model = context.request().adaptTo(SearchBarModel.class);

        assertNotNull(model);

        // Verify set properties were injected and unset properties are null/default
        try {
            java.lang.reflect.Field recentSearchesField = SearchBarModel.class.getDeclaredField("recentSearchesTitleHomeProperty");
            recentSearchesField.setAccessible(true);
            assertEquals("Recent Searches", recentSearchesField.get(model));

            java.lang.reflect.Field searchButtonField = SearchBarModel.class.getDeclaredField("searchButtonAriaLabelHomeProperty");
            searchButtonField.setAccessible(true);
            assertNull(searchButtonField.get(model));

            java.lang.reflect.Field showThumbnailField = SearchBarModel.class.getDeclaredField("showThumbnailHomeProperty");
            showThumbnailField.setAccessible(true);
            assertEquals(false, showThumbnailField.get(model));

            java.lang.reflect.Field openAriaField = SearchBarModel.class.getDeclaredField("openAriaLabelHomeProperty");
            openAriaField.setAccessible(true);
            assertNull(openAriaField.get(model));

            java.lang.reflect.Field articlesField = SearchBarModel.class.getDeclaredField("articlesTitleHomeProperty");
            articlesField.setAccessible(true);
            assertNull(articlesField.get(model));

        } catch (Exception e) {
            fail("Failed to access fields via reflection: " + e.getMessage());
        }
    }

    @Test
    void testComponentPropertiesOverrideHomeProperties() {
        // Create component with specific properties
        Resource componentResource = context.create().resource("/content/dhl/global/en-global/jcr:content/search-bar",
                "recentSearchesTitle", "Component Recent Searches",
                "trendingTopicsTitle", "Component Trending Topics",
                "searchButtonAriaLabel", "Component Search Button",
                "showThumbnail", true,
                "openAriaLabel", "Component Open",
                "closeAriaLabel", "Component Close",
                "searchInputAriaLabel", "Component Search Input",
                "articlesTitle", "Component Articles");

        // Setup home properties with different values
        mockInjectHomeProperty(context, "searchBar-recentSearchesTitle", "Home Recent Searches");
        mockInjectHomeProperty(context, "searchBar-trendingTopicsTitle", "Home Trending Topics");
        mockInjectHomeProperty(context, "searchBar-searchButtonAriaLabel", "Home Search Button");
        mockInjectHomeProperty(context, "searchBar-showThumbnail", false);
        mockInjectHomeProperty(context, "searchBar-openAriaLabel", "Home Open");
        mockInjectHomeProperty(context, "searchBar-closeAriaLabel", "Home Close");
        mockInjectHomeProperty(context, "searchBar-searchInputAriaLabel", "Home Search Input");
        mockInjectHomeProperty(context, "searchBar-articlesTitle", "Home Articles");
        mockInjectHomeProperty(context, "searchBar-searchResultPage", "/content/search-results");

        // Setup trending topics
        List<String> trendingTopics = Arrays.asList("Business", "China", "Supply Chain");
        when(tagUtilService.getTrendingTopics(any(Resource.class))).thenReturn(trendingTopics);

        // Set current resource
        request.setResource(componentResource);

        // Adapt to model
        SearchBarModel model = request.adaptTo(SearchBarModel.class);
        assertNotNull(model);

        // Component properties should take precedence over home properties
        assertEquals("Component Recent Searches", model.getRecentSearchesTitle());
        assertEquals("Component Trending Topics", model.getTrendingTopicsTitle());
        assertEquals("Component Search Button", model.getSearchButtonAriaLabel());
        assertTrue(model.isShowThumbnail());
        assertEquals("Component Open", model.getOpenAriaLabel());
        assertEquals("Component Close", model.getCloseAriaLabel());
        assertEquals("Component Search Input", model.getSearchInputAriaLabel());
        assertEquals("Component Articles", model.getArticlesTitle());

        // Trending topics and search result page
        assertEquals(new Gson().toJson(trendingTopics), model.getTrendingTopics());
        assertEquals("/content/search-results", model.getSearchResultPage());
    }

    @Test
    void testHomePropertiesFallback() {
        // Create component with no properties
        Resource componentResource = context.create().resource("/content/dhl/global/en-global/jcr:content/search-bar");

        // Setup home properties
        mockInjectHomeProperty(context, "searchBar-recentSearchesTitle", "Home Recent Searches");
        mockInjectHomeProperty(context, "searchBar-trendingTopicsTitle", "Home Trending Topics");
        mockInjectHomeProperty(context, "searchBar-searchButtonAriaLabel", "Home Search Button");
        mockInjectHomeProperty(context, "searchBar-showThumbnail", true);
        mockInjectHomeProperty(context, "searchBar-openAriaLabel", "Home Open");
        mockInjectHomeProperty(context, "searchBar-closeAriaLabel", "Home Close");
        mockInjectHomeProperty(context, "searchBar-searchInputAriaLabel", "Home Search Input");
        mockInjectHomeProperty(context, "searchBar-articlesTitle", "Home Articles");
        mockInjectHomeProperty(context, "searchBar-searchResultPage", "/content/search-results");

        // Setup trending topics
        List<String> trendingTopics = Arrays.asList("Business", "China", "Supply Chain");
        when(tagUtilService.getTrendingTopics(any(Resource.class))).thenReturn(trendingTopics);

        // Set current resource
        request.setResource(componentResource);

        // Adapt to model
        SearchBarModel model = request.adaptTo(SearchBarModel.class);
        assertNotNull(model);

        // Should use home properties as fallback
        assertEquals("Home Recent Searches", model.getRecentSearchesTitle());
        assertEquals("Home Trending Topics", model.getTrendingTopicsTitle());
        assertEquals("Home Search Button", model.getSearchButtonAriaLabel());
        assertTrue(model.isShowThumbnail());
        assertEquals("Home Open", model.getOpenAriaLabel());
        assertEquals("Home Close", model.getCloseAriaLabel());
        assertEquals("Home Search Input", model.getSearchInputAriaLabel());
        assertEquals("Home Articles", model.getArticlesTitle());

        // Trending topics and search result page
        assertEquals(new Gson().toJson(trendingTopics), model.getTrendingTopics());
        assertEquals("/content/search-results", model.getSearchResultPage());
    }

}