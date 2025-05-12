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
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class SetPendingDeletionThumbnailTest {

    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private SetPendingDeletionThumbnail workflowProcess;
    private Session session;
    private ResourceResolver resourceResolver;

    @Mock
    private WorkflowSession workflowSession;

    @Mock
    private WorkItem workItem;

    @Mock
    private WorkflowData workflowData;

    @Mock
    private MetaDataMap metaDataMap;

    private static final String DELETED_IMAGE_REFERENCE = "/pending-deletion.png";

    @BeforeEach
    void setUp() {
        workflowProcess = new SetPendingDeletionThumbnail();
        resourceResolver = context.resourceResolver();
        session = resourceResolver.adaptTo(Session.class);

        when(metaDataMap.get("PROCESS_ARGS", "")).thenReturn(
                "deletedImageReference:" + DELETED_IMAGE_REFERENCE
        );
        when(workItem.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn("/content/page");
        when(workflowSession.getSession()).thenReturn(session);
    }

    @Test
    void testExecute_setsDeletedThumbnail_andMovesImage() throws Exception {
        context.create().resource("/content/page/jcr:content/image",
                Map.of("fileReference", "/image.png"));
        context.create().resource("/content/page/jcr:content/original-image",
                Map.of("fileReference", "/original-image.png"));

        workflowProcess.execute(workItem, workflowSession, metaDataMap);

        Resource imageResource = resourceResolver.getResource("/content/page/jcr:content/image");
        Resource originalImageResource = resourceResolver.getResource("/content/page/jcr:content/original-image");

        assertNotNull(originalImageResource);
        assertEquals("/image.png", originalImageResource.getValueMap().get("fileReference"));
        assertEquals(DELETED_IMAGE_REFERENCE, imageResource.getValueMap().get("fileReference"));
    }

    @Test
    void testExecute_createsImageIfMissing() throws Exception {
        context.create().resource("/content/page/jcr:content");

        workflowProcess.execute(workItem, workflowSession, metaDataMap);

        Resource imageResource = resourceResolver.getResource("/content/page/jcr:content/image");

        assertEquals(DELETED_IMAGE_REFERENCE, imageResource.getValueMap().get("fileReference"));
    }

    @Test
    void testExecute_nodeDoesNotExist_noException() {
        when(workflowData.getPayload()).thenReturn("/content/does-not-exist");

        assertDoesNotThrow(() -> workflowProcess.execute(workItem, workflowSession, metaDataMap));
    }

    @Test
    void testExecute_repositoryException_wrappedInWorkflowException() throws Exception {
        Session badSession = mock(Session.class);
        when(badSession.nodeExists(any())).thenThrow(new RepositoryException("JCR failure"));
        when(workflowSession.getSession()).thenReturn(badSession);

        assertThrows(WorkflowException.class, () ->
                workflowProcess.execute(workItem, workflowSession, metaDataMap));
    }
}
