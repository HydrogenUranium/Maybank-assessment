package com.dhl.discover.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;

import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.mock.sling.ResourceResolverType;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static junit.framework.Assert.assertNotNull;
import static junit.framework.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CtaBannerWithPointsTest {
    private static final  String COMPONENT_LOCATION = "/content/home/small-business-advice/article/jcr:content/root/article_container/body/responsivegrid";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    CtaBannerWithPoints model = new CtaBannerWithPoints();
    @BeforeEach
    void setUp() {
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

    @Test
    void init_ShouldExtractPointsFromMultifield_WhenPointsArePresent() {
        Resource resource = context.resourceResolver().getResource(COMPONENT_LOCATION + "/cta_banner_custom");
        CtaBannerWithPoints ctaBannerWithPoints = resource.adaptTo(CtaBannerWithPoints.class);

        List<String> points = ctaBannerWithPoints.getPoints();

        assertEquals("CTA BANNER", ctaBannerWithPoints.getTitle());
        assertEquals("/content/dam/images/desktop.jpg", ctaBannerWithPoints.getDesktopBackgroundImage());
        assertEquals("/content/dam/images/tablet.jpg", ctaBannerWithPoints.getTabletBackgroundImage());
        assertEquals("/content/dam/images/mobile.jpg", ctaBannerWithPoints.getMobileBackgroundImage());
        assertEquals("Buy", ctaBannerWithPoints.getButtonName());
        assertEquals("/content/test", ctaBannerWithPoints.getButtonLink());
        assertEquals(0, points.size());
    }
    @Test
    void extractPoints_ShouldReturnEmptyList_WhenPointsMultifieldIsNull() {
        Resource resource = context.resourceResolver().getResource(COMPONENT_LOCATION + "/cta_banner_businessAccount");
        CtaBannerWithPoints ctaBannerWithPoints = resource.adaptTo(CtaBannerWithPoints.class);
        List<String> points = ctaBannerWithPoints.getPoints();
        assertNotNull(points);
        assertTrue(points.isEmpty());
    }

    @Test
    void extractPoints_ShouldReturnPointsList_WhenPointsMultifieldPresent() {
        Resource child1 = Mockito.mock(Resource.class);
        ValueMap vm1 = Mockito.mock(ValueMap.class);
        Mockito.when(child1.getValueMap()).thenReturn(vm1);
        Mockito.when(vm1.get("text", "")).thenReturn("Point 1");

        Resource child2 = Mockito.mock(Resource.class);
        ValueMap vm2 = Mockito.mock(ValueMap.class);
        Mockito.when(child2.getValueMap()).thenReturn(vm2);
        Mockito.when(vm2.get("text", "")).thenReturn("Point 2");

        Resource pointsMultifield = Mockito.mock(Resource.class);
        Iterator<Resource> iterator = new ArrayList<>(List.of(child1, child2)).iterator();
        Mockito.when(pointsMultifield.listChildren()).thenReturn(iterator);

        List<String> result = model.extractPoints(pointsMultifield);

        assertEquals(2, result.size());
        assertEquals("Point 1", result.get(0));
        assertEquals("Point 2", result.get(1));
    }

}