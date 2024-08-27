package com.positive.dhl.core.services.modernize.impl;

import com.adobe.aem.modernize.structure.StructureRewriteRule;
import com.drew.lang.annotations.NotNull;
import com.positive.dhl.core.services.ResourceResolverHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.jackrabbit.oak.commons.PathUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.Designate;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import java.util.List;
import java.util.Map;

import static com.positive.dhl.core.utils.JcrNodeUtils.addLiveRelationshipMixinType;
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
public class DiscoverThankYouPageRewriteRule extends DiscoverPageRewriteRuleCustomContentMigration {
    @Reference
    protected ResourceResolverHelper resourceResolverHelperService;

    @Modified
    @Activate
    protected void init(Config configuration) {
        super.resourceResolverHelper = resourceResolverHelperService;
        super.activate(configuration);

        super.filters = List.of(node -> {
            try {
                return node.getParent().getName().toLowerCase().contains("thank");
            } catch (RepositoryException e) {
                return false;
            }
        });
    }

    @Override
    protected void initComponents(ResourceResolver resolver, @NotNull Node pageContent) throws RepositoryException {
        Session session = getSession(resolver);

        for (Map.Entry<String, String> entry : containerMappings.entrySet()) {
            String staticContainerPath = entry.getKey();
            String dynamicContainerPath = entry.getValue();

            var oldContainerChildNodes = pageContent.getNode(staticContainerPath).getNodes();
            moveNodes(session, oldContainerChildNodes, PathUtils.concat(pageContent.getPath(), dynamicContainerPath));
        }

        var newRootComponentPath = "root/container";
        var oldRootComponentResource = resolver.getResource(pageContent.getPath() + "/par");
        if (oldRootComponentResource == null) {
            return;
        }

        var textLineSeparatorNode = pageContent.addNode(newRootComponentPath + "/text_lineSeparator");
        textLineSeparatorNode.setProperty(SLING_RESOURCE_TYPE_PROPERTY, "dhl/components/content/text");
        textLineSeparatorNode.setProperty("text", "<hr>");
        textLineSeparatorNode.setProperty("textIsRich", "true");
        addLiveRelationshipMixinType(textLineSeparatorNode);

        var followUsNode = pageContent.addNode(newRootComponentPath + "/followUs");
        followUsNode.setProperty(SLING_RESOURCE_TYPE_PROPERTY, "dhl/components/content/followUs");
        addLiveRelationshipMixinType(followUsNode);
    }
}
