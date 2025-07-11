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
        assertEquals("shipping", suggestionService.isValid("shipping"));
        assertEquals("DHL Express", suggestionService.isValid("DHL Express"));
        assertEquals("DHL123", suggestionService.isValid("DHL123"));

        assertEquals("", suggestionService.isValid("<script>alert('xss')</script>"));
        assertEquals("", suggestionService.isValid("shipping&tracking"));

        assertThrows(NullPointerException.class, () -> suggestionService.isValid(null));
    }

    @Test
    void testGetTagsNamesByQuery() {
        Resource mockResource = mock(Resource.class);
        when(resolverMock.getResource(eq(TEST_HOME_PATH))).thenReturn(mockResource);

        when(tagUtilService.getTagLocalizedSuggestionsByQuery(
                eq(resolverMock), eq(TEST_QUERY), eq("dhl:"), eq(Locale.ENGLISH), eq(5)))
                .thenReturn(Arrays.asList("shipping services", "shipping rates"));

        List<String> results = suggestionService.getTagsNamesByQuery(resolverMock, TEST_QUERY, TEST_HOME_PATH);
        assertEquals(2, results.size());
        assertEquals("shipping services", results.get(0));
        assertEquals("shipping rates", results.get(1));

        results = suggestionService.getTagsNamesByQuery(resolverMock, "", TEST_HOME_PATH);
        assertTrue(results.isEmpty());
    }

    @Test
    void testGetSuggestionIndexName() {
        ResourceResolver testResolver = mock(ResourceResolver.class);
        when(resolverHelper.getReadResourceResolver()).thenReturn(testResolver);

        try (MockedStatic<IndexUtils> indexUtils = mockStatic(IndexUtils.class)) {
            indexUtils.when(() -> IndexUtils.getSuggestionIndexName(eq(TEST_HOME_PATH), eq(testResolver)))
                    .thenReturn(TEST_INDEX);

            String indexName = suggestionService.getSuggestionIndexName(TEST_HOME_PATH);
            assertEquals(TEST_INDEX, indexName);
        }
    }

    @Test
    void testGetSuggestionRows() throws Exception {

        try (MockedStatic<QueryManagerUtils> queryManagerUtils = mockStatic(QueryManagerUtils.class)) {
            queryManagerUtils.when(() -> QueryManagerUtils.getSuggestedWords(eq("shipping"), eq("suggest"), eq(TEST_INDEX), eq(queryManager)))
                    .thenReturn(Arrays.asList("shipping cost", "shipping rates"));

            List<String> results = suggestionService.getSuggestionRows(TEST_QUERY, "suggest", TEST_INDEX, queryManager);
            assertEquals(2, results.size());
            assertEquals("shipping cost", results.get(0));
            assertEquals("shipping rates", results.get(1));

            results = suggestionService.getSuggestionRows("", "suggest", TEST_INDEX, queryManager);
            assertTrue(results.isEmpty());

            results = suggestionService.getSuggestionRows(TEST_QUERY, "suggest", "", queryManager);
            assertTrue(results.isEmpty());
        }
    }

    @Test
    void testCollectSuggestions() throws Exception {
        Resource mockResource = mock(Resource.class);
        when(resolverMock.getResource(eq(TEST_HOME_PATH))).thenReturn(mockResource);
        try (MockedStatic<QueryManagerUtils> queryManagerUtils = mockStatic(QueryManagerUtils.class)) {

            queryManagerUtils.when(() -> QueryManagerUtils.getQueryManager(resolverMock)).thenReturn(queryManager);
            queryManagerUtils.when(() -> QueryManagerUtils.getSuggestedWords(eq(TEST_QUERY), eq("suggest"), eq(TEST_INDEX), eq(queryManager)))
                    .thenReturn(Arrays.asList("shipping cost", "shipping rates"));
            queryManagerUtils.when(() -> QueryManagerUtils.getSuggestedWords(eq(TEST_QUERY), eq("spellcheck"), eq(TEST_INDEX), eq(queryManager)))
                    .thenReturn(Collections.singletonList("shipment"));

            when(tagUtilService.getTagLocalizedSuggestionsByQuery(
                    eq(resolverMock), eq(TEST_QUERY), eq("dhl:"), eq(Locale.ENGLISH), eq(5)))
                    .thenReturn(Arrays.asList("dhl shipping", "express shipping"));

            try (MockedStatic<IndexUtils> indexUtils = mockStatic(IndexUtils.class)) {
                indexUtils.when(() -> IndexUtils.getSuggestionIndexName(eq(TEST_HOME_PATH), eq(resolverMock)))
                        .thenReturn(TEST_INDEX);

                Set<String> suggestions = suggestionService.collectSuggestions(resolverMock, TEST_QUERY, TEST_HOME_PATH, TEST_INDEX);

                assertTrue(suggestions.size() >= 5, "Should have at least 5 suggestions");
                assertTrue(suggestions.contains("dhl shipping"));
                assertTrue(suggestions.contains("express shipping"));
                assertTrue(suggestions.contains("shipping cost"));
                assertTrue(suggestions.contains("shipping rates"));
                assertTrue(suggestions.contains("shipment"));
            }
        }
    }

}
