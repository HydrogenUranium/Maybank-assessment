package com.positive.dhl.core.services.modernize.impl;


import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;

import javax.jcr.query.Query;
import java.util.Iterator;

import static com.adobe.aem.modernize.model.ConversionJob.PN_PRE_MODERNIZE_VERSION;
import static com.day.cq.wcm.api.constants.NameConstants.PN_TEMPLATE;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.osgi.framework.Constants.SERVICE_DESCRIPTION;
import static org.osgi.framework.Constants.SERVICE_VENDOR;

@Component(
        service = WorkflowProcess.class,
        immediate = true,
        property = {
                "process.label=AEM Modernize Tools Rollback",
                SERVICE_VENDOR + "=Discover",
                SERVICE_DESCRIPTION + "=Custom rollback behaviour for template migration"
        }
)
public class ModernizeToolsRollbackWorkflowProcess implements WorkflowProcess {
    @Override
    public void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap) throws WorkflowException {
        var payloadPath = workItem.getWorkflowData().getPayload().toString();

        ResourceResolver resourceResolver = workflowSession.adaptTo(ResourceResolver.class);
        if (resourceResolver == null) {
            throw new WorkflowException("Resource Resolver is null");
        }

        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        if (pageManager == null) {
            throw new WorkflowException("Page Manager is null");
        }

        var rootPage = pageManager.getPage(payloadPath);
        if (rootPage == null) {
            throw new WorkflowException("Root Page is null");
        }

        String templateForRollback = rootPage.getProperties().get("modernizeToolsTemplateForRollback", String.class);
        if (isEmpty(templateForRollback)) {
            throw new WorkflowException("There is no template for rollback");
        }

        try {
            String rootTemplate = rootPage.getProperties().get(PN_TEMPLATE, String.class);
            if (StringUtils.equals(templateForRollback, rootTemplate)) {
                rollbackPage(pageManager, rootPage);
            }

            Iterator<Resource> resources = getPages(resourceResolver, payloadPath, templateForRollback);
            rollbackResources(pageManager, resources);
        } catch (WCMException e) {
            throw new WorkflowException("Failed to restore pages", e);
        }
    }

    private void rollbackResources(PageManager pageManager, Iterator<Resource> resources) throws WorkflowException, WCMException {
        while (resources.hasNext()) {
            Page page = resources.next().adaptTo(Page.class);
            if (page == null) {
                throw new WorkflowException("Page is null");
            }
            rollbackPage(pageManager, page);
        }
    }

    private void rollbackPage(PageManager pageManager, Page page) throws WCMException {
        String version = page.getProperties().get(PN_PRE_MODERNIZE_VERSION, String.class);
        String template = page.getProperties().get(PN_TEMPLATE, String.class);
        if (isEmpty(version) || isEmpty(template)) {
            return;
        }

        pageManager.restore(page.getPath(), version);
    }

    private Iterator<Resource> getPages(ResourceResolver resourceResolver, String rootPath, String template) {
        var query = String.format(
                "SELECT page.* FROM [cq:Page] AS page\n" +
                        "INNER JOIN [cq:PageContent] AS jcrcontent ON ISCHILDNODE(jcrcontent, page)\n" +
                        "WHERE ISDESCENDANTNODE(page, '%s')\n" +
                        "AND jcrcontent.[cq:template] = '%s'\n" +
                        "AND jcrcontent.[cq:premodernizeVersion] IS NOT NULL",
                rootPath, template);
        return resourceResolver.findResources(query, Query.JCR_SQL2);
    }
}
