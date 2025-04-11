package com.dhl.discover.core.models;

import com.day.cq.wcm.api.components.Component;
import com.dhl.discover.core.models.common.AnalyticsConfig;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.dhl.discover.junitUtils.InjectorMock.*;
import static junit.framework.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TrackableComponentTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private Component component;

    @BeforeEach
    void setUp() throws Throwable {
        context.load().json("/com/dhl/discover/core/models/TrackableComponent/content.json", "/content");
        context.addModelsForClasses(AnalyticsConfig.class);
        context.addModelsForClasses(TrackableComponent.class);
    }

    @Test
    void test() {
        when(component.getName()).thenReturn("CTA Banner");
        mockInject(context, INJECT_SCRIPT_BINDINGS, "component", component);

        TrackableComponent trackableComponent = context.resourceResolver().getResource("/content/banner")
                .adaptTo(TrackableComponent.class);
        trackableComponent.getAnalytics().getCustomAttributes().put("topic", "subscription");

        assertEquals("{\"trackedInteractions\":\"basic\",\"interactionType\":\"dhl_utf_contentInteraction\",\"content\":{\"name\":\"SUBSCRIBE TO OUR NEWSLETTER\",\"type\":\"CTA Banner\",\"interaction\":\"Click\",\"position\":\"position\",\"attributes\":{\"topic\":\"subscription\"}}}", trackableComponent.getJson());
    }

    @Test
    void testEmptyConfig() {
        mockInject(context, INJECT_SCRIPT_BINDINGS, "component", component);

        TrackableComponent trackableComponent = context.resourceResolver().getResource("/content/banner-without-tracking")
                .adaptTo(TrackableComponent.class);

        assertNull(trackableComponent.getJson());
    }
}
