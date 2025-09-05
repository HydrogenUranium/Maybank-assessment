package com.dhl.discover.core.services.transformers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;

class HttpsLinkTransformerTest {

    private HttpsLinkTransformer transformer;

    @Mock
    private ContentHandler contentHandler;

    @BeforeEach
    void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);
        transformer = new HttpsLinkTransformer();
        transformer.setContentHandler(contentHandler);
    }

    @Test
    void testStartElement_NotAnchorElement_AttributesUnchanged() throws SAXException {
        String uri = "";
        String localName = "div";
        String qName = "div";
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", "class", "class", "CDATA", "container");

        transformer.startElement(uri, localName, qName, attributes);
        verify(contentHandler).startElement(eq(uri), eq(localName), eq(qName), any(Attributes.class));
    }

    @Test
    void testStartElement_AnchorWithNonDhlLink_AttributesUnchanged() throws SAXException {
        String uri = "";
        String localName = "a";
        String qName = "a";
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", "href", "href", "CDATA", "https://example.com");

        transformer.startElement(uri, localName, qName, attributes);
        verify(contentHandler).startElement(anyString(), anyString(), anyString(), any(Attributes.class));
    }

    @Test
    void testUpdateProtocol_HttpDhlLink_ConvertedToHttps() throws SAXException {
        String uri = "";
        String localName = "a";
        String qName = "a";
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", "href", "href", "CDATA", "http://www.dhl.com/en/express/tracking.html");

        transformer.startElement(uri, localName, qName, attributes);
        verify(contentHandler).startElement(
                eq(uri),
                eq(localName),
                eq(qName),
                argThat(attrs -> {
                    for (int i = 0; i < attrs.getLength(); i++) {
                        if ("href".equals(attrs.getQName(i))) {
                            return "https://www.dhl.com/en/express/tracking.html".equals(attrs.getValue(i));
                        }
                    }
                    return false;
                })
        );
    }
    @Test
    void testModifyAttributes_NonAnchorElement_ReturnOriginalAttributes() {
        String qName = "div";
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", "class", "class", "CDATA", "container");

        Attributes result = transformer.modifyAttributes(qName, attributes);
        assertSame(attributes, result);
    }
}