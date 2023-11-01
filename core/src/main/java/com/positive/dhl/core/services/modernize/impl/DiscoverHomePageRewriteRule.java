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

@Component(
        service = {StructureRewriteRule.class},
        configurationPolicy = ConfigurationPolicy.REQUIRE,
        property = {
                "service.ranking=10"
        }
)
@Designate(ocd = DiscoverPageRewriteRule.Config.class, factory = true)
@Slf4j
public class DiscoverHomePageRewriteRule extends DiscoverPageRewriteRuleCustomContentMigration {

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
    protected void initComponents(ResourceResolver resolver, @NotNull Node pageContent) throws RepositoryException {
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
