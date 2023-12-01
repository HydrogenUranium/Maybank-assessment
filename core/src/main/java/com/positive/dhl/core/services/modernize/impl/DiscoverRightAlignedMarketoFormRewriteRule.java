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
import java.util.Map;

import static com.day.cq.wcm.api.constants.NameConstants.PN_TITLE;
import static com.positive.dhl.core.helpers.JcrNodeHelper.addLiveRelationshipMixinType;
import static com.positive.dhl.core.helpers.JcrNodeHelper.addLiveSyncCancelledMixinType;
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
public class DiscoverRightAlignedMarketoFormRewriteRule extends DiscoverPageRewriteRuleCustomContentMigration {

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
        for (Map.Entry<String, String> entry : containerMappings.entrySet()) {
            String staticContainerPath = entry.getKey();
            String dynamicContainerPath = entry.getValue();

            var oldContainerChildNodes = pageContent.getNode(staticContainerPath).getNodes();
            moveNodes(session, oldContainerChildNodes, PathUtils.concat(pageContent.getPath(), dynamicContainerPath));
        }
    }

    @Override
    protected void initComponents(ResourceResolver resolver, @NotNull Node pageContent) throws RepositoryException {
        Session session = resolver.adaptTo(Session.class);
        if (session == null) {
            throw new RepositoryException("Session is null");
        }

        copyNodes(pageContent, session);
        processContainerNodes(pageContent, session);
        initializeTitle(pageContent);
    }

    private void initializeTitle(Node pageContent) throws RepositoryException {
        var title = initNodeStructure(pageContent, "root/two_columns_container/headline/title_v2");
        title.setProperty("designMode", "bottomLeftUnderline");
        title.setProperty(PN_TITLE, pageContent.getProperty(PN_TITLE).getString());
        addLiveSyncCancelledMixinType(title);
    }

    private void processContainerNodes(Node pageContent, Session session) throws RepositoryException {
        processLeftContainerNode(pageContent, session);
        processRightContainerNode(pageContent, session);
    }

    private void processLeftContainerNode(Node pageContent, Session session) throws RepositoryException {
        var leftContainerNodes = pageContent.getNode("root/two_columns_container/left-column-body/responsivegrid").getNodes();
        while (leftContainerNodes.hasNext()) {
            var node = leftContainerNodes.nextNode();
            var resourceType = node.getProperty(SLING_RESOURCE_TYPE_PROPERTY).getString();

            if ("dhl/components/content/landingpoints".equals(resourceType)) {
                var target = PathUtils.concat(pageContent.getPath(), "root/two_columns_container/left-column-body/landingpoints");
                if (!session.nodeExists(target)) {
                    session.move(node.getPath(), target);
                }
            }
            if ("dhl/components/content/text".equals(resourceType)) {
                var target = PathUtils.concat(pageContent.getPath(), "root/two_columns_container/description/text");
                if (!session.nodeExists(target)) {
                    initNodeStructure(pageContent, "root/two_columns_container/description");
                    session.move(node.getPath(), target);
                }
            }
        }
    }

    private void processRightContainerNode(Node pageContent, Session session) throws RepositoryException {
        var rightContainerNodes = pageContent.getNode("root/two_columns_container/right-column-body/responsivegrid").getNodes();
        while (rightContainerNodes.hasNext()) {
            var node = rightContainerNodes.nextNode();
            if ("dhl/components/content/inlineshipnowmarketoconfigurable".equals(node.getProperty(SLING_RESOURCE_TYPE_PROPERTY).getString())) {
                var target = PathUtils.concat(pageContent.getPath(), "root/two_columns_container/right-column-body/marketoform");
                if (!session.nodeExists(target)) {
                    updateMarketoConfigurableNode(node);
                    session.move(node.getPath(), target);
                    initializeBanner(pageContent);
                }
            }
        }
    }

    private void initializeBanner(Node pageContent) throws RepositoryException {
        var bannerGray = initNodeStructure(pageContent, "root/two_columns_container/bottom/cta_banner_gray");
        bannerGray.setProperty("type", "individualShipper");
        addLiveRelationshipMixinType(bannerGray);
    }

    private void updateMarketoConfigurableNode(Node node) throws RepositoryException {
        node.setProperty(SLING_RESOURCE_TYPE_PROPERTY, "dhl/components/content/marketoForm");
        setPropertyIfEmpty(node, "marketoformid", "6412");
        setPropertyIfEmpty(node, "marketoid", "903-EZK-832");
        setPropertyIfEmpty(node, "marketohost", "https://express-resource.dhl.com");
        setPropertyIfEmpty(node, "marketohiddenformid", "6310");
        addLiveSyncCancelledMixinType(node);
    }

    private void setPropertyIfEmpty(Node node, String propertyName, String value) throws RepositoryException {
        if (!node.hasProperty(propertyName)) {
            node.setProperty(propertyName, value);
        }
    }
}
