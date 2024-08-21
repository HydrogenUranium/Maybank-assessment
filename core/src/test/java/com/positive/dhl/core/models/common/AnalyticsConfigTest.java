package com.positive.dhl.core.models.common;

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
    void setUp() throws Exception {
        context.load().json("/com/positive/dhl/core/models/common/AnalyticsConfig/content.json", "/content");
    }

    @Test
    void test() {
        Resource resource = context.resourceResolver().getResource("/content/cta_banner/analytics");

        AnalyticsConfig config = resource.adaptTo(AnalyticsConfig.class);
        config.setEnable(true);

        assertNotNull(config);
        assertEquals("SUBSCRIBE TO OUR NEWSLETTER", config.getName());
        assertEquals("position", config.getPosition());
        assertEquals("component", config.getType());
        assertEquals("content", config.getInteractionType());
        assertEquals("basic", config.getTrackedInteractions());
        assertEquals(Map.of("topic", "subscription"), config.getCustomAttributes());
        assertEquals("{\"content\":{\"attributes\":{\"topic\":\"subscription\"},\"name\":\"SUBSCRIBE TO OUR NEWSLETTER\",\"type\":\"component\",\"interaction\":\"Click\",\"position\":\"position\"},\"trackedInteractions\":\"basic\",\"interactionType\":\"dhl_utf_contentInteraction\"}", config.getJson());
    }
}