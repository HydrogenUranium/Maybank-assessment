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
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class LinkTransformer extends DefaultTransformer implements Transformer {
    private final PathUtilService pathUtilService;
    private final Set<Map.Entry<String, String>> rewriteElements;
    private final List<String> whitelistedLinks;

    @Override
    public void init(ProcessingContext context, ProcessingComponentConfiguration configuration) throws IOException {
        //default implementation ignored
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, modifyAttributes(qName, attributes));
    }

    public Attributes modifyAttributes(String qName, Attributes attributes) {
        var modifiedAttributes = new AttributesImpl(attributes);
        rewriteElements.stream()
                .filter(entry -> StringUtils.equals(entry.getKey() ,qName.toLowerCase()))
                .forEach(entry -> processEntry(entry, modifiedAttributes));
        return modifiedAttributes;
    }

    private void processEntry(Map.Entry<String, String> entry, AttributesImpl attributes) {
        String attribute = entry.getValue();
        int index = attributes.getIndex(attribute);

        if(index < 0) {
            return;
        }

        String original = attributes.getValue(attribute);
        String mapped = mapLinks(original);
        attributes.setValue(index, mapped);
    }

    private String mapLinks(String original) {
        if (!original.contains(",")) {
            return isInWhitelist(original)
                    ? pathUtilService.map(original)
                    : original;
        }

        // multiple URIs (e.g. srcset)
        return Arrays.stream(original.split(","))
                .map(String::trim)
                .map(item -> {
                    // split URL from descriptor ("200w", "2x", etc.)
                    int space = item.indexOf(' ');
                    String url        = space < 0 ? item : item.substring(0, space);
                    String descriptor = space < 0 ? ""   : item.substring(space);

                    if (isInWhitelist(url)) {
                        url = pathUtilService.map(url);
                    }
                    return url + descriptor;
                })
                .collect(Collectors.joining(", "));
    }

    private boolean isInWhitelist(String uri) {
        return whitelistedLinks.stream().anyMatch(uri::matches);
    }
}