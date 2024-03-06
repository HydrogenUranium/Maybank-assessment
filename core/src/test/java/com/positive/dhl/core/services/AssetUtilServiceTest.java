package com.positive.dhl.core.services;

import com.day.cq.dam.api.Asset;
import com.positive.dhl.core.components.EnvironmentConfiguration;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssetUtilServiceTest {
    @Mock
    private EnvironmentConfiguration environmentConfiguration;

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @Mock
    private ResourceResolver resolver;

    @Mock
    private Resource resource;

    @Mock
    private Asset asset;

    @Mock
    private AssetUtilService.Config config;

    @InjectMocks
    private AssetUtilService service;

    @Test
    void resolvePath_ShouldReturnOriginalLink_WhenAssetPrefixIsEmpty() {
        when(config.assetPrefix()).thenReturn("");
        service.activate(config);

        String originalLink = "/content/dam/image.jpg";
        String resolvedLink = service.resolvePath(originalLink);

        assertEquals(originalLink, resolvedLink);
    }

    @Test
    void resolvePath_ShouldReturnLinkWithAsserPrefix_WhenAssetPrefixIsConfigured() {
        String prefix = "/discover";
        when(config.assetPrefix()).thenReturn(prefix);
        service.activate(config);

        String originalLink = "/content/dam/image.jpg";
        String resolvedLink = service.resolvePath(originalLink);

        assertEquals(prefix + originalLink, resolvedLink);
    }

    @Test
    void resolvePath_ShouldReturnLinkWithAsserPrefix_WhenAssetPrefixIsNotConfigured() {
        String prefix = "/env-asset-prefix";
        when(environmentConfiguration.getAssetPrefix()).thenReturn(prefix);
        service.activate(config);

        String originalLink = "/content/dam/image.jpg";
        String resolvedLink = service.resolvePath(originalLink);

        assertEquals(prefix + originalLink, resolvedLink);
    }

    @Test
    void test() {
        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resolver);
        when(resolver.getResource(anyString())).thenReturn(resource);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getMimeType()).thenReturn("video/mp4");

        service.activate(config);

        String mimeType = service.getMimeType("/content/dam/video.mp4");

        assertEquals("video/mp4", mimeType);
    }
}