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

public class HttpsLinkTransformer extends DefaultTransformer implements Transformer {

    private static final String HREF_ATTRIBUTE = "href";
    private static final String ANCHOR_TAG = "a";
    private static final String HTTP_PREFIX = "http://www.dhl.com";
    private static final String HTTPS_PREFIX = "https://www.dhl.com";
    /**
     *
     * @param context
     * @param configuration
     * @throws IOException
     */
    @Override
    public void init(ProcessingContext context, ProcessingComponentConfiguration configuration) throws IOException {
        //default implementation ignored
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, modifyAttributes(qName, attributes));
    }

    public Attributes modifyAttributes(String qName, Attributes attributes) {
        if(!ANCHOR_TAG.equalsIgnoreCase(qName)) {
            return attributes;
        }
        var modifiedAttributes = new AttributesImpl(attributes);
        int hrefIndex = modifiedAttributes.getIndex(HREF_ATTRIBUTE);

        if(hrefIndex != -1) {
            String hrefValue = modifiedAttributes.getValue(hrefIndex);
            if(StringUtils.isNotBlank(hrefValue) && hrefValue.startsWith(HTTP_PREFIX)) {
                String updatedHref = hrefValue.replaceFirst(HTTP_PREFIX, HTTPS_PREFIX);
                modifiedAttributes.setValue(hrefIndex, updatedHref);
            }
        }
        return modifiedAttributes;
    }

}