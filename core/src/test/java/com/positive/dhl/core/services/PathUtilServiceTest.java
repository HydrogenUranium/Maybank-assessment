package com.positive.dhl.core.services;

import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.dam.api.Asset;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.mime.MimeTypeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;


@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PathUtilServiceTest {
    public static final String PATH_WITHOUT_UNSUPPORTED_CHARACTERS = "/content/dam/path-without-unsupported-characters/name-without-spaces.jpg";
    public static final String PATH_OPTIMIZED_IMAGE = "/adobe/dynamicmedia/deliver/name-without-spaces.jpg";
    public static final String PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS = "/content/dam/path-with-unsupported-characters-()><'/name with spaces.jpg";
    public static final String PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS = "/content/dam/path-with-unsupported-characters-%28%29%3E%3C%27/name%20with%20spaces.jpg";

    @InjectMocks
    PathUtilService pathUtilService;

    @Mock
    AssetUtilService assetUtilService;

    @Mock
    AssetDelivery assetDelivery;

    @Mock
    ResourceResolverHelper resourceResolverHelper;

    @Mock
    ResourceResolver resolver;

    @Mock
    Resource resource;

    @Mock
    Asset asset;

    @Mock
    MimeTypeService mimeTypeService;

    @Test
    void test_encodeUnsupportedCharacters() {
        assertNotNull(pathUtilService);

        assertEquals(
                PATH_WITHOUT_UNSUPPORTED_CHARACTERS,
                pathUtilService.encodeUnsupportedCharacters(PATH_WITHOUT_UNSUPPORTED_CHARACTERS));

        assertEquals(
                PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS,
                pathUtilService.encodeUnsupportedCharacters(PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS));
    }

    @Test
    void test_resolveAssetPath() {
        when(assetUtilService.resolvePath(anyString())).thenReturn(PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS);

        assertNotNull(pathUtilService);

        assertEquals(
                PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS,
                pathUtilService.resolveAssetPath(PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS));
    }

    @Test
    void test_resolveAssetPath_WebOptimizedTrue() {
        when(assetDelivery.getDeliveryURL(any(), anyMap())).thenReturn(PATH_OPTIMIZED_IMAGE);
        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resolver);
        when(resolver.getResource(anyString())).thenReturn(resource);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getMimeType()).thenReturn("\"image/jpeg\"");
        when(asset.getPath()).thenReturn(PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS);
        when(asset.getName()).thenReturn("path-with-unsupported-characters-()><'/name with spaces");
        when(mimeTypeService.getExtension(anyString())).thenReturn("jpg");

        String path = pathUtilService.resolveAssetPath(PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS, true);

        assertEquals(PATH_OPTIMIZED_IMAGE, path);
    }

    @Test
    void test_resolveAssetPath_WebOptimizedFalse() {
        when(assetUtilService.resolvePath(anyString())).thenReturn(PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS);

        String path = pathUtilService.resolveAssetPath(PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS, false);

        assertEquals(PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS, path);
    }

}
