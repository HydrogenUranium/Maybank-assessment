package com.positive.dhl.core.models;

import com.day.cq.wcm.api.components.Component;
import com.positive.dhl.core.models.common.AnalyticsConfig;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.positive.dhl.junitUtils.InjectorMock.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TrackableComponentTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private Component component;

    @BeforeEach
    void setUp() throws Throwable {
        context.load().json("/com/positive/dhl/core/models/TrackableComponent/content.json", "/content");
        context.addModelsForClasses(AnalyticsConfig.class);
        context.addModelsForClasses(TrackableComponent.class);
    }

    @Test
    void test() {
        when(component.getName()).thenReturn("CTA Banner");
        mockInjectHomeProperty(context, "eventTrackingComponents-enableAnalytics", true);
        mockInject(context, INJECT_SCRIPT_BINDINGS, "component", component);

        TrackableComponent trackableComponent = context.resourceResolver().getResource("/content/banner").adaptTo(TrackableComponent.class);
        trackableComponent.getAnalytics().getCustomAttributes().put("topic", "subscription");

        assertEquals("{\"content\":{\"attributes\":{\"topic\":\"subscription\"},\"name\":\"SUBSCRIBE TO OUR NEWSLETTER\",\"type\":\"CTA Banner\",\"interaction\":\"Click\",\"position\":\"position\"},\"trackedInteractions\":\"basic\",\"interactionType\":\"dhl_utf_contentInteraction\"}", trackableComponent.getJson());
    }
}
