package com.positive.dhl.core.services.impl;

import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowData;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParticipantStepChooserForPublishReviewTest {
    private final ParticipantStepChooserForPublishReview service = new ParticipantStepChooserForPublishReview();

    @Mock
    private ParticipantStepChooserForPublishReview.Configuration configuration;

    @Mock
    private WorkflowSession session;

    @Mock
    private WorkItem item;

    @Mock
    private MetaDataMap metaDataMap;

    @Mock
    private WorkflowData workflowData;

    @ParameterizedTest
    @CsvSource({
            "/content/my=malaysia, /content/my/home, global",
            "/content/my:malaysia, /content/en/home, global",
            "/content/my:malaysia, /content/my/home, malaysia",
    })
    void getParticipant(String mapping, String pagePath, String expected) {
        when(configuration.mappings()).thenReturn(new String[]{mapping});
        when(configuration.defaultParticipant()).thenReturn("global");
        when(item.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn(pagePath);

        service.activate(configuration);
        String result = service.getParticipant(item, session, metaDataMap);

        assertEquals(expected, result);
    }
}