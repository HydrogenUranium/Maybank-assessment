package com.dhl.discover.core.models;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DownloadAssetTest {
    @Mock
    private Resource resource;

    private DownloadAsset downloadAsset;
    private Map<String, Object> properties;

    @BeforeEach
    void setUp() {
        properties = new HashMap<>();

        when(resource.adaptTo(DownloadAsset.class)).thenAnswer(invocation -> {
            DownloadAsset asset = new DownloadAsset();
            asset.assetpath = (String) properties.get("assetpath");
            return asset;
        });
    }

    @Test
    void testEncodedAssetPathWithEmptyString() {
        properties.put("assetpath", "");
        downloadAsset = resource.adaptTo(DownloadAsset.class);

        String encodedPath = downloadAsset.encodedAssetPath();

        assertNotNull(encodedPath);
        assertEquals("", encodedPath);
    }

    @Test
    void testEncodedAssetPathWithNullAssetPath() {
        properties.put("assetpath", null);
        downloadAsset = resource.adaptTo(DownloadAsset.class);

        assertThrows(NullPointerException.class, () -> downloadAsset.encodedAssetPath());
    }

    @Test
    void testEncodedAssetPath() {
        String assetPath = "/content/dam/dhl/test-asset.pdf";
        properties.put("assetpath", assetPath);
        downloadAsset = resource.adaptTo(DownloadAsset.class);

        String encodedPath = downloadAsset.encodedAssetPath();

        assertNotNull(encodedPath);

        String expectedEncodedPath = Base64.getEncoder().withoutPadding().encodeToString(assetPath.getBytes(StandardCharsets.UTF_8));
        assertEquals(expectedEncodedPath.trim(), encodedPath.trim());
    }

    @Test
    void testEncodedAssetPathWithSpecialCharacters() {

            String assetPath = "/content/dam/dhl/test-asset with spaces & special chars.pdf";
            properties.put("assetpath", assetPath);
            downloadAsset = resource.adaptTo(DownloadAsset.class);

            String encodedPath = downloadAsset.encodedAssetPath();

            assertNotNull(encodedPath);

            String expectedEncodedPath = Base64.getEncoder()
                    .withoutPadding()
                    .encodeToString(assetPath.getBytes(StandardCharsets.UTF_8));

            String cleanExpected = expectedEncodedPath.replaceAll("\\s+", "");
            String cleanActual = encodedPath.replaceAll("\\s+", "");

            assertEquals(cleanExpected, cleanActual);
    }
}
