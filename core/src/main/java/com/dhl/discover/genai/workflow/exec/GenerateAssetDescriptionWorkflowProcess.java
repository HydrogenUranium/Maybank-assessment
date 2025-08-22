package com.dhl.discover.genai.workflow.exec;

import com.day.cq.dam.api.Asset;
import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.service.AssetDescriptionService;
import com.drew.lang.annotations.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import static com.day.cq.dam.api.DamConstants.DC_DESCRIPTION;

@Component(service = WorkflowProcess.class, property = {"process.label=Generate Image Description"})
@Slf4j
public class GenerateAssetDescriptionWorkflowProcess implements WorkflowProcess {
    public static final String DESCRIPTION_SOURCE = "descriptionSource";

    @Reference
    private AssetDescriptionService assetDescriptionService;

    @Reference
    private AssetUtilService assetUtilService;

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    @Override
    public void execute(WorkItem item, WorkflowSession workflowSession, MetaDataMap args) throws WorkflowException {
        String payloadPath = getPayloadPath(item);
        if (!isValidPayload(payloadPath)) {
            throw new WorkflowException("Invalid payload path: " + payloadPath);
        }

        try {
            var session = workflowSession.getSession();
            var metadataNode = getMetadata(session, payloadPath);
            if(metadataNode.hasProperty(DC_DESCRIPTION)) {
                log.debug("Skipp asset description generation since the description already exists at: {}", payloadPath);
                return;
            }
            var asset = getAsset(payloadPath);
            metadataNode.setProperty(DC_DESCRIPTION, assetDescriptionService.generateDescription(asset));
            metadataNode.setProperty(DESCRIPTION_SOURCE, "AI");
            session.save();
        } catch (RepositoryException e) {
            log.warn("Error processing GenerateAssetDescriptionWorkflow at: {}", item.getWorkflowData().getPayload(), e);
        } catch (AiException e) {
            log.warn("Error generating asset description for: {}", item.getWorkflowData().getPayload(), e);
        }
    }

    private boolean isValidPayload(String payloadPath) {
        if( payloadPath == null || payloadPath.isEmpty() ){
            return false;
        }
        var asset = getAsset(payloadPath);

        return asset.getMimeType().contains("image");
    }

    private String getPayloadPath(WorkItem item) {
        return item.getWorkflowData().getPayload().toString();
    }

    private Asset getAsset(String path) {
        var resourceResolver = resourceResolverHelper.getReadResourceResolver();
        return assetUtilService.getAsset(path, resourceResolver);
    }

    private @NotNull Node getMetadata(Session session, String payload) throws RepositoryException {
        var metadataPath = payload + "/jcr:content/metadata";
        if (!session.nodeExists(metadataPath)) {
            throw new RepositoryException("Metadata node does not exist at path: " + metadataPath);
        }

        return session.getNode(metadataPath);
    }
}
