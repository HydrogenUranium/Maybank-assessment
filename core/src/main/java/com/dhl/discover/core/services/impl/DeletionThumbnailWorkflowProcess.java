package com.dhl.discover.core.services.impl;

import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.dhl.discover.core.utils.OSGiConfigUtils;
import lombok.extern.slf4j.Slf4j;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Map;

@Slf4j
public abstract class DeletionThumbnailWorkflowProcess implements WorkflowProcess {
    protected static final String ORIGINAL_IMAGE_NODE_NAME = "original-image";
    protected static final String IMAGE_NODE_NAME = "image";
    protected static final String FILE_REFERENCE = "fileReference";
    protected static final String DELETED_IMAGE_REFERENCE = "deletedImageReference";

    protected Map<String, String> getConfig(MetaDataMap args) {
        return OSGiConfigUtils.arrayToMapWithDelimiter(args.get("PROCESS_ARGS", "").split("\\R"));
    }

    protected String getDeletedImageReference(MetaDataMap args) {
        return getConfig(args).get(DELETED_IMAGE_REFERENCE);
    }

    protected String getPayloadPath(WorkItem item) {
        return item.getWorkflowData().getPayload().toString();
    }

    protected String getContentNodePath(WorkItem item) {
        return getPayloadPath(item) + "/jcr:content";
    }

    @Override
    public void execute(WorkItem item, WorkflowSession workflowSession, MetaDataMap args) throws WorkflowException {
        String contentNodePath = getContentNodePath(item);
        String deletedImageReference = getDeletedImageReference(args);

        try {
            var session = workflowSession.getSession();
            if (session == null || !session.nodeExists(contentNodePath) || deletedImageReference == null) {
                log.warn("Skipping workflow process for path: {}. Session is null or node does not exist or deletedImageReference is null.", contentNodePath);
                return;
            }

            var contentNode = session.getNode(contentNodePath);

            processContentNode(contentNode, deletedImageReference, session);

            session.save();
        } catch (RepositoryException e) {
            throw new WorkflowException("Error processing FixPageThumbnailWorkflow at: " + item.getWorkflowData().getPayload(), e);
        }
    }

    protected abstract void processContentNode(Node contentNode, String deletedImageReference, Session session) throws RepositoryException;

}
