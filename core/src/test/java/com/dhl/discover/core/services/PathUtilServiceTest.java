package com.dhl.discover.core.services;

import com.day.cq.dam.api.Asset;
import com.dhl.discover.core.components.EnvironmentConfiguration;
import com.dhl.discover.core.utils.RequestUtils;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.mime.MimeTypeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.UnsupportedEncodingException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;


@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PathUtilServiceTest {
    public static final String PATH_WITHOUT_UNSUPPORTED_CHARACTERS = "/content/dam/path-without-unsupported-characters/name-without-spaces.jpg";
    public static final String PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS = "/content/dam/path-with-unsupported-characters-()><'/name with spaces.jpg";
    public static final String PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS = "/content/dam/path-with-unsupported-characters-%28%29%3E%3C%27/name%20with%20spaces.jpg";
    public static final String PATH_WITH_UNSUPPORTED_CHARACTERS = "/content/dam/path()'/img.jpg";
    public static final String MAPPED_PATH = "/discover/content/dam/path%28%29%27/img.jpg";
    public static final String MAPPED_ABSOLUTE_PATH = "https://dhl.com/discover/content/dam/path%28%29%27/img.jpg";

    AemContext context = new AemContext();

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

    @Mock
    EnvironmentConfiguration environmentConfiguration;

    @InjectMocks
    PathUtilService pathUtilService;

    @Test
    void test_encodeUnsupportedCharacters() {
        assertNotNull(pathUtilService);

        assertEquals(
                PATH_WITHOUT_UNSUPPORTED_CHARACTERS,
                pathUtilService.encodePath(PATH_WITHOUT_UNSUPPORTED_CHARACTERS));

        assertEquals(
                PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS,
                pathUtilService.encodePath(PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS));
    }

    @Test
    void test_map() {
        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resolver);
        lenient().when(resolver.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + invocationOnMock.getArgument(0, String.class) : "";
        });

        String path = pathUtilService.map(PATH_WITH_UNSUPPORTED_CHARACTERS);

        assertEquals(MAPPED_PATH, path);
    }

    @Test
    void test_getFullMappedPath() {
        try(MockedStatic<RequestUtils> mockedStatic = mockStatic(RequestUtils.class)){
            mockedStatic.when(() -> RequestUtils.getUrlPrefix(any())).thenReturn("https://dhl.com");

            when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resolver);
            lenient().when(resolver.map(anyString())).thenAnswer(invocationOnMock -> {
                String path = invocationOnMock.getArgument(0, String.class);
                return StringUtils.isNotBlank(path) ? "/discover" + invocationOnMock.getArgument(0, String.class) : "";
            });

            String path = pathUtilService.getFullMappedPath(PATH_WITH_UNSUPPORTED_CHARACTERS, context.request());

            assertEquals(MAPPED_ABSOLUTE_PATH, path);
        }
    }

    @ParameterizedTest
    @CsvSource({
            "/content/page.html, false",
            "https://www.dhl.com/some-page, false",
            "#section, false",
            "https://www.google.com, true",
            "http://example.com/invalid uri\\with\\illegal\"chars, false",
    })
    void test_isExternalLink(String link, boolean isExternal) {
        lenient().when(environmentConfiguration.getAkamaiHostname()).thenReturn("www.dhl.com");

        boolean result = pathUtilService.isExternalLink(link);

        assertEquals(isExternal, result);
    }

    @Test
    void testEncodePath_shouldHandleExceptionCorrectly() {
        // Create a test input that should trigger the exception handling
        // Using a null string might trigger a NullPointerException
        String nullPath = null;
        String result = pathUtilService.encodePath(nullPath);
        assertEquals(nullPath, result);
    }

    @Test
    void testMap() throws Exception {
        assertNull(pathUtilService.map(null));
        ResourceResolver mockResolver = mock(ResourceResolver.class);
        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(mockResolver);
        String inputPath = "/content/discover/path";
        String mappedPath = "/mapped/discover/path";
        when(mockResolver.map(inputPath)).thenReturn(mappedPath);

        String result = pathUtilService.map(inputPath);

        assertEquals(mappedPath, result);

        String pathWithSpecialChars = "/content/path(with)'special'chars";
        String mappedSpecialPath = "/mapped/path(with)'special'chars";
        String expectedEncodedPath = "/mapped/path%28with%29%27special%27chars";

        lenient().when(mockResolver.map(pathWithSpecialChars)).thenReturn(mappedSpecialPath);

        assertEquals(expectedEncodedPath, pathUtilService.map(pathWithSpecialChars));

        String exceptionPath = "/exception/path";
        when(mockResolver.map(exceptionPath)).thenReturn("/mapped/exception/path");

        PathUtilService spyService = spy(pathUtilService);
        doThrow(new UnsupportedEncodingException("Test encoding exception"))
                .when(spyService).encodeUnsupportedCharacters(any());

        assertEquals(exceptionPath, spyService.map(exceptionPath));

        verify(spyService, times(1)).encodeUnsupportedCharacters(any());
    }

    @Test
    void test_getFullMappedPathNullPath() {
        assertNull(pathUtilService.getFullMappedPath(null, context.request()));

        try(MockedStatic<RequestUtils> mockedStatic = mockStatic(RequestUtils.class)){
            mockedStatic.when(() -> RequestUtils.getUrlPrefix(any())).thenReturn("https://dhl.com");

            when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resolver);
            lenient().when(resolver.map(anyString())).thenAnswer(invocationOnMock -> {
                String path = invocationOnMock.getArgument(0, String.class);
                return StringUtils.isNotBlank(path) ? "/discover" + invocationOnMock.getArgument(0, String.class) : "";
            });

            String path = pathUtilService.getFullMappedPath(PATH_WITH_UNSUPPORTED_CHARACTERS, context.request());

            assertEquals(MAPPED_ABSOLUTE_PATH, path);
        }
    }
}
