package com.dhl.discover.core.servlets;

import com.dhl.discover.core.services.*;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
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
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class GetSuggestionsServletTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();
    private final ResourceResolver resolver = context.resourceResolver();

    @Spy
    @InjectMocks
    private GetSuggestionsServlet servlet;

    @Mock
    private SuggestionsService suggestionService;

    @BeforeEach
    void setUp() {
        context.build().resource("/content");
        try {
            doReturn("{\"status\":\"ok\",\"term\":\"global\",\"results\":[\"Global Logistics\",\"Global Business\"]}")
                    .when(servlet).processRequest(any(SlingHttpServletRequest.class));
        } catch (RepositoryException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void test_withValidRequestParameter() throws IOException {
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

}