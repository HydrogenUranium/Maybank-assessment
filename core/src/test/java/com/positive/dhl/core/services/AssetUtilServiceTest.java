package com.positive.dhl.core.services;

import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.dam.api.Rendition;
import com.day.cq.dam.api.RenditionPicker;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.mime.MimeTypeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssetUtilServiceTest {

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @Mock
    private AssetDelivery assetDelivery;

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private MimeTypeService mimeTypeService;

    @Mock
    private ResourceResolver resolver;

    @Mock
    private Resource resource;

    @Mock
    private Asset asset;

    @Mock
    private Rendition rendition;

    @InjectMocks
    private AssetUtilService service;

    @BeforeEach
    void init() {
        lenient().when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resolver);
    }

    @Test
    void resolvePath_ShouldReturnOriginalLink_WhenAssetDeliveryIsNotInjected() {
        String originalLink = "/content/dam/image.jpg";
        String resolvedLink = service.getDeliveryURL(originalLink, assetDelivery);

        assertEquals(originalLink, resolvedLink);
    }

    @Test
    void resolvePath_ShouldReturnEmptyLink_WhenAssetPathIsBlank() {
        String resolvedLink = service.getDeliveryURL(null, assetDelivery);

        assertEquals("", resolvedLink);
    }

    @Test
    void getDeliveryURL_ShouldReturnLinkWithAsserPrefix_WhenAssetAssetDeliveryIsInjectedAndPropsAreNull() {
        String originalLink = "/content/dam/image.jpg";
        when(assetDelivery.getDeliveryURL(any(), anyMap())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, Resource.class).getPath();
            return StringUtils.isNotBlank(path) ? "/adobe/dynamicmedia/delivery" + path : "";
        });
        when(resolver.getResource(anyString())).thenReturn(resource);
        when(resource.getPath()).thenReturn(originalLink);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getMimeType()).thenReturn("image/jpeg");
        when(asset.getName()).thenReturn("image");
        when(asset.getPath()).thenReturn(originalLink);
        when(mimeTypeService.getExtension(anyString())).thenReturn("jpg");
        when(pathUtilService.encodePath(anyString())).thenAnswer(invocationOnMock ->
                 invocationOnMock.getArgument(0, String.class)
        );
        when(pathUtilService.decodePath(anyString())).thenAnswer(invocationOnMock ->
                invocationOnMock.getArgument(0, String.class)
        );

        String resolvedLink = service.getDeliveryURL(originalLink, assetDelivery);

        assertEquals("/adobe/dynamicmedia/delivery/content/dam/image.jpg", resolvedLink);
    }

    @Test
    void getDeliveryURL_ShouldReturnLinkWithAsserPrefix_WhenAssetAssetDeliveryIsInjected() {
        String originalLink = "/content/dam/image.jpg";
        when(assetDelivery.getDeliveryURL(any(), anyMap())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, Resource.class).getPath();
            return StringUtils.isNotBlank(path) ? "/adobe/dynamicmedia/delivery" + path : "";
        });
        when(resolver.getResource(anyString())).thenReturn(resource);
        when(resource.getPath()).thenReturn(originalLink);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getMimeType()).thenReturn("image/jpeg");
        when(asset.getName()).thenReturn("image");
        when(asset.getPath()).thenReturn(originalLink);
        when(mimeTypeService.getExtension(anyString())).thenReturn("jpg");
        when(pathUtilService.encodePath(anyString())).thenAnswer(invocationOnMock ->
                invocationOnMock.getArgument(0, String.class)
        );
        when(pathUtilService.decodePath(anyString())).thenAnswer(invocationOnMock ->
                invocationOnMock.getArgument(0, String.class)
        );

        String resolvedLink = service.getDeliveryURL(originalLink, new HashMap<>(), assetDelivery);

        assertEquals("/adobe/dynamicmedia/delivery/content/dam/image.jpg", resolvedLink);
    }

    @Test
    void getDeliveryURL_ShouldReturnOriginalLink_WhenThrowException() {
        String originalLink = "/content/dam/image.jpg";
        when(resolver.getResource(anyString())).thenThrow(new NullPointerException());

        String resolvedLink = service.getDeliveryURL(originalLink, new HashMap<>(), assetDelivery);

        assertEquals(originalLink, resolvedLink);
    }

    @Test
    void getAltText() {
        when(resolver.getResource(anyString())).thenReturn(resource);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getMetadataValue(DamConstants.DC_DESCRIPTION)).thenReturn("alt");

        String altText = service.getAltText("/content/dam/img.jpg");

        assertEquals("alt", altText);
    }

    @Test
    void getMimeType() {
        when(resolver.getResource(anyString())).thenReturn(resource);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getMimeType()).thenReturn("video/mp4");

        String mimeType = service.getMimeType("/content/dam/video.mp4");

        assertEquals("video/mp4", mimeType);
    }

    @Test
    void getMappedDeliveryUrl() {
        when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + path : "";
        });
        String originalLink = "/content/dam/image.jpg";
        when(assetDelivery.getDeliveryURL(any(), anyMap())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, Resource.class).getPath();
            return StringUtils.isNotBlank(path) ? "/adobe/dynamicmedia/delivery" + path : "";
        });
        when(resolver.getResource(anyString())).thenReturn(resource);
        when(resource.getPath()).thenReturn(originalLink);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getMimeType()).thenReturn("image/jpeg");
        when(asset.getName()).thenReturn("image");
        when(asset.getPath()).thenReturn(originalLink);
        when(mimeTypeService.getExtension(anyString())).thenReturn("jpg");
        when(pathUtilService.encodePath(anyString())).thenAnswer(invocationOnMock ->
                invocationOnMock.getArgument(0, String.class)
        );
        when(pathUtilService.decodePath(anyString())).thenAnswer(invocationOnMock ->
                invocationOnMock.getArgument(0, String.class)
        );

        String resolvedLink = service.getMappedDeliveryUrl(originalLink, new HashMap<>(), assetDelivery);

        assertEquals("/discover/adobe/dynamicmedia/delivery/content/dam/image.jpg", resolvedLink);
    }

    @Test
    void test_getThumbnailLink(){
        when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + path : "";
        });
        when(resolver.getResource(anyString())).thenReturn(resource);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getRendition(any(RenditionPicker.class))).thenReturn(rendition);
        when(rendition.getPath()).thenReturn("/content/dam/image.png/jcr:content/rendition.cq5dam.thumbnail.140.100.png");
        when(pathUtilService.decodePath(anyString())).thenAnswer(invocationOnMock ->
                invocationOnMock.getArgument(0, String.class)
        );
        when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock ->
                invocationOnMock.getArgument(0, String.class)
        );

        String thumbnail = service.getThumbnailLink("/content/dam/image.png");

        assertEquals("/content/dam/image.png/jcr:content/rendition.cq5dam.thumbnail.140.100.png", thumbnail);
    }
}