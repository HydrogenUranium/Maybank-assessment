package com.positive.dhl.core.services.impl;

import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.ParticipantStepChooser;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component(service = ParticipantStepChooser.class, property = { "chooser.label=" + "Dynamic Participant Chooser for language copy review" })
@Designate(ocd = ParticipantStepChooserForPublishReview.Configuration.class)
public class ParticipantStepChooserForPublishReview implements ParticipantStepChooser {
    private Map<String, String> mappings;

    private String defaultParticipant;

    @Activate
    @Modified
    public void activate(Configuration config) {
        defaultParticipant = config.defaultParticipant();
        mappings = new HashMap<>();

        Arrays.stream(config.mappings()).forEach(mapping -> {
            String[] keyValue = mapping.trim().split(":");
            if(keyValue.length != 2) {
                log.warn("Configuration mapping:'{}' is not valid.", mapping);
                return;
            }
            mappings.put(keyValue[0], keyValue[1]);
        });
        log.info("Initialized service with mappings:{}", mappings);
    }

    @Override
    public String getParticipant(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap metaDataMap) {
        String payloadPath = workItem.getWorkflowData().getPayload().toString();

        return mappings.keySet().stream()
                .filter(payloadPath::startsWith)
                .map(mappings::get)
                .findFirst().orElse(defaultParticipant);
    }

    @ObjectClassDefinition
    @interface Configuration {

        @AttributeDefinition(
                name = "Default Reviewer",
                description = "If there is no suitable publisher, this one will be used for review"
        )
        String defaultParticipant() default "publisher-global";

        @AttributeDefinition(
                name = "Service Mappings",
                description = "Provides mappings from Group/User publisher to the language copy path. Use the following template <Path>:<Group/User>. Example: 'publisher-australia:/content/dhl/en-au'"
        )
        String[] mappings() default {};
    }
}