package com.dhl.discover.core.workflow.exec;

import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import org.osgi.service.component.annotations.Component;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

@Component(service = WorkflowProcess.class, property = {"process.label=Remove Deleted Page property"})
public class RemoveDeletedPageProperties implements WorkflowProcess{

    private void removeProperty(Node node, String propertyName) throws RepositoryException {
        if (node.hasProperty(propertyName)) {
            node.getProperty(propertyName).remove();
        }
    }

    @Override
    public void execute(WorkItem item, WorkflowSession workflowSession, MetaDataMap args) throws WorkflowException {
        var payloadPath = item.getWorkflowData().getPayload().toString();
        var contentNodePath = payloadPath + "/jcr:content";
        try {
            var session = workflowSession.getSession();
            if (session == null || !session.nodeExists(contentNodePath)) {
                return;
            }
            var contentNode = session.getNode(contentNodePath);
            removeProperty(contentNode, "deleted");
            removeProperty(contentNode, "deletedBy");

            session.save();
        } catch (RepositoryException e) {
            throw new WorkflowException("Failed to undelete page at: " + payloadPath, e);
        }
    }
}
