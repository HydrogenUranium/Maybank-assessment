package com.dhl.discover.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static com.dhl.discover.junitUtils.InjectorMock.mockInjectHomeProperty;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LandingPointsTest {
    private final AemContext aemContext = new AemContext();

    @BeforeEach
    void setUp() {
        aemContext.load().json("/com/dhl/discover/core/models/LandingPoints/content.json", "/content/dhl/open-account/jcr:content/root/responsivegrid/");
        aemContext.addModelsForClasses(LandingPoints.class);
        aemContext.addModelsForClasses(LandingPointItem.class);
    }

    @Test
    void getLandingPointItems() {
        mockInjectHomeProperty(aemContext, "landingPoints-defaultIcon", "/defaultIcon.png");

        LandingPoints landingPoints = aemContext.resourceResolver().getResource("/content/dhl/open-account/jcr:content/root/responsivegrid/landingPoints")
                .adaptTo(LandingPoints.class);

        assertNotNull(landingPoints);
        assertEquals(3, landingPoints.getLandingPointItems().size());
        List<LandingPointItem> points = landingPoints.getLandingPointItems();
        LandingPointItem point = points.get(0);
        assertEquals("/content/dam/images/icon.svg", point.getIcon());
        assertEquals("<p>A wide range of services and door-to-door shipping options to solve your international export challenges, covering 220 countries across the globe</p>", point.getContent());
        assertEquals("Easy international shipping", point.getTitle());
        assertEquals("/content/dam/images/image.svg", landingPoints.getImage());
        assertEquals("/defaultIcon.png", landingPoints.getDefaultIcon());
        assertEquals("alt text", landingPoints.getAltText());
        assertEquals("icon", landingPoints.getPointType());
    }

}