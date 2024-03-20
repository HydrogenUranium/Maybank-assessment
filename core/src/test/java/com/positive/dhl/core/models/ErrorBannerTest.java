package com.positive.dhl.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ErrorBannerTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/positive/dhl/core/models/ErrorBanner/content.json", "/content/home/errorPage/jcr:content");
        context.addModelsForClasses(ErrorBanner.class);
    }

    @Test
    void init_ShouldInitPropertiesFromHomePage_WhenTypeIsPredefined() {
        Resource resource = resourceResolver.getResource("/content/home/errorPage/jcr:content" + "/error_banner");

        ErrorBanner errorBanner = resource.adaptTo(ErrorBanner.class);

        assertNotNull(errorBanner);
        assertEquals("title", errorBanner.getTitle());
        assertEquals("description", errorBanner.getDescription());
        assertEquals("buttonLink", errorBanner.getButtonLink());
        assertEquals("buttonLabel", errorBanner.getButtonLabel());
        assertEquals("/image.png", errorBanner.getImage());
        assertEquals("altText", errorBanner.getAltText());
    }

}