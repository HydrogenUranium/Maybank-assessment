package com.positive.dhl.core.services.impl;

import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.ParticipantStepChooser;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Slf4j
@Component(service = ParticipantStepChooser.class, property = { "chooser.label=" + "Dynamic Participant Chooser for language copy review" })
public class ParticipantStepChooserForPublishReview implements ParticipantStepChooser {

    @Reference
    private PublisherGroupService publisherGroupService;

    @Override
    public String getParticipant(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap) {
        var payloadPath = workItem.getWorkflowData().getPayload().toString();

        return publisherGroupService.getPublisherGroup(payloadPath);
    }
}