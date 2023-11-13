package com.positive.dhl.core.services.modernize.impl;

import com.adobe.aem.modernize.RewriteException;
import com.drew.lang.annotations.NotNull;
import com.drew.lang.annotations.Nullable;
import org.apache.jackrabbit.oak.commons.PathUtils;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.Map;
import java.util.Set;

public abstract class DiscoverPageRewriteRuleCustomContentMigration extends DiscoverPageRewriteRule {
    @Override
    public @Nullable Node applyTo(@NotNull Node node, @NotNull Set<String> set) throws RewriteException, RepositoryException {
        var session = node.getSession();
        var resolver = resourceResolverHelper.getResourceResolver(session);
        var structureNode = session.getNode(editableTemplate + "/structure/jcr:content");

        Node pageContent = getPageContent(node);
        removeDesignPath(pageContent);

        try {
            for (Map.Entry<String, String> entry : containerMappings.entrySet()) {
                String staticContainerPath = entry.getKey();
                String dynamicContainerPath = entry.getValue();

                createVersion(session, pageContent.getParent());
                initContainer(pageContent, structureNode, dynamicContainerPath);

                var oldContainerNode = pageContent.getNode(staticContainerPath);
                String initSource = PathUtils.concat(editableTemplate, "initial/jcr:content/root");
                String destination = PathUtils.concat(pageContent.getPath(), "root");
                session.getWorkspace().copy(initSource, destination);

                if (isCopyOldNodes()) {
                    moveNodes(session, oldContainerNode.getNodes(), PathUtils.concat(pageContent.getPath(), dynamicContainerPath));
                }

                initComponents(resolver, pageContent);

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

    protected abstract void initComponents(ResourceResolver resolver, @NotNull Node pageContent) throws RepositoryException;

    protected boolean isCopyOldNodes() {
        return false;
    }
}
