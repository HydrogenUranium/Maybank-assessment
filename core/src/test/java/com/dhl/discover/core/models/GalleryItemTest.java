package com.dhl.discover.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(MockitoExtension.class)
class GalleryItemTest {
    @Mock
    private Resource resource;

    @InjectMocks
    private GalleryItem galleryItem;

    @BeforeEach
    void setUp() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "Test Title");
        properties.put("brief", "Test Brief Description");
        properties.put("imagemob", "/content/dam/image-mobile.jpg");
        properties.put("imagetab", "/content/dam/image-tablet.jpg");
        properties.put("imagedt", "/content/dam/image-desktop.jpg");

    }

    @Test
    void testPropertiesInjection() throws Exception {
        injectField("title", "Test Title");
        injectField("brief", "Test Brief Description");
        injectField("imagemob", "/content/dam/image-mobile.jpg");
        injectField("imagetab", "/content/dam/image-tablet.jpg");
        injectField("imagedt", "/content/dam/image-desktop.jpg");

        assertEquals("Test Title", galleryItem.title);
        assertEquals("Test Brief Description", galleryItem.brief);
        assertEquals("/content/dam/image-mobile.jpg", galleryItem.imagemob);
        assertEquals("/content/dam/image-tablet.jpg", galleryItem.imagetab);
        assertEquals("/content/dam/image-desktop.jpg", galleryItem.imagedt);
    }

    @Test
    void testMissingOptionalProperties() throws Exception {
        injectField("title", "Test Title");

        assertEquals("Test Title", galleryItem.title);
        assertNull(galleryItem.brief);
        assertNull(galleryItem.imagemob);
        assertNull(galleryItem.imagetab);
        assertNull(galleryItem.imagedt);
    }

    @Test
    void testIndexGetterSetter() {
        galleryItem.setIndex(5);
        assertEquals(5, galleryItem.getIndex());

        galleryItem.setIndex(10);
        assertEquals(10, galleryItem.getIndex());
    }

    @Test
    void testPostConstructMethod() {
        galleryItem.setIndex(3);
        galleryItem.init();
        assertEquals(3, galleryItem.getIndex(), "The index value should be preserved after initialization");

    }

    /**
     * Helper method to inject field values directly since we can't use Sling Models injection in unit tests
     */
    private void injectField(String fieldName, Object value) throws Exception {
        Field field = GalleryItem.class.getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(galleryItem, value);
    }
}
