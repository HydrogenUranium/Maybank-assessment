package com.positive.dhl.core.services.modernize.impl;

import com.adobe.aem.modernize.structure.StructureRewriteRule;
import com.drew.lang.annotations.NotNull;
import com.positive.dhl.core.services.ResourceResolverHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.Designate;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.ArrayList;
import java.util.List;

import static org.apache.sling.jcr.resource.api.JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY;

@Component(
        service = {StructureRewriteRule.class},
        configurationPolicy = ConfigurationPolicy.REQUIRE,
        property = {
                "service.ranking=10"
        }
)
@Designate(ocd = DiscoverPageRewriteRule.Config.class, factory = true)
@Slf4j
public class DiscoverStandardPageRewriteRule extends DiscoverPageRewriteRuleCustomContentMigration {
    @Reference
    protected ResourceResolverHelper resourceResolverHelperService;

    @Modified
    @Activate
    protected void init(Config configuration) {
        super.resourceResolverHelper = resourceResolverHelperService;
        super.activate(configuration);
    }

    @Override
    protected void initComponents(ResourceResolver resolver, @NotNull Node pageContent) throws RepositoryException {
        var newRootComponentPath = "root/container";
        var oldRootComponentResource = resolver.getResource(pageContent.getPath() + "/par");
        if (oldRootComponentResource == null) {
            return;
        }
        List<String> texts = new ArrayList<>();
        oldRootComponentResource.getChildren().forEach(resource -> {
            var valueMap = resource.getValueMap();
            if(valueMap.containsKey("text")) {
                texts.add(valueMap.get("text", String.class));
            }
        });
        for(var i = 0; i < texts.size(); i++) {
            var node = pageContent.addNode(newRootComponentPath + "/text_" + i);
            node.setProperty(SLING_RESOURCE_TYPE_PROPERTY, "dhl/components/content/textV2");
            node.setProperty("text", texts.get(i));
            node.setProperty("textIsRich", "true");
        }

        if (pageContent.getParent().getName().toLowerCase().contains("thank")) {
            var node = pageContent.addNode(newRootComponentPath + "/followUs");
            node.setProperty(SLING_RESOURCE_TYPE_PROPERTY, "dhl/components/content/followUs");
        }
    }
}
