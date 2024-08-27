package com.positive.dhl.core.services.modernize.impl;

import com.adobe.aem.modernize.structure.StructureRewriteRule;
import com.drew.lang.annotations.NotNull;
import com.positive.dhl.core.services.ResourceResolverHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.oak.commons.PathUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.Designate;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Map;

import static com.day.cq.wcm.api.constants.NameConstants.PN_TITLE;
import static com.positive.dhl.core.utils.JcrNodeUtils.addLiveSyncCancelledMixinType;

@Component(
        service = {StructureRewriteRule.class},
        configurationPolicy = ConfigurationPolicy.REQUIRE,
        property = {
                "service.ranking=10"
        }
)
@Designate(ocd = DiscoverPageRewriteRule.Config.class, factory = true)
@Slf4j
public class DiscoverCategoryToLandingRewriteRule extends DiscoverPageRewriteRuleCustomContentMigration {

    @Reference
    protected ResourceResolverHelper resolverHelper;

    @Activate
    @Modified
    @Override
    protected void activate(DiscoverPageRewriteRule.Config config) {
        super.activate(config);
        super.resourceResolverHelper = resolverHelper;
    }

    private void copyNodes(Node pageContent, Session session) throws RepositoryException {
        if (pageContent.hasNode("title")) {
            var title = pageContent.getNode("title");
            moveNode(session, title, PathUtils.concat(pageContent.getPath(),"root/column_container/first-container/responsivegrid"));
        }
        for (Map.Entry<String, String> entry : containerMappings.entrySet()) {
            var oldContainerComponents = pageContent.getNode(entry.getKey()).getNodes();
            moveNodes(session, oldContainerComponents, PathUtils.concat(pageContent.getPath(), entry.getValue()));
        }
    }

    @Override
    protected void initComponents(ResourceResolver resolver, @NotNull Node pageContent) throws RepositoryException {
        Session session = getSession(resolver);

        initializeTitle(pageContent);
        copyNodes(pageContent, session);
    }

    private void initializeTitle(Node pageContent) throws RepositoryException {
        var grid = initNodeStructure(pageContent, "root/column_container/first-container/responsivegrid");
        var title = grid.addNode("title_v2");
        title.setProperty("sling:resourceType", "dhl/components/content/title-v2");
        title.setProperty("type", "h1");
        title.setProperty("designMode", "bottomLeftUnderline");
        title.setProperty(PN_TITLE, pageContent.hasProperty("navTitle")
                ? StringUtils.upperCase(pageContent.getProperty("navTitle").getString())
                : "");
        addLiveSyncCancelledMixinType(title);
    }
}
