package com.positive.dhl.core.utils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import javax.jcr.Session;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(AemContextExtension.class)
class RequestUtilsTest {

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @Test
    void testGetUrlPrefix_http() {
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        when(request.getScheme()).thenReturn("http");
        when(request.getServerName()).thenReturn("www.example.com");
        when(request.getServerPort()).thenReturn(8080);
        when(request.getContextPath()).thenReturn("/content/example");

        String urlPrefix = RequestUtils.getUrlPrefix(request);
        assertEquals("http://www.example.com:8080/content/example", urlPrefix);
    }

    @Test
    void testGetUrlPrefix_https() {
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        when(request.getScheme()).thenReturn("https");
        when(request.getServerName()).thenReturn("www.example.com");
        when(request.getServerPort()).thenReturn(443);
        when(request.getContextPath()).thenReturn("/content/example");

        String urlPrefix = RequestUtils.getUrlPrefix(request);
        assertEquals("https://www.example.com/content/example", urlPrefix);
    }

    @Test
    void testGetUrlPrefix_defaultPort() {
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        when(request.getScheme()).thenReturn("http");
        when(request.getServerName()).thenReturn("www.example.com");
        when(request.getServerPort()).thenReturn(80);
        when(request.getContextPath()).thenReturn("/content/example");

        String urlPrefix = RequestUtils.getUrlPrefix(request);
        assertEquals("http://www.example.com/content/example", urlPrefix);
    }

    @Test
    void testGetResource() {
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        Resource resource = context.create().resource("/content/example");

        when(request.getResourceResolver()).thenReturn(resourceResolver);
        when(request.getPathInfo()).thenReturn("/content/example");
        when(resourceResolver.resolve("/content/example")).thenReturn(resource);

        Resource resultResource = RequestUtils.getResource(request);
        assertNotNull(resultResource);
        assertEquals("/content/example", resultResource.getPath());
    }

    @Test
    void test_getSession() {
        Session session = RequestUtils.getSession(context.request());

        assertNotNull(session);
    }

    @Test
    void test_getRequestValue() {
        var request = context.request();
        request.setParameterMap(Map.of("parameter", "value"));

        String result = RequestUtils.getRequestValue(request, "parameter");

        assertEquals("value", result);
    }

    @Test
    void test_getRequestValue_WithDefaultValue() {
        var request = context.request();

        String result = RequestUtils.getRequestValue(request, "parameter", "default value");

        assertEquals("default value", result);
    }

}