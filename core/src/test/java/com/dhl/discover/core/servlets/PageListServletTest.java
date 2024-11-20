package com.dhl.discover.core.servlets;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.google.gson.JsonArray;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Session;
import javax.servlet.http.HttpServletResponse;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PageListServletTest {

    private final AemContext context = new AemContext();

    @Mock
    private ResourceResolverFactory resolverFactory;

    @InjectMocks
    private PageListServlet servlet;

    private MockSlingHttpServletRequest request;
    private MockSlingHttpServletResponse response;

    @Mock
    private ResourceResolver resolver;

    @Mock
    private QueryBuilder queryBuilder;

    @Mock
    private Query query;

    @Mock
    private SearchResult searchResult;

    @Mock
    private Hit hit;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request = context.request();
        response = context.response();
    }

    @Test
    void testDoGet_Success() throws Exception {
        when(resolverFactory.getServiceResourceResolver(any())).thenReturn(resolver);
        when(resolver.adaptTo(QueryBuilder.class)).thenReturn(queryBuilder);
        when(resolver.adaptTo(Session.class)).thenReturn(mock(Session.class));
        when(queryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(query);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getHits()).thenReturn(Collections.singletonList(hit));
        when(hit.getPath()).thenReturn("/content/dhl/sample-page");

        servlet.doGet(request, response);

        assertEquals("application/json", response.getContentType());
        JsonArray expectedJsonArray = new JsonArray();
        expectedJsonArray.add("/content/dhl/sample-page");
        assertEquals(expectedJsonArray.toString(), response.getOutputAsString());
    }

    @Test
    void testDoGet_GeneralException() throws Exception {
        when(resolverFactory.getServiceResourceResolver(any())).thenReturn(resolver);
        when(resolver.adaptTo(QueryBuilder.class)).thenReturn(queryBuilder);
        when(queryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenThrow(new RuntimeException("General error"));

        servlet.doGet(request, response);

        assertEquals(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, response.getStatus());
    }
}
