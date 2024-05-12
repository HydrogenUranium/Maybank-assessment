package com.positive.dhl.core.services.impl;

import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import java.util.Map;

import static com.positive.dhl.core.helpers.OSGiConfigHelper.arrayToMapWithDelimiter;

@Component(service = PublisherGroupService.class)
@Designate(ocd = PublisherGroupService.Configuration.class)
@Slf4j
public class PublisherGroupService {

    private Map<String, String> mappings;

    private String defaultParticipant;

    @Activate
    @Modified
    public void activate(PublisherGroupService.Configuration config) {
        defaultParticipant = config.defaultParticipant();
        mappings = arrayToMapWithDelimiter(config.mappings());
        log.info("Initialized service with mappings:{}", mappings);
    }

    public String getPublisherGroup(String pagePath) {
        return mappings.keySet().stream()
                .filter(pagePath::startsWith)
                .map(mappings::get)
                .findFirst().orElse(defaultParticipant);
    }

    @ObjectClassDefinition
    @interface Configuration {

        @AttributeDefinition(
                name = "Default Reviewer",
                description = "If there is no suitable publisher, this one will be used"
        )
        String defaultParticipant() default "publisher-all-countries";

        @AttributeDefinition(
                name = "Service Mappings",
                description = "Provides mappings from Group/User publisher to the language copy path. Use the following template <Path>:<Group/User>. Example: 'publisher-australia:/content/dhl/en-au'"
        )
        String[] mappings() default {};
    }
}
