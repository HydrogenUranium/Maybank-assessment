package com.dhl.discover.core.services.impl;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Session;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryFinderImplTest {
    @Mock
    private QueryBuilder queryBuilder;

    @Mock
    private Query query;

    @Mock
    private SearchResult searchResult;

    @Mock
    private Page page;

    @Mock
    private Page parentPage;

    @Mock
    private ValueMap valueMap;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private Session session;

    @InjectMocks
    private CategoryFinderImpl categoryFinder;

    private final String TEST_RESOURCE_TYPE = "test/resource/type";
    private final String TEST_PAGE_PATH = "/content/test/page";

    @BeforeEach
    void setUp() {
        lenient().when(page.getPath()).thenReturn(TEST_PAGE_PATH);
        lenient().when(page.getProperties()).thenReturn(valueMap);
    }

    @Test
    void getGroupPage_withMatchingResourceType_returnsCurrentPage() {
        when(valueMap.containsKey(ResourceResolver.PROPERTY_RESOURCE_TYPE)).thenReturn(true);
        when(valueMap.get(eq(ResourceResolver.PROPERTY_RESOURCE_TYPE), anyString())).thenReturn(TEST_RESOURCE_TYPE);

        Page result = categoryFinder.getGroupPage(TEST_RESOURCE_TYPE, page);
        assertSame(page, result);
    }

    @Test
    void getGroupPage_withMatchingResourceTypeInParent_returnsParentPage() {
        when(valueMap.containsKey(ResourceResolver.PROPERTY_RESOURCE_TYPE)).thenReturn(true);
        when(valueMap.get(eq(ResourceResolver.PROPERTY_RESOURCE_TYPE), anyString())).thenReturn("different/type");
        when(page.getParent()).thenReturn(parentPage);

        ValueMap parentValueMap = mock(ValueMap.class);
        when(parentPage.getProperties()).thenReturn(parentValueMap);
        when(parentValueMap.containsKey(ResourceResolver.PROPERTY_RESOURCE_TYPE)).thenReturn(true);
        when(parentValueMap.get(eq(ResourceResolver.PROPERTY_RESOURCE_TYPE), anyString())).thenReturn(TEST_RESOURCE_TYPE);
        Page result = categoryFinder.getGroupPage(TEST_RESOURCE_TYPE, page);
        assertSame(parentPage, result);
    }

    @Test
    void getGroupPage_withNoMatchingResourceType_returnsNull() {
        when(valueMap.containsKey(ResourceResolver.PROPERTY_RESOURCE_TYPE)).thenReturn(true);
        when(valueMap.get(eq(ResourceResolver.PROPERTY_RESOURCE_TYPE), anyString())).thenReturn("different/type");
        when(page.getParent()).thenReturn(null);
        Page result = categoryFinder.getGroupPage(TEST_RESOURCE_TYPE, page);
        assertNull(result);
    }

    @Test
    void getGroupPageWithArray_withMatchingFirstResourceType_returnsPage() {
        String[] resourceTypes = new String[] { TEST_RESOURCE_TYPE, "other/type" };
        when(valueMap.containsKey(ResourceResolver.PROPERTY_RESOURCE_TYPE)).thenReturn(true);
        when(valueMap.get(eq(ResourceResolver.PROPERTY_RESOURCE_TYPE), anyString())).thenReturn(TEST_RESOURCE_TYPE);
        Page result = categoryFinder.getGroupPage(resourceTypes, page);
        assertSame(page, result);
    }

    @Test
    void getGroupPageWithArray_withMatchingSecondResourceType_returnsPage() {
        String[] resourceTypes = new String[] { "other/type", TEST_RESOURCE_TYPE };
        when(valueMap.containsKey(ResourceResolver.PROPERTY_RESOURCE_TYPE)).thenReturn(true);
        when(valueMap.get(eq(ResourceResolver.PROPERTY_RESOURCE_TYPE), anyString()))
                .thenReturn("not-matching")
                .thenReturn(TEST_RESOURCE_TYPE);

        Page result = categoryFinder.getGroupPage(resourceTypes, page);

        assertSame(page, result);
        verify(valueMap, times(2)).get(eq(ResourceResolver.PROPERTY_RESOURCE_TYPE), anyString());
    }

    @Test
    void getGroupPageWithArray_withNoMatchingResourceType_returnsNull() {
        String[] resourceTypes = new String[] { "other/type", "another/type" };
        when(valueMap.containsKey(ResourceResolver.PROPERTY_RESOURCE_TYPE)).thenReturn(true);
        when(valueMap.get(eq(ResourceResolver.PROPERTY_RESOURCE_TYPE), anyString())).thenReturn("different/type");
        when(page.getParent()).thenReturn(null);
        Page result = categoryFinder.getGroupPage(resourceTypes, page);
        assertNull(result);
    }

    @Test
    void executeQuery_withValidSession_returnsSearchResult() {
        Map<String, String> predicatesMap = new HashMap<>();
        predicatesMap.put("path", "/content/test");
        predicatesMap.put("type", "cq:Page");

        when(queryBuilder.createQuery(any(PredicateGroup.class), eq(session))).thenReturn(query);
        when(query.getResult()).thenReturn(searchResult);

        SearchResult result = categoryFinder.executeQuery(predicatesMap, session);

        assertSame(searchResult, result);
        verify(queryBuilder).createQuery(any(PredicateGroup.class), eq(session));
        verify(query).getResult();
    }

    @Test
    void executeQuery_withNullSession_returnsNull() {
        Map<String, String> predicatesMap = new HashMap<>();
        SearchResult result = categoryFinder.executeQuery(predicatesMap, (Session) null);

        assertNull(result);
        verify(queryBuilder, never()).createQuery(any(), any());
    }

    @Test
    void executeQueryWithResourceResolver_withValidResolver_returnsSearchResult() {
        Map<String, String> predicatesMap = new HashMap<>();
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(queryBuilder.createQuery(any(PredicateGroup.class), eq(session))).thenReturn(query);
        when(query.getResult()).thenReturn(searchResult);
        SearchResult result = categoryFinder.executeQuery(predicatesMap, resourceResolver);

        assertSame(searchResult, result);
        verify(resourceResolver).adaptTo(Session.class);
    }

    @Test
    void executeQueryWithResourceResolver_withNullSession_returnsNull() {
        Map<String, String> predicatesMap = new HashMap<>();
        when(resourceResolver.adaptTo(Session.class)).thenReturn(null);
        SearchResult result = categoryFinder.executeQuery(predicatesMap, resourceResolver);
        assertNull(result);
        verify(queryBuilder, never()).createQuery(any(), any());
    }
}
