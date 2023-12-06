package com.positive.dhl.core.services;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;


@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PathUtilServiceTest {
    public static final String PATH_WITHOUT_UNSUPPORTED_CHARACTERS = "/content/dam/path-without-unsupported-characters/name-without-spaces.jpg";
    public static final String PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS = "/content/dam/path-with-unsupported-characters-()><'/name with spaces.jpg";
    public static final String PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS = "/content/dam/path-with-unsupported-characters-%28%29%3E%3C%27/name%20with%20spaces.jpg";

    @InjectMocks
    PathUtilService pathUtilService;

    @Mock
    AssetUtilService assetUtilService;

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

}
