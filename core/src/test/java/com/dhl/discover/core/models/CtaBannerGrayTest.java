package com.dhl.discover.core.models;

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
class CtaBannerGrayTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/dhl/discover/core/models/CtaBannerGray/content.json", "/content/home/article/jcr:content");
        context.addModelsForClasses(CtaBannerGray.class);
    }

    @Test
    void init_ShouldInitPropertiesFromPageProperties_WhenTypeIsCustom() {
        Resource resource = resourceResolver.getResource("/content/home/article/jcr:content" + "/cta_banner_gray_custom");

        CtaBannerGray ctaBanner = resource.adaptTo(CtaBannerGray.class);

        assertNotNull(ctaBanner);
        assertEquals("Are you an individual shipper?", ctaBanner.getTitle());
        assertEquals("Ship today without a DHL Express Business Account.", ctaBanner.getDescription());
        assertEquals("/my/dhl", ctaBanner.getButtonLink());
        assertEquals("Take me to MyDHL+", ctaBanner.getButtonLabel());
        assertEquals("_self", ctaBanner.getLinkTarget());
    }
}