package com.dhl.discover.google.servlets;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class GoogleAdsSupportServletTest {

    private final AemContext context = new AemContext();
    private GoogleAdsSupportServlet servlet;

    @BeforeEach
    void setUp() {
        servlet = context.registerInjectActivateService(new GoogleAdsSupportServlet());
    }

    @Test
    void testDoPostSuccess() throws Exception {
        context.create().resource("/content/settings/cloudconfigs/google-ads", "jcr:primaryType", "sling:Folder");
        context.create().resource("/apps/templates/google-ads-template", "jcr:primaryType", "cq:Template");
        context.request().setParameterMap(Map.of(
                "configPath", "/content",
                "name", "google-ads-config",
                "template", "/apps/templates/google-ads-template",
                "title", "Google Ads Config"
        ));

        servlet.doPost(context.request(), context.response());

        assertEquals(SlingHttpServletResponse.SC_OK, context.response().getStatus());
        String jsonResponse = context.response().getOutputAsString();
        assertTrue(jsonResponse.contains("\"href\":"));
        assertTrue(jsonResponse.contains("/mnt/overlay/wcm/core/content/sites/properties.html?item=/content/settings/cloudconfigs/google-ads/google-ads-config"));
    }

    @Test
    void testDoPostMissingParameter() throws Exception {
        context.request().setParameterMap(Map.of(
                "configPath", "/content",
                "name", "",
                "template", "/apps/templates/google-ads-template",
                "title", "Google Ads Config"
        ));

        servlet.doPost(context.request(), context.response());

        assertEquals(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR, context.response().getStatus());
        String jsonResponse = context.response().getOutputAsString();
        assertTrue(jsonResponse.contains("""
                "message": "Failed to create cloud config: Parameter name must not be blank"
            """));
    }
}