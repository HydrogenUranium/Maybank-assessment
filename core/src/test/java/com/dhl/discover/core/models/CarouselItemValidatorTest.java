package com.dhl.discover.core.models;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static junit.framework.Assert.assertNull;
import static junit.framework.Assert.assertTrue;
import static junitx.framework.Assert.assertEquals;
import static junitx.framework.Assert.assertFalse;
import static org.mockito.Mockito.when;

class CarouselItemValidatorTest {
    @Mock
    private SlingHttpServletRequest slingRequest;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private Resource resource;

    @InjectMocks
    private CarouselItemValidator carouselItemValidator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        carouselItemValidator.setResourceResolver(resourceResolver);
    }


    @Test
    void testInitWithValidNodePath() {
        when(slingRequest.getAttribute(CarouselItemValidator.PAGE_PATH)).thenReturn("/content/sample/path");
        when(resourceResolver.getResource("/content/sample/path")).thenReturn(resource);
        when(resource.getPath()).thenReturn("/content/sample/path");

        carouselItemValidator.init();

        assertEquals("/content/sample/path", carouselItemValidator.getNodePath());
        assertTrue(carouselItemValidator.isNodeExists());
    }

    @Test
    void testInitWithInvalidNodePath() {
        when(slingRequest.getAttribute(CarouselItemValidator.PAGE_PATH)).thenReturn("/content/invalid/path");
        when(resourceResolver.getResource("/content/invalid/path")).thenReturn(null);

        carouselItemValidator.init();

        assertEquals("/content/invalid/path", carouselItemValidator.getNodePath());
        assertFalse(carouselItemValidator.isNodeExists());
    }

    @Test
    void testInitWithNullNodePath() {
        when(slingRequest.getAttribute(CarouselItemValidator.PAGE_PATH)).thenReturn(null);

        carouselItemValidator.init();

        assertNull(carouselItemValidator.getNodePath());
        assertFalse(carouselItemValidator.isNodeExists());
    }

    @Test
    void testInitWithEmptyNodePath() {
        when(slingRequest.getAttribute(CarouselItemValidator.PAGE_PATH)).thenReturn("");

        carouselItemValidator.init();

        assertEquals("", carouselItemValidator.getNodePath());
        assertFalse(carouselItemValidator.isNodeExists());
    }
}
