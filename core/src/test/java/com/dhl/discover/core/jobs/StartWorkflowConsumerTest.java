package com.dhl.discover.core.jobs;

import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.model.WorkflowModel;
import com.dhl.discover.core.services.ResourceResolverHelper;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.consumer.JobConsumer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StartWorkflowConsumerTest {

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @InjectMocks
    private StartWorkflowConsumer startWorkflowConsumer;

    @Mock
    private Job job;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private WorkflowSession workflowSession;

    @Mock
    private WorkflowModel workflowModel;

    @Test
    void testProcess_Success() throws Exception {
        when(job.getProperty("jcrPath")).thenReturn("/content/test");
        when(job.getProperty("modelPath")).thenReturn("/var/workflow/models/testModel");
        when(resourceResolverHelper.getWriteResourceResolver()).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(WorkflowSession.class)).thenReturn(workflowSession);
        when(workflowSession.getModel("/var/workflow/models/testModel")).thenReturn(workflowModel);

        JobConsumer.JobResult result = startWorkflowConsumer.process(job);

        assertEquals(JobConsumer.JobResult.OK, result);
        verify(workflowSession).startWorkflow(eq(workflowModel), any());
    }

    @Test
    void testProcess_WorkflowSessionNull() throws Exception {
        when(job.getProperty("jcrPath")).thenReturn("/content/test");
        when(job.getProperty("modelPath")).thenReturn("/var/workflow/models/testModel");
        when(resourceResolverHelper.getWriteResourceResolver()).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(WorkflowSession.class)).thenReturn(null);

        JobConsumer.JobResult result = startWorkflowConsumer.process(job);

        assertEquals(JobConsumer.JobResult.FAILED, result);
        verify(workflowSession, never()).startWorkflow(any(), any());
    }

    @Test
    void testProcess_Exception() throws Exception {
        when(job.getProperty("jcrPath")).thenReturn("/content/test");
        when(job.getProperty("modelPath")).thenReturn("/var/workflow/models/testModel");
        when(resourceResolverHelper.getWriteResourceResolver()).thenThrow(new RuntimeException("Test exception"));

        JobConsumer.JobResult result = startWorkflowConsumer.process(job);

        assertEquals(JobConsumer.JobResult.FAILED, result);
        verify(workflowSession, never()).startWorkflow(any(), any());
    }

}