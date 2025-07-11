package com.dhl.discover.core.services;

import com.dhl.discover.core.services.impl.SuggestionsServiceImpl;
import com.dhl.discover.core.utils.IndexUtils;
import com.dhl.discover.core.utils.QueryManagerUtils;
import com.google.gson.JsonParser;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Session;
import javax.jcr.Workspace;
import javax.jcr.query.QueryManager;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class SuggestionsServiceImplTest {

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private ResourceResolver resolverMock;

    @Mock
    private ResourceResolverHelper resolverHelper;

    @Mock
    private QueryManager queryManager;

    @InjectMocks
    private SuggestionsServiceImpl suggestionService;

    //private SlingHttpServletRequest request;
    //private ResourceResolver resourceResolver;
    private static final String TEST_HOME_PATH = "/content/dhl/en";
    private static final String TEST_QUERY = "shipping";
    private static final String TEST_INDEX = "dhl-en-suggestions";
    @BeforeEach
    void setUp() {
        context.create().resource(TEST_HOME_PATH);

        request.setResource(context.resourceResolver().getResource(TEST_HOME_PATH));
        context.requestPathInfo().setResourcePath(TEST_HOME_PATH);
        context.requestPathInfo().setSuffix(null);
        request.setParameterMap(Map.of("s", TEST_QUERY));

        lenient().when(tagUtilService.getTagLocalizedSuggestionsByQuery(any(), anyString(), anyString(), any(), anyInt()))
                .thenReturn(List.of("Global Logistics", "Global Business"));
        lenient().when(pageUtilService.getLocale((Resource) any())).thenReturn(Locale.ENGLISH);


    }

    @Test
    void testIsValid() {
        // Test valid inputs
        assertEquals("shipping", suggestionService.isValid("shipping"));
        assertEquals("DHL Express", suggestionService.isValid("DHL Express"));
        assertEquals("DHL123", suggestionService.isValid("DHL123"));

        // Test invalid inputs with dangerous characters
        assertEquals("", suggestionService.isValid("<script>alert('xss')</script>"));
        assertEquals("", suggestionService.isValid("shipping&tracking"));

        // Test null input
        assertThrows(NullPointerException.class, () -> suggestionService.isValid(null));
    }

    @Test
    void testGetTagsNamesByQuery() {
        // Mock dependencies
        Resource resource = resourceResolver.getResource(TEST_HOME_PATH);
        when(tagUtilService.getTagLocalizedSuggestionsByQuery(
                eq(resourceResolver), eq(TEST_QUERY), eq("dhl:"), eq(Locale.ENGLISH), eq(5)))
                .thenReturn(Arrays.asList("shipping services", "shipping rates"));

        // Test with valid query
        List<String> results = suggestionService.getTagsNamesByQuery(request, TEST_QUERY, TEST_HOME_PATH);
        assertEquals(2, results.size());
        assertEquals("shipping services", results.get(0));
        assertEquals("shipping rates", results.get(1));

        // Test with blank query
        results = suggestionService.getTagsNamesByQuery(request, "", TEST_HOME_PATH);
        assertTrue(results.isEmpty());
    }

    @Test
    void testGetSuggestionIndexName() {
        ResourceResolver testResolver = mock(ResourceResolver.class);
        when(resolverHelper.getReadResourceResolver()).thenReturn(testResolver);

        try (MockedStatic<IndexUtils> indexUtils = mockStatic(IndexUtils.class)) {
            // Mock static method with the SAME resourceResolver that will be used
            indexUtils.when(() -> IndexUtils.getSuggestionIndexName(eq(TEST_HOME_PATH), eq(testResolver)))
                    .thenReturn(TEST_INDEX);

            // Test the method
            String indexName = suggestionService.getSuggestionIndexName(TEST_HOME_PATH);
            assertEquals(TEST_INDEX, indexName);
        }
    }

    @Test
    void testGetSuggestionRows() throws Exception {
        // Mock dependencies
        try (MockedStatic<QueryManagerUtils> queryManagerUtils = mockStatic(QueryManagerUtils.class)) {
            queryManagerUtils.when(() -> QueryManagerUtils.getSuggestedWords(eq("shipping"), eq("suggest"), eq(TEST_INDEX), eq(queryManager)))
                    .thenReturn(Arrays.asList("shipping cost", "shipping rates"));

            // Test with valid parameters
            List<String> results = suggestionService.getSuggestionRows(TEST_QUERY, "suggest", TEST_INDEX, queryManager);
            assertEquals(2, results.size());
            assertEquals("shipping cost", results.get(0));
            assertEquals("shipping rates", results.get(1));

            // Test with blank search string
            results = suggestionService.getSuggestionRows("", "suggest", TEST_INDEX, queryManager);
            assertTrue(results.isEmpty());

            // Test with blank index name
            results = suggestionService.getSuggestionRows(TEST_QUERY, "suggest", "", queryManager);
            assertTrue(results.isEmpty());
        }
    }

    @Test
    void testCollectSuggestions() throws Exception {
        // Setup request with mocked query manager
        Session session = mock(Session.class);
        Workspace workspace = mock(Workspace.class);
        context.request().getResourceResolver().adaptTo(Session.class);

        try (MockedStatic<QueryManagerUtils> queryManagerUtils = mockStatic(QueryManagerUtils.class)) {
            // Mock dependencies
            queryManagerUtils.when(() -> QueryManagerUtils.getQueryManager(request)).thenReturn(queryManager);
            queryManagerUtils.when(() -> QueryManagerUtils.getSuggestedWords(eq("shipping"), eq("suggest"), eq(TEST_INDEX), eq(queryManager)))
                    .thenReturn(Arrays.asList("shipping cost", "shipping rates"));
            queryManagerUtils.when(() -> QueryManagerUtils.getSuggestedWords(eq("shipping"), eq("spellcheck"), eq(TEST_INDEX), eq(queryManager)))
                    .thenReturn(Collections.singletonList("shipment"));

            // Mock tag suggestions
            Resource resource = resourceResolver.getResource(TEST_HOME_PATH);
            when(tagUtilService.getTagLocalizedSuggestionsByQuery(
                    eq(resourceResolver), eq(TEST_QUERY), eq("dhl:"), eq(Locale.ENGLISH), eq(5)))
                    .thenReturn(Arrays.asList("dhl shipping", "express shipping"));

            // Test collecting suggestions
            Set<String> suggestions = suggestionService.collectSuggestions(request, TEST_QUERY, TEST_HOME_PATH, TEST_INDEX);

            // Verify we have 5 unique suggestions (since there may be overlaps)
            assertTrue(suggestions.size() >= 3);
            assertTrue(suggestions.contains("dhl shipping"));
            assertTrue(suggestions.contains("express shipping"));
        }
    }

    @Test
    void testProcessRequest() throws Exception {
        // Mock dependencies for complete flow
        try (MockedStatic<QueryManagerUtils> queryManagerUtils = mockStatic(QueryManagerUtils.class);
             MockedStatic<IndexUtils> indexUtils = mockStatic(IndexUtils.class)) {

            // Setup index name
            indexUtils.when(() -> IndexUtils.getSuggestionIndexName(TEST_HOME_PATH, resourceResolver))
                    .thenReturn(TEST_INDEX);

            // Setup query manager
            queryManagerUtils.when(() -> QueryManagerUtils.getQueryManager(request)).thenReturn(queryManager);
            queryManagerUtils.when(() -> QueryManagerUtils.getSuggestedWords(eq("shipping"), eq("suggest"), eq(TEST_INDEX), eq(queryManager)))
                    .thenReturn(Arrays.asList("shipping cost", "shipping rates"));
            queryManagerUtils.when(() -> QueryManagerUtils.getSuggestedWords(eq("shipping"), eq("spellcheck"), eq(TEST_INDEX), eq(queryManager)))
                    .thenReturn(Collections.emptyList());

            // Mock tag suggestions
            Resource resource = resourceResolver.getResource(TEST_HOME_PATH);
            when(tagUtilService.getTagLocalizedSuggestionsByQuery(
                    eq(resourceResolver), eq(TEST_QUERY), eq("dhl:"), eq(Locale.ENGLISH), eq(5)))
                    .thenReturn(Collections.singletonList("express shipping"));

            // Test process request
            String jsonResponse = suggestionService.processRequest(request);

            // Verify JSON structure
            var jsonObject = JsonParser.parseString(jsonResponse).getAsJsonObject();
            assertEquals("ok", jsonObject.get("status").getAsString());
            assertEquals(TEST_QUERY, jsonObject.get("term").getAsString());
            var results = jsonObject.getAsJsonArray("results");
            assertTrue(results.size() >= 1);
        }
    }

    @Test
    void testProcessRequestWithInvalidQuery() throws Exception {
        // Setup request with invalid query
        request.setParameterMap(Map.of("s", "<script>alert('xss')</script>"));

        // Mock dependencies
        try (MockedStatic<IndexUtils> indexUtils = mockStatic(IndexUtils.class)) {
            indexUtils.when(() -> IndexUtils.getSuggestionIndexName(TEST_HOME_PATH, resourceResolver))
                    .thenReturn(TEST_INDEX);

            // Test process request with invalid query
            String jsonResponse = suggestionService.processRequest(request);

            // Verify empty results but valid JSON
            var jsonObject = JsonParser.parseString(jsonResponse).getAsJsonObject();
            assertEquals("ok", jsonObject.get("status").getAsString());
            assertEquals("", jsonObject.get("term").getAsString());
            var results = jsonObject.getAsJsonArray("results");
            assertEquals(0, results.size());
        }
    }

}
