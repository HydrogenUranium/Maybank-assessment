package com.positive.dhl.core.services.modernize.impl;

import com.adobe.aem.modernize.RewriteException;
import com.drew.lang.annotations.NotNull;
import com.drew.lang.annotations.Nullable;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.Set;

public abstract class DiscoverPageRewriteRuleCustomContentMigration extends DiscoverPageRewriteRule {
    @Override
    public @Nullable Node applyTo(@NotNull Node node, @NotNull Set<String> set) throws RewriteException, RepositoryException {
        var session = node.getSession();
        var resolver = resourceResolverHelper.getResourceResolver(session);
        var initialNode = session.getNode(editableTemplate + "/initial/jcr:content/root");

        Node pageContent = getPageContent(node);

        try {
            createVersion(session, pageContent.getParent());
            removeDesignPath(pageContent);
            resolver.copy(initialNode.getPath(), pageContent.getPath());

            for (String newContainerPath : containerMappings.values()) {
                initNodeStructure(pageContent, newContainerPath);
            }
            initComponents(resolver, pageContent);
            for(String oldContainerPath : containerMappings.keySet()) {
                pageContent.getNode(oldContainerPath).remove();
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
}
