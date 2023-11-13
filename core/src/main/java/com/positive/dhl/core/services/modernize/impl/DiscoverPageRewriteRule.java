package com.positive.dhl.core.services.modernize.impl;

import com.adobe.aem.modernize.RewriteException;
import com.adobe.aem.modernize.structure.StructureRewriteRule;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import com.drew.lang.annotations.NotNull;
import com.drew.lang.annotations.Nullable;
import com.positive.dhl.core.services.ResourceResolverHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.oak.commons.PathUtils;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.adobe.aem.modernize.model.ConversionJob.PN_PRE_MODERNIZE_VERSION;
import static com.day.cq.commons.jcr.JcrConstants.NT_UNSTRUCTURED;
import static com.day.cq.wcm.api.constants.NameConstants.*;
import static com.positive.dhl.core.helpers.OSGiConfigHelper.arrayToMapWithDelimiter;
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
public class DiscoverPageRewriteRule implements StructureRewriteRule {

    protected Map<String, String> containerMappings;
    protected String editableTemplate;
    protected String staticTemplate;
    protected String slingResourceType;
    protected String id;

    @Reference
    protected ResourceResolverHelper resourceResolverHelper;

    @Override
    public @NotNull Set<String> findMatches(@NotNull Resource resource) {
        Set<String> match = new HashSet<>();
        Page page = resource.adaptTo(Page.class);
        if (page == null) {
            return match;
        }
        var content = page.getContentResource();
        if (content == null) {
            return match;
        }
        var vm = content.getValueMap();
        if (StringUtils.equals(staticTemplate, vm.get(PN_TEMPLATE, String.class))) {
            match.add(resource.getPath());
        }
        return match;
    }

    @Override
    public boolean hasPattern(@NotNull String... slingResourceTypes) {
        return Arrays.asList(slingResourceTypes).contains(slingResourceType);
    }

