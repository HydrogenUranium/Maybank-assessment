package com.dhl.discover.core.services.transformers;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.rewriter.DefaultTransformer;
import org.apache.sling.rewriter.ProcessingComponentConfiguration;
import org.apache.sling.rewriter.ProcessingContext;
import org.apache.sling.rewriter.Transformer;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

import java.io.IOException;

public class ProtocolNormalizationTransformer extends DefaultTransformer implements Transformer {


    @Override
    public void init(ProcessingContext context, ProcessingComponentConfiguration configuration) throws IOException {
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, modifyAttributes(qName, attributes));
    }

    public Attributes modifyAttributes(String qName, Attributes attributes) {
        if(!qName.equalsIgnoreCase("a")) {
            return attributes;
        }
        var modifiedAttributes = new AttributesImpl(attributes);
        updateProtocol(modifiedAttributes);
        return modifiedAttributes;
    }

    private void updateProtocol(AttributesImpl attributes) {
        var hrefAttribute  = "href";

        int hrefIndex = attributes.getIndex(hrefAttribute);
        if(hrefIndex == -1) {
            return;
        }

        String hrefValue = attributes.getValue(hrefIndex);
        if(StringUtils.isNotBlank(hrefValue) && hrefValue.startsWith("http://www.dhl.com")) {
            String updatedHref = hrefValue.replaceFirst("http://www.dhl.com", "httpa://www.dhl.com");
            attributes.setValue(hrefIndex, updatedHref);
        }
    }
}