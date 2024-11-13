package com.dhl.discover.core.servlets;

import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.core.services.TagUtilService;
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
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.query.Query;
import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class GetSuggestionsServletTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();
    private final ResourceResolver resolver = context.resourceResolver();

    @InjectMocks
    private GetSuggestionsServlet servlet;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @Mock
    private ResourceResolver resolverMock;

    @BeforeEach
    void setUp() {
        lenient().when(tagUtilService.getTagLocalizedSuggestionsByQuery(any(), anyString(), anyString(), any(), anyInt()))
                .thenReturn(List.of("Global Logistics", "Global Business"));
        context.build().resource("/content");
        lenient().when(pageUtilService.getLocale((Resource) any())).thenReturn(Locale.ENGLISH);

        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resolverMock);
        when(resolverMock.findResources(anyString(), anyString())).thenAnswer(invocationOnMock ->
                resolver.findResources(invocationOnMock.getArgument(0), Query.JCR_SQL2));
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

        servlet.doGet(request, response);

        String responseBody = context.response().getOutputAsString();

        String expected = "{\"status\":\"ok\",\"term\":\"\",\"results\":[]}";
        assertEquals(expected, responseBody);
    }
}