    @Override
    public String getTitle() {
        return String.format("PageRewriteRule (%s -> %s)", staticTemplate, editableTemplate);
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public boolean matches(@NotNull Node node) throws RepositoryException {
        if (node.getPrimaryNodeType().isNodeType(NT_PAGE) && node.hasNode(NN_CONTENT)) {
            node = node.getNode(NN_CONTENT);
        }

        if (!node.hasProperty(SLING_RESOURCE_TYPE_PROPERTY)) {
            return false;
        }
        var template = "";
        if (node.hasProperty(PN_TEMPLATE)) {
            template = node.getProperty(PN_TEMPLATE).getString();
        }

        if (!StringUtils.equals(staticTemplate, template)) {
            return false;
        }

        var resourceType = node.getProperty(SLING_RESOURCE_TYPE_PROPERTY).getString();

        return StringUtils.equals(slingResourceType, resourceType) && pageNameFilter(node);
    }

    protected Node getPageContent(Node node) throws RepositoryException {
        if (node.getPrimaryNodeType().isNodeType(NT_PAGE)) {
            return node.getNode(NN_CONTENT);
        }
        return node;
    }

    protected void removeDesignPath(Node pageContent) throws RepositoryException {
        if (pageContent.hasProperty(PN_DESIGN_PATH)) {
            pageContent.getProperty(PN_DESIGN_PATH).remove();
        }
    }

    @Override
    public @Nullable Node applyTo(@NotNull Node node, @NotNull Set<String> set) throws RewriteException, RepositoryException {
        var session = node.getSession();
        var structureContentNode = getStructureNode(session);

        Node pageContent = getPageContent(node);
        removeDesignPath(pageContent);

        try {
            for (Map.Entry<String, String> entry : containerMappings.entrySet()) {
                String staticContainerPath = entry.getKey();
                String dynamicContainerPath = entry.getValue();

                if (!structureContentNode.hasNode(dynamicContainerPath)) {
                    throw new RepositoryException("Node: " + structureContentNode.getPath() + " doesn't contain " + dynamicContainerPath);
                }
                createVersion(session, pageContent.getParent());
                initNodeStructure(pageContent, dynamicContainerPath);

                var containerNode = pageContent.getNode(staticContainerPath);
                var containerChildNodes = containerNode.getNodes();
                moveNodes(session, containerChildNodes, PathUtils.concat(pageContent.getPath(), dynamicContainerPath));
                containerNode.remove();
            }

            changeTemplate(pageContent);
            session.save();
        } catch (Exception exception) {
            session.refresh(false);
            throw new RewriteException("Failed to process page migration ", exception);
        }
        return pageContent;
    }

    protected void createVersion(Session session, Node pageNode) throws WCMException, RepositoryException {
        var resourceResolver = resourceResolverHelper.getResourceResolver(session);
        if (resourceResolver == null) {
            throw new WCMException("Resource Resolver is null");
        }

        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        if (pageManager == null) {
            throw new WCMException("Page Manager is null");
        }

        var page = pageManager.getPage(pageNode.getPath());
        String date = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss.SSS").format(new Date());
        var label = String.format("%s - %s", "Pre-Modernization", date);
        var revision = pageManager.createRevision(page, label, "Version of content before the modernization process was performed.");
        ModifiableValueMap mvm = page.getContentResource().adaptTo(ModifiableValueMap.class);
        if (mvm == null) {
            throw new WCMException("Page content is null");
        }
        mvm.put(PN_PAGE_LAST_MOD, Calendar.getInstance());
        mvm.put(PN_PRE_MODERNIZE_VERSION, revision.getId());
    }

    protected Node getStructureNode(Session session) throws RepositoryException {
        return session.getNode(editableTemplate + "/structure/jcr:content");
    }

    protected Node initNodeStructure(Node rootNode, String containerPath) throws RepositoryException {
        var structureNode = getStructureNode(rootNode.getSession());
        var node = rootNode;
        for (String nodeName : containerPath.split("/")) {
            structureNode = structureNode.getNode(nodeName);
            if (node.hasNode(nodeName)) {
                node = node.getNode(nodeName);
            } else {
                node = node.addNode(nodeName, NT_UNSTRUCTURED);
                node.setProperty(SLING_RESOURCE_TYPE_PROPERTY, structureNode.getProperty(SLING_RESOURCE_TYPE_PROPERTY).getString());
            }
        }
        return node;
    }

    protected void moveNodes(Session session, NodeIterator nodes, String target) throws RepositoryException {
        while (nodes.hasNext()) {
            var child = nodes.nextNode();
            String oldPath = child.getPath();
            String newPath = PathUtils.concat(target, child.getName());
            session.move(oldPath, newPath);
        }
    }

    protected void changeTemplate(Node node) throws RepositoryException, RewriteException {
        node.setProperty(NN_TEMPLATE, editableTemplate);
        String newResourceType = getResourceType(node.getSession());
        node.setProperty(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY, newResourceType);
    }

    protected String getResourceType(Session session) throws RewriteException, RepositoryException {

        String path = PathUtils.concat(editableTemplate, "structure", NN_CONTENT);
        if (!session.nodeExists(path)) {
            throw new RewriteException("Unable to find Editable Template: " + editableTemplate);
        }
        var structure = session.getNode(path);
        if (!structure.hasProperty(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY)) {
            throw new RewriteException("Unable to find sling:resourceType on template structure: " + path);
        }
        return structure.getProperty(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY).getString();
    }

    protected boolean pageNameFilter(Node node) throws RepositoryException {
        return !StringUtils.isBlank(node.getParent().getName());
    }

    @Activate
    @Modified
    protected void activate(Config config) {
        containerMappings = arrayToMapWithDelimiter(config.containerMappings());
        editableTemplate = config.editableTemplate();
        staticTemplate = config.staticTemplate();
        slingResourceType = config.slingResourceType();
        id = config.id();
    }

    @ObjectClassDefinition(
            name = "AEM Modernize Tools - Discover Page Rewrite Rule"
    )
    @interface Config {
        @AttributeDefinition(
                name = "Static Template",
                description = "The static template which will be updated by this Page Rewrite Rule"
        )
        String staticTemplate();

        @AttributeDefinition(
                name = "Sling Resource Type",
                description = "The resource type to match on a page for this rule to apply."
        )
        String slingResourceType();

        @AttributeDefinition(
                name = "Editable Template",
                description = "The value to update the cq:template with, this should be the new Editable Template.")
        String editableTemplate();

        @AttributeDefinition(
                name = "Container mappings",
                description = "Specify mappings between static template containers and editable template containers. " +
                        "Components from static template container will be moved to editable template container. " +
                        "Follow this template <container path in static template>:<container path in editable template>"
        )
        String[] containerMappings();

        @AttributeDefinition(name = "Id")
        String id();

    }
}
