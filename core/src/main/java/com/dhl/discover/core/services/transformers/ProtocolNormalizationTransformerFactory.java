package com.dhl.discover.core.services.transformers;

import com.dhl.discover.core.services.PathUtilService;
import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;

@Component(
        immediate = true,
        service = TransformerFactory.class,
        property = {
                "pipeline.type=protocol-normalization"
        }
)
@Designate(ocd = LinkTransformerFactory.Configuration.class)
public class ProtocolNormalizationTransformerFactory implements TransformerFactory {

    @Override
    public Transformer createTransformer() {
        return new NoFollowExternalLinkTransformer();
    }
}
