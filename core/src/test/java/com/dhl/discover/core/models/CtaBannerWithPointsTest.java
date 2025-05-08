package com.dhl.discover.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;

import org.apache.sling.testing.mock.sling.ResourceResolverType;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CtaBannerWithPointsTest {
    private final static String COMPONENT_LOCATION = "/content/home/small-business-advice/article/jcr:content/root/article_container/body/responsivegrid";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);
    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/dhl/discover/core/models/CtaBannerWithPoints/content.json", "/content");
        context.addModelsForClasses(CtaBannerWithPoints.class);
    }

    @Test
    void init_ShouldInitPropertiesFromHomePage_WhenTypeIsCustom() {
        Resource resource = context.resourceResolver().getResource(COMPONENT_LOCATION + "/cta_banner_custom");

        CtaBannerWithPoints ctaBannerWithPoints = resource.adaptTo(CtaBannerWithPoints.class);

        assertEquals("CTA BANNER", ctaBannerWithPoints.getTitle());
        assertEquals("/content/test", ctaBannerWithPoints.getButtonLink());
        assertEquals("Buy", ctaBannerWithPoints.getButtonName());
        assertEquals("/content/dam/images/desktop.jpg", ctaBannerWithPoints.getDesktopBackgroundImage());
        assertEquals("/content/dam/images/tablet.jpg", ctaBannerWithPoints.getTabletBackgroundImage());
        assertEquals("/content/dam/images/mobile.jpg", ctaBannerWithPoints.getMobileBackgroundImage());
        assertEquals(new ArrayList<>(), ctaBannerWithPoints.getPoints());
    }
}