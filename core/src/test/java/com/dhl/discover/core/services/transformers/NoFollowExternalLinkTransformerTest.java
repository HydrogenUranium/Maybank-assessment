package com.dhl.discover.core.services.transformers;

import com.dhl.discover.core.services.PathUtilService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.xml.sax.Attributes;
import org.xml.sax.helpers.AttributesImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NoFollowExternalLinkTransformerTest {

    @Mock
    PathUtilService pathUtilService;

    @Test
    void testExternalLink_withoutRelAttribute_shouldAddNofollow() {
        when(pathUtilService.isExternalLink(anyString())).thenReturn(true);
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", "href", "href", "CDATA", "https://www.dhl.com");
        NoFollowExternalLinkTransformer transformer = new NoFollowExternalLinkTransformer(pathUtilService);
        Attributes result = transformer.modifyAttributes("a", attributes);
        assertEquals("nofollow", result.getValue("rel"), "External link should have nofollow attribute");
    }

    @Test
    void testExternalLink_withExistingRelAttribute_shouldAppendNofollow() {
        when(pathUtilService.isExternalLink(anyString())).thenReturn(true);
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", "href", "href", "CDATA", "https://www.google.com");
        attributes.addAttribute("", "rel", "rel", "CDATA", "external");
        NoFollowExternalLinkTransformer transformer = new NoFollowExternalLinkTransformer(pathUtilService);
        Attributes result = transformer.modifyAttributes("a", attributes);

        assertEquals("external nofollow", result.getValue("rel"), "Nofollow should be appended to existing rel value");
    }

    @Test
    void testExternalLink_withBlankHref_shouldNotModify() {
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", "href", "href", "CDATA", "  ");
        NoFollowExternalLinkTransformer transformer = new NoFollowExternalLinkTransformer(pathUtilService);
        Attributes result = transformer.modifyAttributes("a", attributes);
        assertNull(result.getValue("rel"), "Links with blank href should not have rel attribute added");
    }

    @Test
    void testLinkWithoutHref_shouldNotModify() {
        AttributesImpl attributes = new AttributesImpl();
        NoFollowExternalLinkTransformer transformer = new NoFollowExternalLinkTransformer(pathUtilService);
        Attributes result = transformer.modifyAttributes("a", attributes);
        assertNull(result.getValue("rel"), "Links without href should not have rel attribute added");
    }

    @Test
    void testInternalLink_shouldNotModify() {
        when(pathUtilService.isExternalLink(anyString())).thenReturn(false);
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", "href", "href", "CDATA", "/content/dhl/page");
        NoFollowExternalLinkTransformer transformer = new NoFollowExternalLinkTransformer(pathUtilService);
        Attributes result = transformer.modifyAttributes("a", attributes);
        assertNull(result.getValue("rel"), "Internal links should not have rel attribute added");
    }

    @Test
    void testNonLinkElement_shouldNotModify() {
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", "href", "href", "CDATA", "https://www.google.com");
        NoFollowExternalLinkTransformer transformer = new NoFollowExternalLinkTransformer(pathUtilService);
        Attributes result = transformer.modifyAttributes("div", attributes);
        assertEquals(attributes.getValue("href"), result.getValue("href"));
        assertNull(result.getValue("rel"), "Non-link elements should not have rel attribute added");
    }

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