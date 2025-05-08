package com.dhl.discover.core.services.impl;

import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.metadata.MetaDataMap;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Session;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class RemoveDeletedPagePropertiesTest {

    private AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);
    private Session session;
    private RemoveDeletedPageProperties workflowProcess;
    private Resource pageContentResource;

    @Mock
    private WorkflowSession workflowSession;
    @Mock
    private WorkItem workItem;
    @Mock
    private WorkflowData workflowData;
    @Mock
    private MetaDataMap metaDataMap;

    @BeforeEach
    void setUp() {
        session = context.resourceResolver().adaptTo(Session.class);
        workflowProcess = new RemoveDeletedPageProperties();

        pageContentResource = context.create().resource("/content/page/jcr:content",
                "deleted", "true",
                "deletedBy", "admin");

        when(workItem.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn("/content/page");
        when(workflowSession.getSession()).thenReturn(session);
    }

    @Test
    void testExecute_removesProperties() throws WorkflowException {
        ValueMap valueMap = pageContentResource.getValueMap();
        assertTrue(valueMap.containsKey("deleted"));
        assertTrue(valueMap.containsKey("deletedBy"));

        workflowProcess.execute(workItem, workflowSession, metaDataMap);

        valueMap = pageContentResource.getValueMap();
        assertFalse(valueMap.containsKey("deleted"));
        assertFalse(valueMap.containsKey("deletedBy"));
    }

    @Test
    void testExecute_nodeMissing_noError() {
        when(workflowData.getPayload()).thenReturn("/content/missing");

        assertDoesNotThrow(() ->
                workflowProcess.execute(workItem, workflowSession, metaDataMap)
        );
    }

    @Test
    void testExecute_sessionThrowsException() throws Exception {
        Session badSession = mock(Session.class);
        when(workflowSession.getSession()).thenReturn(badSession);
        when(badSession.nodeExists(anyString())).thenThrow(new javax.jcr.RepositoryException("JCR Exception"));

        assertThrows(WorkflowException.class, () ->
                workflowProcess.execute(workItem, workflowSession, metaDataMap)
        );
    }
}
