package com.dhl.discover.core.services.transformers;

import com.dhl.discover.core.services.PathUtilService;
import com.dhl.discover.core.utils.OSGiConfigUtils;
import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.List;

@Component(
        immediate = true,
        service = TransformerFactory.class,
        property = {
                "pipeline.type=discover-links"
        }
)
@Designate(ocd = LinkTransformerFactory.Configuration.class)
public class LinkTransformerFactory implements TransformerFactory {

    @Reference
    PathUtilService pathUtilService;

    private Set<Map.Entry<String, String>> rewriteElements = new HashSet<>();
    private List<String> whitelistedLinks = new ArrayList<>();

    @Override
    public Transformer createTransformer() {
        return new LinkTransformer(pathUtilService, rewriteElements, whitelistedLinks);
    }

    @Activate
    @Modified
    protected void activate(Configuration config) {
        rewriteElements = OSGiConfigUtils.arrayToEntrySetWithDelimiter(config.rewrite_elements());
        whitelistedLinks = List.of(config.whitelisted_links());
    }

    @ObjectClassDefinition(name = "Discover Link Transformer")
    @interface Configuration {
        @AttributeDefinition(
                name = "Rewrite Elements",
                description = "List of html elements and their attributes which are rewritten. Pleasse add each entry in the form {elementName}:{attributeName}. (linkcheckertransformer.rewriteElements)"
        )
        String[] rewrite_elements() default {};

        @AttributeDefinition(
                name = "WhiteListed Links",
                description = "List of regex of links that should be transformed"
        )
        String[] whitelisted_links() default {};
    }
}
