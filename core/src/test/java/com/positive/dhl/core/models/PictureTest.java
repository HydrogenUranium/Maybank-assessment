package com.positive.dhl.core.models;

import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static com.positive.dhl.core.utils.InjectorMock.INJECT_REQUEST_ATTRIBUTES;
import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PictureTest {
    AemContext context = new AemContext(ResourceResolverType.RESOURCEPROVIDER_MOCK);

    @Mock
    AssetUtilService assetUtilService;

    @Mock
    PathUtilService pathUtilService;

    @BeforeEach
    void init() {
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);
        context.addModelsForClasses(Picture.class);
        mockInject(context, INJECT_REQUEST_ATTRIBUTES, Map.of(
                "image", "/content/dam/image.jpg",
                "desktopImage", "/content/dam/image-dt.jpg",
                "tabletImage", "/content/dam/image-tb.jpg",
                "mobileImage", "/content/dam/image-mb.jpg",
                "useWebOptimized", true,
                "forceMap", true
        ));
    }

    @Test
    void test() {
        when(assetUtilService.getAltText(anyString())).thenReturn("alt");
        when(assetUtilService.getMimeType(anyString())).thenReturn("image/jpg");
        when(assetUtilService.getDeliveryURL(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/dynamicmedia" + path + "?preferwebp=true" : "";
        });
        when(assetUtilService.getDeliveryURL(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/dynamicmedia" + path : "";
        });
        when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + path : "";
        });
        Picture picture = context.request().adaptTo(Picture.class);

        assertEquals("alt", picture.getAlt());
        assertEquals("/discover/content/dam/image.jpg", picture.getImage());
        assertEquals("/discover/content/dam/image-dt.jpg", picture.getDesktopImage());
        assertEquals("/discover/content/dam/image-mb.jpg", picture.getMobileImage());
        assertEquals("/discover/content/dam/image-tb.jpg", picture.getTabletImage());
        assertTrue(picture.isUseWebOptimized());
        assertTrue(picture.isForceMap());
    }
}