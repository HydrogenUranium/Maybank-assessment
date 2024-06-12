package com.positive.dhl.core.models;

import com.day.cq.dam.api.Asset;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;


@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class VideoAssetTest {

    private final AemContext context = new AemContext();
    private final ResourceResolver resolver = context.resourceResolver();

    @BeforeEach
    void init() {
        context.load().json("/com/positive/dhl/core/models/VideoAsset/content.json", "/content/dam/video");
        context.addModelsForClasses(VideoAsset.class);
        context.addModelsForClasses(Asset.class);
    }

    @Test
    void test() {
        Resource resource = resolver.getResource("/content/dam/video");

        VideoAsset videoAsset = resource.adaptTo(VideoAsset.class);

        assertNotNull(videoAsset);
        assertEquals("video", videoAsset.getName());
        assertEquals("description", videoAsset.getDescription());
        assertEquals("title", videoAsset.getTitle());
        assertEquals("PT13S", videoAsset.getDurationISO());
        assertEquals("/content/dam/video", videoAsset.getPath());
    }
}