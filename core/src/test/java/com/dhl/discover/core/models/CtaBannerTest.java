package com.dhl.discover.core.models;


import com.dhl.discover.core.injectors.HomePropertyInjector;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
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

import static org.junit.jupiter.api.Assertions.*;

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

    @InjectMocks
    private HomePropertyInjector homePropertyInjector;

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/dhl/discover/core/models/CtaBanner/content.json", "/content");
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(Injector.class, homePropertyInjector);
    }

    @Test
    void init_ShouldInitPropertiesFromHomePage_WhenTypeIsCustom() {
        Resource resource = context.resourceResolver().getResource(COMPONENT_LOCATION + "/cta_banner_custom");

        CtaBanner ctaBanner = resource.adaptTo(CtaBanner.class);

        assertNotNull(ctaBanner);
        assertEquals("CTA BANNER", ctaBanner.getTitle());
        assertEquals("Custom Top Title", ctaBanner.getTopTitle());
        assertEquals("/content/test", ctaBanner.getButtonLink());
        assertEquals("Buy", ctaBanner.getButtonName());
        assertEquals("/content/dam/images/desktop.jpg", ctaBanner.getDesktopBackgroundImage());
        assertEquals("/content/dam/images/tablet.jpg", ctaBanner.getTabletBackgroundImage());
        assertEquals("/content/dam/images/mobile.jpg", ctaBanner.getMobileBackgroundImage());
    }
}