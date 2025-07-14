package com.dhl.discover.core.servlets;

import com.dhl.discover.core.services.*;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class GetSuggestionsServletTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();

    @Spy
    @InjectMocks
    private GetSuggestionsServlet servlet;

    @Mock
    private SuggestionsService suggestionService;

    @BeforeEach
    void setUp() {
        context.build().resource("/content");

        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resolverMock);
        when(resolverMock.findResources(anyString(), anyString())).thenAnswer(invocationOnMock ->
                context.resourceResolver().findResources(invocationOnMock.getArgument(0), Query.JCR_SQL2));
    }

    @Test
    void test_withValidRequestParameter() throws IOException {
        String expectedJson = "{\"status\":\"ok\",\"term\":\"global\",\"results\":[\"Global Logistics\",\"Global Business\"]}";

        // This prevents the real method from being called
        try {
            doReturn(expectedJson).when(servlet).processRequest(any(SlingHttpServletRequest.class));
        } catch (RepositoryException e) {
            throw new RuntimeException(e);
        }

        request.setParameterMap(Map.of("s", "global", "homepagepath", "/content"));

        servlet.doGet(request, response);

        String responseBody = context.response().getOutputAsString();
        String expected = "{\"status\":\"ok\",\"term\":\"global\",\"results\":[\"Global Logistics\",\"Global Business\"]}";
        assertEquals(expected, responseBody);
    }

    @Test
    void test_withInvalidRequestParameter() throws IOException {
        request.setParameterMap(Map.of("s", "<XSS-injection>", "homepagepath", "/content"));

        try {
            when(servlet.processRequest(request))
                    .thenReturn("{\"status\":\"ok\",\"term\":\"\",\"results\":[]}");
        } catch (RepositoryException exp) {
            throw new RuntimeException(exp);
        }
        servlet.doGet(request, response);

        String responseBody = context.response().getOutputAsString();

        String expected = "{\"status\":\"ok\",\"term\":\"\",\"results\":[]}";
        assertEquals(expected, responseBody);
    }

    @Test
    void testProcessRequest() throws RepositoryException {
        reset(servlet);
        SlingHttpServletRequest mockRequest = mock(SlingHttpServletRequest.class);
        ResourceResolver mockResolver = mock(ResourceResolver.class);
        RequestPathInfo mockPathInfo = mock(RequestPathInfo.class);

        when(mockRequest.getParameter("s")).thenReturn("test query");
        when(mockRequest.getRequestPathInfo()).thenReturn(mockPathInfo);
        when(mockPathInfo.getResourcePath()).thenReturn("/content/home");
        when(mockRequest.getResourceResolver()).thenReturn(mockResolver);

        when(suggestionService.isValid("test query")).thenReturn("test query");
        when(suggestionService.getSuggestionIndexName("/content/home")).thenReturn("indexName");
        when(suggestionService.collectSuggestions(mockResolver, "test query", "/content/home", "indexName"))
                .thenReturn(new HashSet<>(Arrays.asList("suggestion1", "suggestion2")));

        String result = servlet.processRequest(mockRequest);

        JsonObject jsonResult = new Gson().fromJson(result, JsonObject.class);
        assertEquals("ok", jsonResult.get("status").getAsString());
        assertEquals("test query", jsonResult.get("term").getAsString());

        JsonArray results = jsonResult.getAsJsonArray("results");
        assertEquals(2, results.size());
        assertTrue(results.contains(new JsonPrimitive("suggestion1")));
        assertTrue(results.contains(new JsonPrimitive("suggestion2")));boolean containsSuggestion1 = false;
        boolean containsSuggestion2 = false;
        for (int i = 0; i < results.size(); i++) {
            String value = results.get(i).getAsString();
            if ("suggestion1".equals(value)) containsSuggestion1 = true;
            if ("suggestion2".equals(value)) containsSuggestion2 = true;
        }
        assertTrue(containsSuggestion1, "Results should contain 'suggestion1'");
        assertTrue(containsSuggestion2, "Results should contain 'suggestion2'");

        // Verify interactions
        verify(suggestionService).isValid("test query");
        verify(suggestionService).getSuggestionIndexName("/content/home");
        verify(suggestionService).collectSuggestions(mockResolver, "test query", "/content/home", "indexName");
    }

    @Test
    void testDoGet_withRepositoryException() throws IOException, RepositoryException {
        doThrow(new RepositoryException("Test repository error"))
                .when(servlet).processRequest(any(SlingHttpServletRequest.class));

        request.setParameterMap(Map.of("s", "query", "homepagepath", "/content"));

        servlet.doGet(request, response);

        String responseBody = context.response().getOutputAsString();
        String expected = "{ \"results\": [], \"status\": \"ko\", \"error\": \"Repository Exception\" }";

        assertEquals(
                expected.replaceAll("\\s+", ""),
                responseBody.replaceAll("\\s+", "")
        );

        verify(servlet).processRequest(any(SlingHttpServletRequest.class));
    }

}