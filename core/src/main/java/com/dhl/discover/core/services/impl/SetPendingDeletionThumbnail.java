package com.dhl.discover.core.services.impl;

import com.day.cq.workflow.exec.WorkflowProcess;
import lombok.extern.slf4j.Slf4j;
import org.apache.jackrabbit.commons.JcrUtils;
import org.osgi.service.component.annotations.Component;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

@Component(service = WorkflowProcess.class,
        property = {"process.label=Set Pending Deletion Thumbnail"})
@Slf4j
public class SetPendingDeletionThumbnail extends DeletionThumbnailWorkflowProcess {

    @Override
    protected void processContentNode(Node contentNode, String deletedImageReference, Session session) throws RepositoryException {
        if (contentNode.hasNode(IMAGE_NODE_NAME)) {
            if (contentNode.hasNode(ORIGINAL_IMAGE_NODE_NAME)) {
                contentNode.getNode(ORIGINAL_IMAGE_NODE_NAME).remove();
            }
            session.move(contentNode.getNode(IMAGE_NODE_NAME).getPath(), contentNode.getPath() + "/" + ORIGINAL_IMAGE_NODE_NAME);
        }

        Node newImage = JcrUtils.getOrCreateByPath(contentNode.getPath() + "/" + IMAGE_NODE_NAME,
                false, "nt:unstructured", "nt:unstructured", session, true);

        newImage.setProperty(FILE_REFERENCE, deletedImageReference);
    }
}
