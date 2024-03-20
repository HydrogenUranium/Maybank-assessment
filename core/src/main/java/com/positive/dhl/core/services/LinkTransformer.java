package com.positive.dhl.core.services;

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
import java.util.List;
import java.util.Map;
import java.util.Set;

@RequiredArgsConstructor
public class LinkTransformer extends DefaultTransformer implements Transformer {
    private final ResourceResolverHelper resourceResolverHelper;
    private final PathUtilService pathUtilService;
    private final Set<Map.Entry<String, String>> rewriteElements;
    private final List<String> whitelistedLinks;

    @Override
    public void init(ProcessingContext context, ProcessingComponentConfiguration configuration) throws IOException {
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, modifyAttributes(uri, qName, attributes));
    }

    private Attributes modifyAttributes(String uri, String qName, Attributes attributes) {
        AttributesImpl modifiedAttributes = new AttributesImpl(attributes);
        rewriteElements.stream()
                .filter(entry -> StringUtils.equals(entry.getKey() ,qName.toLowerCase()))
                .forEach(entry -> processEntry(entry, modifiedAttributes));
        return modifiedAttributes;
    }

    private void processEntry(Map.Entry<String, String> entry, AttributesImpl attributes) {
        String attribute = entry.getValue();

        if(attributes.getIndex(attribute) == -1) {
            return;
        }

        String original = attributes.getValue(attribute);

        if(isInWhitelist(original)) {
            String resolved = pathUtilService.map(original);
            attributes.setValue(attributes.getIndex(attribute), resolved);
        }
    }

    private boolean isInWhitelist(String uri) {
        return whitelistedLinks.stream().anyMatch(uri::matches);
    }
}