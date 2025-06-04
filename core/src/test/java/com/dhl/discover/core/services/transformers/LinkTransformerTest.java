package com.dhl.discover.core.services.transformers;

import com.dhl.discover.core.services.PathUtilService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.xml.sax.Attributes;
import org.xml.sax.helpers.AttributesImpl;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.dhl.discover.core.utils.OSGiConfigUtils.arrayToEntrySetWithDelimiter;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LinkTransformerTest {

    @Mock
    private PathUtilService pathUtilService;

    private final Set<Map.Entry<String, String>> rewriteElements = arrayToEntrySetWithDelimiter(new String[]{
            "img:src",
            "img:srcset",
            "source:src",
    });
    private final List<String> whitelistedLinks = List.of(
            "/content/dam/.*",
            "/adobe/dynamicmedia/deliver/.*"
    );

    @BeforeEach
    void setUp() {
        lenient().when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + path : "";
        });
    }

    @Test
    void modifyAttributes_shouldReturnMappedLink_WhenAttributeContainsLink() {
        AttributesImpl attributes  = new AttributesImpl();
        attributes.addAttribute("", "src", "src", "CDATA", "/content/dam/img.png");

        LinkTransformer transformer = new LinkTransformer(pathUtilService, rewriteElements, whitelistedLinks);
        Attributes result = transformer.modifyAttributes("img", attributes);

        assertEquals("/discover/content/dam/img.png", result.getValue("src"));
    }

    @Test
    void modifyAttributes_shouldReturnEmpty_WhenAttributeContainsBlankLink() {
        AttributesImpl attributes  = new AttributesImpl();
        attributes.addAttribute("", "src", "src", "CDATA", "");

        LinkTransformer transformer = new LinkTransformer(pathUtilService, rewriteElements, whitelistedLinks);
        Attributes result = transformer.modifyAttributes("img", attributes);

        assertEquals("", result.getValue("src"));
    }

    @Test
    void modifyAttributes_shouldReturnMappedSrcset_WhenAttributeContainsSrcset() {
        AttributesImpl attributes  = new AttributesImpl();
        attributes.addAttribute("", "srcset", "srcset", "CDATA",
                "/adobe/dynamicmedia/deliver/image.jpg?preferwebp=true 400w, /adobe/dynamicmedia/deliver/image.jpg 500w");

        LinkTransformer transformer = new LinkTransformer(pathUtilService, rewriteElements, whitelistedLinks);
        Attributes result = transformer.modifyAttributes("img", attributes);

        assertEquals("/discover/adobe/dynamicmedia/deliver/image.jpg?preferwebp=true 400w, /discover/adobe/dynamicmedia/deliver/image.jpg 500w",
                result.getValue("srcset"));
    }
}