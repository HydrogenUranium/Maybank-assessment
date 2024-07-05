package com.positive.dhl.core.utils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.Workspace;
import javax.jcr.query.*;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class QueryManagerUtilsTest {
    private final AemContext context = new AemContext();

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private Session session;

    @Mock
    private Workspace workspace;

    @Mock
    private QueryManager queryManager;

    @Mock
    private Query query;

    @Mock
    private RowIterator rowIterator;

    @Mock
    private QueryResult queryResult;

    @Mock
    private Row row;

    @Test
    void testGetQueryManagerFromRequest() throws RepositoryException {
        when(request.getResourceResolver()).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getWorkspace()).thenReturn(workspace);
        when(workspace.getQueryManager()).thenReturn(queryManager);

        QueryManager result = QueryManagerUtils.getQueryManager(request);
        assertEquals(queryManager, result);
    }

    @Test
    void testGetQueryManagerFromResolver() throws RepositoryException {
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getWorkspace()).thenReturn(workspace);
        when(workspace.getQueryManager()).thenReturn(queryManager);

        QueryManager result = QueryManagerUtils.getQueryManager(resourceResolver);
        assertEquals(queryManager, result);
    }

    @Test
    void testGetQueryManagerFromSession() throws RepositoryException {
        when(session.getWorkspace()).thenReturn(workspace);
        when(workspace.getQueryManager()).thenReturn(queryManager);

        QueryManager result = QueryManagerUtils.getQueryManager(session);
        assertEquals(queryManager, result);
    }

    @Test
    void testGetQueryManagerFromNullSession() throws RepositoryException {
        QueryManager result = QueryManagerUtils.getQueryManager((Session) null);
        assertNull(result);
    }

    @Test
    void testGetSuggestedWords() throws RepositoryException {
        String searchString = "cos";
        String mode = "suggest";
        String indexName = "testIndex";
        List<String> expected = List.of("cost", "cosmetic");

        when(queryManager.createQuery(anyString(), eq(Query.JCR_SQL2))).thenReturn(query);
        when(query.execute()).thenReturn(queryResult);
        when(queryResult.getRows()).thenReturn(rowIterator);
        when(rowIterator.hasNext()).thenReturn(true, true, false);
        when(rowIterator.next()).thenReturn(row);
        when(row.getValue("rep:suggest()")).thenReturn(mock(Value.class));
        when(row.getValue("rep:suggest()").getString()).thenReturn("cost", "cosmetic");

        List<String> result = QueryManagerUtils.getSuggestedWords(searchString, mode, indexName, queryManager);
        assertEquals(expected, result);
    }

    @Test
    void testGetSpellcheckedWords() throws RepositoryException {
        String searchString = "loko";
        String indexName = "testIndex";
        List<String> expected = List.of("logo", "look");

        when(queryManager.createQuery(anyString(), eq(Query.JCR_SQL2))).thenReturn(query);
        when(query.execute()).thenReturn(queryResult);
        when(queryResult.getRows()).thenReturn(rowIterator);
        when(rowIterator.hasNext()).thenReturn(true, true, false);
        when(rowIterator.next()).thenReturn(row);
        when(row.getValue("rep:spellcheck()")).thenReturn(mock(Value.class));
        when(row.getValue("rep:spellcheck()").getString()).thenReturn("logo", "look");

        List<String> result = QueryManagerUtils.getSpellcheckedWords(searchString, indexName, queryManager);
        assertEquals(expected, result);
    }
}