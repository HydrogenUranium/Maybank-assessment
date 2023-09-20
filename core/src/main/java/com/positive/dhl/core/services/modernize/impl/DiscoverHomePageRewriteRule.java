package com.positive.dhl.core.services.modernize.impl;

import com.adobe.aem.modernize.RewriteException;
import com.adobe.aem.modernize.structure.StructureRewriteRule;
import com.drew.lang.annotations.NotNull;
import com.drew.lang.annotations.Nullable;
import com.positive.dhl.core.services.ResourceResolverHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.jackrabbit.oak.commons.PathUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.Designate;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component(
        service = {StructureRewriteRule.class},
        configurationPolicy = ConfigurationPolicy.REQUIRE,
        property = {
                "service.ranking=10"
        }
)
@Designate(ocd = DiscoverPageRewriteRule.Config.class, factory = true)
@Slf4j
public class DiscoverHomePageRewriteRule extends DiscoverPageRewriteRule {

    @Reference
    protected ResourceResolverHelper resolverHelper;

    @Activate
    @Modified
    @Override
    protected void activate(Config config) {
        super.activate(config);
        super.resourceResolverHelper = resolverHelper;
    }

    @Override
    public @Nullable Node applyTo(@NotNull Node node, @NotNull Set<String> set) throws RewriteException, RepositoryException {
        var session = node.getSession();
        var resolver = resourceResolverHelper.getResourceResolver(session);
        var structureNode = session.getNode(editableTemplate + "/structure/jcr:content");

        Node pageContent = getPageContent(node);
        removeDesignPath(pageContent);

        try {
            for (Map.Entry<String, String> entry : containerMappings.entrySet()) {
                createVersion(session, pageContent.getParent());
                initContainer(pageContent, structureNode, entry.getValue());

                var oldContainerNode = pageContent.getNode(entry.getKey());
                String initSource = PathUtils.concat(editableTemplate, "initial/jcr:content/root");
                String destination = PathUtils.concat(pageContent.getPath(), "root");
                session.getWorkspace().copy(initSource, destination);

                initTopTiles(resolver, pageContent);

                oldContainerNode.remove();
            }

            changeTemplate(pageContent);
            session.save();
        } catch (Exception exception) {
            session.refresh(false);
            throw new RewriteException("Failed to process page migration ", exception);
        }
        return pageContent;
    }

    private void initTopTiles(ResourceResolver resolver, @NotNull Node pageContent) throws RepositoryException {
        var topTilesPath = "root/responsivegrid/top_tiles/articles";
        var carouselItemsResource = resolver.getResource(pageContent.getPath() + "/par/homepagecarousel_cop/items");
        if (carouselItemsResource == null) {
            return;
        }
        List<String> paths = new ArrayList<>();
        carouselItemsResource.getChildren().forEach(resource -> {
            var valueMap = resource.getValueMap();
            if(valueMap.containsKey("ctapath")) {
                paths.add(valueMap.get("ctapath", String.class));
            }
        });
        for(var i = 0; i < paths.size(); i++) {
            var node = pageContent.addNode(topTilesPath + "/item" + i);
            node.setProperty("articlePath", paths.get(i));
        }
    }
}
