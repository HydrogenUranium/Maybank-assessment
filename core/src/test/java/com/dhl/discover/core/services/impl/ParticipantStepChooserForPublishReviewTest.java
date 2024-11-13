package com.dhl.discover.core.services.impl;

import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowData;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParticipantStepChooserForPublishReviewTest {

    @Mock
    private WorkflowSession session;

    @Mock
    private WorkItem item;

    @Mock
    private MetaDataMap metaDataMap;

    @Mock
    private WorkflowData workflowData;

    @Mock
    private PublisherGroupService publisherGroupService;

    @InjectMocks
    private ParticipantStepChooserForPublishReview service;

    @Test
    void getParticipant() {
        when(item.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn("/content/dhl/global/en-global");
        when(publisherGroupService.getPublisherGroup(anyString())).thenReturn("global-publisher");

        String result = service.getParticipant(item, session, metaDataMap);

        assertEquals("global-publisher", result);
    }
}