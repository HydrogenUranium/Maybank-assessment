package com.dhl.discover.core.models;

import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.dhl.discover.junitUtils.InjectorMock.mockInjectHomeProperty;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class VideoTest {

    private final AemContext context = new AemContext();

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private AssetUtilService assetUtilService;

    @BeforeEach
    void setUp() throws Exception {
        context.addModelsForClasses(Video.class);
        context.load().json("/com/dhl/discover/core/models/Video/content.json", "/content/dhl/landing/jcr:content/root");

        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);

        when(assetUtilService.getMimeType(anyString())).thenReturn("video/webm");
        mockInjectHomeProperty(context, "video-unsupportedMessage", "Your browser does not support the video playback.");
    }

    @Test
    void test() {
        Video video = context.resourceResolver().getResource("/content/dhl/landing/jcr:content/root/video").adaptTo(Video.class);

        assertNotNull(video);
        assertFalse(video.isAutoplay());
        assertFalse(video.isLoop());
        assertTrue(video.isControls());
        assertFalse(video.isMuted());
        assertTrue(video.isFullWidth());
        assertEquals("video/webm", video.getMimeType());
        assertEquals("/content/dam/global-master/video.webm", video.getVideoPath());
        assertEquals("/content/dam/poster.png", video.getPoster());
        assertEquals("left", video.getAlign());
        assertEquals(0, video.getMaxHeight());
        assertEquals(100, video.getMaxWidth());
        assertEquals("Your browser does not support the video playback.", video.getUnsupportedMessage());
    }
}