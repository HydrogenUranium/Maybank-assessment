package com.dhl.discover.core.services.impl;

import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.dhl.discover.core.utils.OSGiConfigUtils;
import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Component;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Map;

@Component(service = WorkflowProcess.class, property = {"process.label=Remove Pending Deletion Thumbnail"})
@Slf4j
public class RemovePendingDeletionThumbnail extends DeletionThumbnailWorkflowProcess{

    @Override
    public void execute(WorkItem item, WorkflowSession workflowSession, MetaDataMap args) throws WorkflowException {
        String contentNodePath = getContentNodePath(item);
        String deletedImageReference = getDeletedImageReference(args);

        try {
            Session session = workflowSession.getSession();
            if (session == null || !session.nodeExists(contentNodePath) || deletedImageReference == null) {
                log.warn("Skipping workflow process for path: {}. Session is null or node does not exist or deletedImageReference is null.", contentNodePath);
                return;
            }

            Node contentNode = session.getNode(contentNodePath);

            boolean originalExists = contentNode.hasNode(ORIGINAL_IMAGE_NODE_NAME);

            if (originalExists) {
                if (contentNode.hasNode(IMAGE_NODE_NAME)) {
                    contentNode.getNode(IMAGE_NODE_NAME).remove();
                }

                Node originalImage = contentNode.getNode(ORIGINAL_IMAGE_NODE_NAME);
                session.move(originalImage.getPath(), contentNode.getPath() + "/" + IMAGE_NODE_NAME);

            } else if (contentNode.hasNode(IMAGE_NODE_NAME)) {
                Node imageNode = contentNode.getNode(IMAGE_NODE_NAME);

                if (imageNode.hasProperty(FILE_REFERENCE)) {
                    String fileRef = imageNode.getProperty(FILE_REFERENCE).getString();
                    if (deletedImageReference.equals(fileRef)) {
                        imageNode.remove();
                    }
                }
            }

            session.save();

        } catch (RepositoryException e) {
            throw new WorkflowException("Error processing FixPageThumbnailWorkflow at: " + item.getWorkflowData().getPayload(), e);
        }
    }
}
