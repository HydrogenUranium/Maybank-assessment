package com.dhl.discover.core.services.transformers;

import com.dhl.discover.core.services.PathUtilService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.rewriter.DefaultTransformer;
import org.apache.sling.rewriter.ProcessingComponentConfiguration;
import org.apache.sling.rewriter.ProcessingContext;
import org.apache.sling.rewriter.Transformer;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

import java.io.IOException;

@RequiredArgsConstructor
public class NoFollowExternalLinkTransformer extends DefaultTransformer implements Transformer {
    private final PathUtilService pathUtilService;

    @Override
    public void init(ProcessingContext context, ProcessingComponentConfiguration configuration) throws IOException {
        //default implementation ignored
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
        addNoFollowAttribute(modifiedAttributes);
        return modifiedAttributes;
    }

    private void addNoFollowAttribute(AttributesImpl attributes) {
        var hrefAttribute  = "href";
        var relAttribute = "rel";
        var nofollow = "nofollow";

        int hrefIndex = attributes.getIndex(hrefAttribute);
        if(hrefIndex == -1) {
            return;
        }

        String hrefValue = attributes.getValue(hrefIndex);
        if(StringUtils.isNotBlank(hrefValue) && pathUtilService.isExternalLink(hrefValue)) {

            int relIndex = attributes.getIndex(relAttribute);
            String relValue = (relIndex != -1) ? attributes.getValue(relIndex) : null;

            if (StringUtils.isBlank(relValue)) {
                attributes.addAttribute("", relAttribute, relAttribute, "CDATA", nofollow);
            } else if (!relValue.contains(nofollow)) {
                attributes.setValue(relIndex, relValue + " " + nofollow);
            }
        }
    }
}