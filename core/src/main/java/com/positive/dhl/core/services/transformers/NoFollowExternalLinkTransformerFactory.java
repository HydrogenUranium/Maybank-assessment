package com.positive.dhl.core.services.transformers;

import com.positive.dhl.core.services.PathUtilService;
import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;

@Component(
        immediate = true,
        service = TransformerFactory.class,
        property = {
                "pipeline.type=nofollow-external-links"
        }
)
@Designate(ocd = LinkTransformerFactory.Configuration.class)
public class NoFollowExternalLinkTransformerFactory implements TransformerFactory {

    @Reference
    PathUtilService pathUtilService;

    @Override
    public Transformer createTransformer() {
        return new NoFollowExternalLinkTransformer(pathUtilService);
    }
}
