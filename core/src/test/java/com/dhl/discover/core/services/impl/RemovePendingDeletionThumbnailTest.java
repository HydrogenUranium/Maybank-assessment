package com.dhl.discover.core.services.impl;

import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.metadata.MetaDataMap;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class RemovePendingDeletionThumbnailTest {
    private static final String DELETED_IMAGE_REFERENCE = "/pending-deletion.png";
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private RemovePendingDeletionThumbnail workflowProcess;
    private ResourceResolver resourceResolver;

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
        workflowProcess = new RemovePendingDeletionThumbnail();
        resourceResolver = context.resourceResolver();

        when(metaDataMap.get("PROCESS_ARGS", "")).thenReturn(
            "deletedImageReference:" + DELETED_IMAGE_REFERENCE
        );

        when(workItem.getWorkflowData()).thenReturn(workflowData);
        when(workflowSession.getSession()).thenReturn(resourceResolver.adaptTo(Session.class));
        when(workItem.getWorkflowData()).thenReturn(workflowData);
        when(workflowSession.getSession()).thenReturn(resourceResolver.adaptTo(Session.class));
    }

    @Test
    void testExecute_originalImageExists_movesImage() throws Exception {
        context.create().resource("/content/page/jcr:content/original-image",
                Map.of("fileReference", "/original-image.png"));
        context.create().resource("/content/page/jcr:content/image",
                Map.of("fileReference", "/image.png"));
        when(workflowData.getPayload()).thenReturn("/content/page");

        workflowProcess.execute(workItem, workflowSession, metaDataMap);

        Resource imageResource = resourceResolver.getResource("/content/page/jcr:content/image");
        Resource originalImageResource = resourceResolver.getResource("/content/page/jcr:content/original-image");

        assertNotNull(imageResource);
        assertEquals("/original-image.png", imageResource.getValueMap().get("fileReference"));
        assertNull(originalImageResource);
    }

    @Test
    void testExecute_deletedImageReference_removesImage() throws Exception {
        context.create().resource("/content/page/jcr:content/image",
                "fileReference", DELETED_IMAGE_REFERENCE);

        when(workflowData.getPayload()).thenReturn("/content/page");

        workflowProcess.execute(workItem, workflowSession, metaDataMap);

        assertNull(resourceResolver.getResource("/content/page/jcr:content/image"));
    }

    @Test
    void testExecute_nodeMissing_noError() {
        when(workflowData.getPayload()).thenReturn("/content/does-not-exist");

        assertDoesNotThrow(() -> workflowProcess.execute(workItem, workflowSession, metaDataMap));
    }

    @Test
    void testExecute_sessionThrowsException() throws Exception {
        Session badSession = mock(Session.class);
        when(workflowSession.getSession()).thenReturn(badSession);
        when(badSession.nodeExists(anyString())).thenThrow(new RepositoryException("Mock JCR failure"));

        when(workflowData.getPayload()).thenReturn("/content/page");

        assertThrows(WorkflowException.class, () ->
                workflowProcess.execute(workItem, workflowSession, metaDataMap));
    }
}