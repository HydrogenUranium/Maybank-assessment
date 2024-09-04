package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.components.Component;
import com.positive.dhl.core.injectors.HomePropertyInjector;
import com.positive.dhl.core.models.common.AnalyticsConfig;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.spi.Injector;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.positive.dhl.junitUtils.InjectorMock.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CtaBannerTest {
    private final static String COMPONENT_LOCATION = "/content/home/small-business-advice/article/jcr:content/root/article_container/body/responsivegrid";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private PageUtilService pageUtils;

    @Mock
    private Component component;

    @InjectMocks
    private HomePropertyInjector homePropertyInjector;

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/positive/dhl/core/models/CtaBanner/content.json", "/content");
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(Injector.class, homePropertyInjector);
        context.addModelsForClasses(AnalyticsConfig.class);
    }

    private void mockHomePage() {
        when(pageUtils.getHomePage(any(Page.class))).thenReturn(resourceResolver.getResource("/content/home").adaptTo(Page.class));
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void init_ShouldInitPropertiesFromHomePage_WhenTypeIsSubscribe() {
        initRequest(COMPONENT_LOCATION + "/cta_banner_subscribeNewsletter");
        mockHomePage();

        CtaBanner ctaBanner = request.adaptTo(CtaBanner.class);

        assertNotNull(ctaBanner);
        assertEquals("Subscribe To Our Newsletter", ctaBanner.getTitle());
        assertEquals("Stay In The Loop!", ctaBanner.getTopTitle());
        assertEquals("/content/dhl/openBusinessAccount", ctaBanner.getButtonLink());
        assertEquals("Subscribe", ctaBanner.getButtonName());
        assertEquals("/content/dam/images/desktop.jpg", ctaBanner.getDesktopBackgroundImage());
        assertEquals("/content/dam/images/tablet.jpg", ctaBanner.getTabletBackgroundImage());
        assertEquals("/content/dam/images/mobile.jpg", ctaBanner.getMobileBackgroundImage());
        assertNull(ctaBanner.getAnalyticsConfigJson());
        assertTrue(ctaBanner.isDisabled());
    }

    @Test
    void init_ShouldInitPropertiesFromHomePage_WhenTypeIsCustom() {
        when(component.getName()).thenReturn("CTA Banner");
        Resource resource = context.resourceResolver().getResource(COMPONENT_LOCATION + "/cta_banner_custom");
        mockInjectHomeProperty(context, "eventTrackingComponents-enableAnalytics", true);
        mockInject(context, INJECT_SCRIPT_BINDINGS, "component", component);

        CtaBanner ctaBanner = resource.adaptTo(CtaBanner.class);

        assertNotNull(ctaBanner);
        assertEquals("CTA BANNER", ctaBanner.getTitle());
        assertEquals("Custom Top Title", ctaBanner.getTopTitle());
        assertEquals("/content/test", ctaBanner.getButtonLink());
        assertEquals("Buy", ctaBanner.getButtonName());
        assertEquals("/content/dam/images/desktop.jpg", ctaBanner.getDesktopBackgroundImage());
        assertEquals("/content/dam/images/tablet.jpg", ctaBanner.getTabletBackgroundImage());
        assertEquals("/content/dam/images/mobile.jpg", ctaBanner.getMobileBackgroundImage());
        assertEquals("{\"content\":{\"attributes\":{\"topic\":\"subscription\"},\"name\":\"SUBSCRIBE TO OUR NEWSLETTER\",\"type\":\"CTA Banner\",\"interaction\":\"Click\",\"position\":\"position\"},\"trackedInteractions\":\"basic\",\"interactionType\":\"dhl_utf_contentInteraction\"}", ctaBanner.getAnalyticsConfigJson());
    }
}