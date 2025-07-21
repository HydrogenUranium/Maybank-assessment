package com.dhl.discover.core.models;


import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class GalleryTest {
    @Mock
    private Resource resource;

    @Mock
    private Resource slidesResource;

    @Mock
    private Resource slideResource1;

    @Mock
    private Resource slideResource2;

    @Mock
    private GalleryItem galleryItem1;

    @Mock
    private GalleryItem galleryItem2;

    private Gallery gallery;

    @BeforeEach
    void setUp() {
        gallery = new Gallery();

        // Set up slidesResource field using reflection
        try {
            java.lang.reflect.Field field = Gallery.class.getDeclaredField("slidesResource");
            field.setAccessible(true);
            field.set(gallery, slidesResource);
        } catch (Exception e) {
            fail("Failed to set up test: " + e.getMessage());
        }
    }

    @Test
    void testInitWithNoSlidesResource() {
        // Set slidesResource to null
        try {
            java.lang.reflect.Field field = Gallery.class.getDeclaredField("slidesResource");
            field.setAccessible(true);
            field.set(gallery, null);
        } catch (Exception e) {
            fail("Failed to set up test: " + e.getMessage());
        }

        // Initialize the gallery
        gallery.init();

        // Verify that slides is an empty list (not null)
        assertNotNull(gallery.getSlides());
        assertTrue(gallery.getSlides().isEmpty());
    }

    @Test
    void testInitWithSlidesResource() {
        // Set up mock behavior
        List<Resource> childResources = Arrays.asList(slideResource1, slideResource2);
        Iterator<Resource> resourceIterator = childResources.iterator();
        when(slidesResource.listChildren()).thenReturn(resourceIterator);
        when(slideResource1.adaptTo(GalleryItem.class)).thenReturn(galleryItem1);
        when(slideResource2.adaptTo(GalleryItem.class)).thenReturn(galleryItem2);

        // Initialize the gallery
        gallery.init();

        // Verify results
        List<GalleryItem> slides = gallery.getSlides();
        assertNotNull(slides);
        assertEquals(2, slides.size());
        assertTrue(slides.contains(galleryItem1));
        assertTrue(slides.contains(galleryItem2));
    }

    @Test
    void testGetSlidesReturnsCopy() {
        // Set up some slides
        List<GalleryItem> originalSlides = new ArrayList<>();
        originalSlides.add(galleryItem1);
        gallery.setSlides(originalSlides);

        // Get the slides and modify the returned list
        List<GalleryItem> returnedSlides = gallery.getSlides();
        returnedSlides.add(galleryItem2);

        // Verify that the original list was not modified
        assertEquals(1, gallery.getSlides().size());
    }

    @Test
    void testSetSlidesStoresCopy() {
        // Create a list of slides
        List<GalleryItem> originalSlides = new ArrayList<>();
        originalSlides.add(galleryItem1);

        // Set the slides
        gallery.setSlides(originalSlides);

        // Modify the original list
        originalSlides.add(galleryItem2);

        // Verify that the gallery's internal list was not modified
        assertEquals(1, gallery.getSlides().size());
    }

    @Test
    void testInitSkipsNullItems() {
        // Set up mock behavior with one null item
        List<Resource> childResources = Arrays.asList(slideResource1, slideResource2);
        Iterator<Resource> resourceIterator = childResources.iterator();
        when(slidesResource.listChildren()).thenReturn(resourceIterator);
        when(slideResource1.adaptTo(GalleryItem.class)).thenReturn(galleryItem1);
        when(slideResource2.adaptTo(GalleryItem.class)).thenReturn(null); // This one returns null

        // Initialize the gallery
        gallery.init();

        // Verify results - only the non-null item should be in the list
        List<GalleryItem> slides = gallery.getSlides();
        assertEquals(1, slides.size());
        assertTrue(slides.contains(galleryItem1));
    }
}
