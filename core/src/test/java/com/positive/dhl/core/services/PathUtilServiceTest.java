package com.positive.dhl.core.services;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;

import static org.junit.jupiter.api.Assertions.*;


@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PathUtilServiceTest {
    public static final String PATH_WITHOUT_UNSUPPORTED_CHARACTERS = "/content/dam/path-without-unsupported-characters/name-without-spaces.jpg";
    public static final String PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS = "/content/dam/path-with-unsupported-characters-()><'/name with spaces.jpg";

    @InjectMocks
    PathUtilService pathUtilService;

    @Test
    void test_encodeUnsupportedCharacters() {
        assertNotNull(pathUtilService);

        assertEquals(
                PATH_WITHOUT_UNSUPPORTED_CHARACTERS,
                pathUtilService.encodeUnsupportedCharacters(PATH_WITHOUT_UNSUPPORTED_CHARACTERS));

        assertEquals(
                "/content/dam/path-with-unsupported-characters-%28%29%3E%3C%27/name%20with%20spaces.jpg",
                pathUtilService.encodeUnsupportedCharacters(PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS));
    }
}
