package com.dhl.discover.core.config.impl;

import com.dhl.discover.core.config.AkamaiFlushConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AkamaiFlushConfigReaderImplTest {
    @Mock
    private AkamaiFlushConfig mockConfig;

    private AkamaiFlushConfigReaderImpl configReader;

    @BeforeEach
    void setUp() {
        configReader = new AkamaiFlushConfigReaderImpl();
    }

    @Test
    void testActivate_shouldSetAllProperties() {
        // Given
        String clientSecret = "testClientSecret";
        String accessToken = "testAccessToken";
        String akamaiHost = "test.akamai.com";
        String clientToken = "testClientToken";
        Long delay = 5L;
        String[] contentTypes = new String[]{"cq:Page", "dam:Asset"};
        String[] contentPaths = new String[]{"/content/dhl", "/content/dam/dhl"};
        boolean enabled = true;
        String apiPath = "/api/v1/purge";

        when(mockConfig.clientSecret()).thenReturn(clientSecret);
        when(mockConfig.accessToken()).thenReturn(accessToken);
        when(mockConfig.akamaiHost()).thenReturn(akamaiHost);
        when(mockConfig.clientToken()).thenReturn(clientToken);
        when(mockConfig.delay()).thenReturn(delay);
        when(mockConfig.allowedContentTypes()).thenReturn(contentTypes);
        when(mockConfig.allowedContentPaths()).thenReturn(contentPaths);
        when(mockConfig.flushEnabled()).thenReturn(enabled);
        when(mockConfig.flushApiPath()).thenReturn(apiPath);

        // When
        configReader.activate(mockConfig);

        // Then
        assertEquals(clientSecret, configReader.getClientSecret());
        assertEquals(accessToken, configReader.getAccessToken());
        assertEquals(akamaiHost, configReader.getAkamaiHost());
        assertEquals(clientToken, configReader.getClientToken());
        assertEquals(delay, configReader.getDelay());
        //assertArrayEquals(contentTypes, configReader.getAllowedContentTypes());
        //assertArrayEquals(contentPaths, configReader.getAllowedContentPaths());
        assertTrue(configReader.isEnabled());
        assertEquals(apiPath, configReader.getApiPath());
    }

    @Test
    void testGetDelay_withPositiveValue_shouldReturnConfiguredValue() {
        // Given
        Long expectedDelay = 10L;
        when(mockConfig.delay()).thenReturn(expectedDelay);
        configReader.activate(mockConfig);

        // When
        Long actualDelay = configReader.getDelay();

        // Then
        assertEquals(expectedDelay, actualDelay);
    }

    @Test
    void testGetDelay_withZeroValue_shouldReturnDefaultValue() {
        // Given
        Long configuredDelay = 0L;
        when(mockConfig.delay()).thenReturn(configuredDelay);
        configReader.activate(mockConfig);

        // When
        Long actualDelay = configReader.getDelay();

        // Then
        assertEquals(1L, actualDelay);
    }

    @Test
    void testGetDelay_withNegativeValue_shouldReturnDefaultValue() {
        // Given
        Long configuredDelay = -5L;
        when(mockConfig.delay()).thenReturn(configuredDelay);
        configReader.activate(mockConfig);

        // When
        Long actualDelay = configReader.getDelay();

        // Then
        assertEquals(1L, actualDelay);
    }

    @Test
    void testGetAllowedContentTypes_withValidArray_shouldReturnListOfTypes() {
        // Given
        String[] contentTypes = new String[]{"cq:Page", "dam:Asset"};
        when(mockConfig.allowedContentTypes()).thenReturn(contentTypes);
        configReader.activate(mockConfig);

        // When
        List<String> result = configReader.getAllowedContentTypes();

        // Then
        assertEquals(2, result.size());
        assertEquals(Arrays.asList("cq:Page", "dam:Asset"), result);
    }

    @Test
    void testGetAllowedContentTypes_withEmptyArray_shouldReturnEmptyList() {
        // Given
        String[] contentTypes = new String[]{};
        when(mockConfig.allowedContentTypes()).thenReturn(contentTypes);
        configReader.activate(mockConfig);

        // When
        List<String> result = configReader.getAllowedContentTypes();

        // Then
        assertEquals(0, result.size());
        assertEquals(Collections.emptyList(), result);
    }

    @Test
    void testGetAllowedContentTypes_withNullArray_shouldReturnEmptyList() {
        // Given
        when(mockConfig.allowedContentTypes()).thenReturn(null);
        configReader.activate(mockConfig);

        // When
        List<String> result = configReader.getAllowedContentTypes();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetAllowedContentPaths_withValidArray_shouldReturnListOfPaths() {
        // Given
        String[] contentPaths = new String[]{"/content/dhl", "/content/dam/dhl"};
        when(mockConfig.allowedContentPaths()).thenReturn(contentPaths);
        configReader.activate(mockConfig);

        // When
        List<String> result = configReader.getAllowedContentPaths();

        // Then
        assertEquals(2, result.size());
        assertEquals(Arrays.asList("/content/dhl", "/content/dam/dhl"), result);
    }

    @Test
    void testGetAllowedContentPaths_withEmptyArray_shouldReturnEmptyList() {
        // Given
        String[] contentPaths = new String[]{};
        when(mockConfig.allowedContentPaths()).thenReturn(contentPaths);
        configReader.activate(mockConfig);

        // When
        List<String> result = configReader.getAllowedContentPaths();

        // Then
        assertEquals(0, result.size());
        assertEquals(Collections.emptyList(), result);
    }

    @Test
    void testGetAllowedContentPaths_withNullArray_shouldReturnEmptyList() {
        // Given
        when(mockConfig.allowedContentPaths()).thenReturn(null);
        configReader.activate(mockConfig);

        // When
        List<String> result = configReader.getAllowedContentPaths();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testModified_shouldUpdateProperties() {
        // Given - initial config
        when(mockConfig.clientSecret()).thenReturn("initialSecret");
        when(mockConfig.accessToken()).thenReturn("initialToken");
        when(mockConfig.delay()).thenReturn(5L);
        configReader.activate(mockConfig);

        // Given - modified config
        AkamaiFlushConfig modifiedConfig = mock(AkamaiFlushConfig.class);
        when(modifiedConfig.clientSecret()).thenReturn("updatedSecret");
        when(modifiedConfig.accessToken()).thenReturn("updatedToken");
        when(modifiedConfig.delay()).thenReturn(10L);

        // When
        configReader.activate(modifiedConfig);

        // Then
        assertEquals("updatedSecret", configReader.getClientSecret());
        assertEquals("updatedToken", configReader.getAccessToken());
        assertEquals(10L, configReader.getDelay());
    }
}
