package com.dhl.discover.core.services.impl;

import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import lombok.extern.slf4j.Slf4j;
import org.apache.jackrabbit.commons.JcrUtils;
import org.osgi.service.component.annotations.Component;

import javax.jcr.Node;
import javax.jcr.Session;

@Component(service = WorkflowProcess.class,
        property = {"process.label=Set Pending Deletion Thumbnail"})
@Slf4j
public class SetPendingDeletionThumbnail extends DeletionThumbnailWorkflowProcess {

    @Override
    public void execute(WorkItem item, WorkflowSession workflowSession, MetaDataMap args)
            throws WorkflowException {
        String contentNodePath = getContentNodePath(item);
        String deletedImageReference = getDeletedImageReference(args);

        try {
            Session session = workflowSession.getSession();
            if (session == null || !session.nodeExists(contentNodePath) || deletedImageReference == null) {
                log.warn("Skipping workflow process for path: {}. Session is null or node does not exist or deletedImageReference is null.", contentNodePath);
                return;
            }

            Node contentNode = session.getNode(contentNodePath);

            if (contentNode.hasNode(IMAGE_NODE_NAME)) {
                if (contentNode.hasNode(ORIGINAL_IMAGE_NODE_NAME)) {
                    contentNode.getNode(ORIGINAL_IMAGE_NODE_NAME).remove();
                }
                session.move(contentNode.getNode(IMAGE_NODE_NAME).getPath(), contentNode.getPath() + "/" + ORIGINAL_IMAGE_NODE_NAME);
            }

            Node newImage = JcrUtils.getOrCreateByPath(contentNode.getPath() + "/" + IMAGE_NODE_NAME,
                    false, "nt:unstructured", "nt:unstructured", session, true);

            newImage.setProperty(FILE_REFERENCE, deletedImageReference);

            session.save();
        } catch (Exception e) {
            throw new WorkflowException("Error replacing thumbnail", e);
        }
    }

}
