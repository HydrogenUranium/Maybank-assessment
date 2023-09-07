package com.positive.dhl.core.services;

import com.positive.dhl.core.components.EnvironmentConfiguration;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssetUtilServiceTest {
    @Mock
    private EnvironmentConfiguration environmentConfiguration;

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
}