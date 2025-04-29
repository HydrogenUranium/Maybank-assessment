package com.dhl.discover.core.models.common;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class AnalyticsConfigTest {
    private final AemContext context = new AemContext();

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(AnalyticsConfig.class);
        context.load().json("/com/dhl/discover/core/models/common/AnalyticsConfig/content.json", "/content");
    }

    @Test
    void testContent() {
        Resource resource = context.resourceResolver().getResource("/content/cta_banner/analytics");

        AnalyticsConfig config = resource.adaptTo(AnalyticsConfig.class);

        assertNotNull(config);
        assertEquals("SUBSCRIBE TO OUR NEWSLETTER", config.getName());
        assertEquals("position", config.getPosition());
        assertEquals("component", config.getType());
        assertEquals("content", config.getInteractionType());
        assertEquals("basic", config.getTrackedInteractions());
        assertEquals(Map.of("topic", "subscription"), config.getCustomAttributes());
        assertEquals("{\"trackedInteractions\":\"basic\",\"interactionType\":\"dhl_utf_contentInteraction\",\"content\":{\"name\":\"SUBSCRIBE TO OUR NEWSLETTER\",\"type\":\"component\",\"interaction\":\"Click\",\"position\":\"position\",\"attributes\":{\"topic\":\"subscription\"}}}"
                , config.getJson());
    }

    @Test
    void testConversion() {
        Resource resource = context.resourceResolver().getResource("/content/form/analytics");

        AnalyticsConfig config = resource.adaptTo(AnalyticsConfig.class);

        assertNotNull(config);
        assertEquals("{\"trackedInteractions\":\"basic\",\"interactionType\":\"dhl_utf_conversionInteraction\",\"conversion\":{\"name\":\"SUBSCRIBE TO OUR NEWSLETTER\",\"type\":\"Lead\",\"detail\":\"form submission\"},\"content\":{\"name\":\"SUBSCRIBE TO OUR NEWSLETTER\",\"type\":\"component\",\"interaction\":\"Click\",\"position\":\"position\",\"attributes\":{\"topic\":\"subscription\"}}}"
                , config.getJson());
    }
}