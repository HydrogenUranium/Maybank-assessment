package com.positive.dhl.core.services.transformers;

import com.positive.dhl.core.services.PathUtilService;
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

import static com.positive.dhl.core.utils.OSGiConfigUtils.arrayToEntrySetWithDelimiter;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LinkTransformerTest {

    @Mock
    private PathUtilService pathUtilService;

    @Test
    void test() {
        when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + path : "";
        });
        Set<Map.Entry<String, String>> rewriteElements = arrayToEntrySetWithDelimiter(new String[]{
                "img:src",
                "source:src",
        });
        List<String> whitelistedLinks = List.of("/content/dam/.*");
        AttributesImpl attributes  = new AttributesImpl();
        attributes.addAttribute("", "src", "src", "CDATA", "/content/dam/img.png");

        LinkTransformer transformer = new LinkTransformer(pathUtilService, rewriteElements, whitelistedLinks);
        Attributes result = transformer.modifyAttributes("img", attributes);

        assertEquals("/discover/content/dam/img.png", result.getValue("src"));
    }
}