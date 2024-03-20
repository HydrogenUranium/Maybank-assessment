package com.positive.dhl.core.services;

import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.dam.api.Asset;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.mime.MimeTypeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;


@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PathUtilServiceTest {
    public static final String PATH_WITHOUT_UNSUPPORTED_CHARACTERS = "/content/dam/path-without-unsupported-characters/name-without-spaces.jpg";
    public static final String PATH_WITH_SPACES_AND_UNSUPPORTED_CHARACTERS = "/content/dam/path-with-unsupported-characters-()><'/name with spaces.jpg";
    public static final String PATH_WITH_ENCODED_SPACES_AND_UNSUPPORTED_CHARACTERS = "/content/dam/path-with-unsupported-characters-%28%29%3E%3C%27/name%20with%20spaces.jpg";
    public static final String PATH_WITH_UNSUPPORTED_CHARACTERS = "/content/dam/path()'/img.jpg";
    public static final String MAPPED_PATH = "/discover/content/dam/path%28%29%27/img.jpg";

    @InjectMocks
    PathUtilService pathUtilService;

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
}
