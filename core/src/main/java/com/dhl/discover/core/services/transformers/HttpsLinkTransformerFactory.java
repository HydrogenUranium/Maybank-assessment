package com.dhl.discover.core.services.transformers;

import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;

@Component(
        immediate = true,
        service = TransformerFactory.class,
        property = {
                "pipeline.type=https-transformer"
        }
)
@Designate(ocd = LinkTransformerFactory.Configuration.class)
public class HttpsLinkTransformerFactory implements TransformerFactory {

    @Override
    public Transformer createTransformer() {
        return new HttpsLinkTransformer();
    }
}
