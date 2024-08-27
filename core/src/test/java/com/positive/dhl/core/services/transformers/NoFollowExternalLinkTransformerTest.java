package com.positive.dhl.core.services.transformers;

import com.positive.dhl.core.services.PathUtilService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.xml.sax.Attributes;
import org.xml.sax.helpers.AttributesImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NoFollowExternalLinkTransformerTest {

    @Mock
    PathUtilService pathUtilService;

    @Test
    void test() {
        when(pathUtilService.isExternalLink(anyString())).thenReturn(true);
        NoFollowExternalLinkTransformer transformer = new NoFollowExternalLinkTransformer(pathUtilService);

        AttributesImpl attributes  = new AttributesImpl();
        attributes.addAttribute("", "href", "href", "CDATA", "https://www.google.com");

        Attributes result = transformer.modifyAttributes("a", attributes);

        assertEquals("nofollow", result.getValue("rel"));
    }
}