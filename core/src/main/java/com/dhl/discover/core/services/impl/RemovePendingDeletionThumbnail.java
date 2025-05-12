package com.dhl.discover.core.services.impl;

import com.day.cq.workflow.exec.WorkflowProcess;
import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Component;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

@Component(service = WorkflowProcess.class, property = {"process.label=Remove Pending Deletion Thumbnail"})
@Slf4j
public class RemovePendingDeletionThumbnail extends DeletionThumbnailWorkflowProcess{

    @Override
    protected void processContentNode(Node contentNode, String deletedImageReference, Session session) throws RepositoryException {
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
    }
}
