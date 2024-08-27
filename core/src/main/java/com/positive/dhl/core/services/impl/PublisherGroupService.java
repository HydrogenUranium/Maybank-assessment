package com.positive.dhl.core.services.impl;

import com.positive.dhl.core.services.ResourceResolverHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import javax.jcr.RepositoryException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static com.positive.dhl.core.utils.OSGiConfigUtils.arrayToMapWithDelimiter;

@Component(service = PublisherGroupService.class)
@Designate(ocd = PublisherGroupService.Configuration.class)
@Slf4j
public class PublisherGroupService {

    private Map<String, String> mappings;

    private String defaultParticipant;

    @Reference
    private ResourceResolverHelper resolverHelper;

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

    public List<String> getPublisherEmails(String pagePath) throws RepositoryException {
        List<String> emails = new ArrayList<>();
        try(var resolver = resolverHelper.getReadResourceResolver()) {
            UserManager userManager = resolver.adaptTo(UserManager.class);
            if(userManager == null) {
                return emails;
            }
            var group = userManager.getAuthorizable(getPublisherGroup(pagePath));
            if (group instanceof Group) {
                Iterator<Authorizable> members = ((Group) group).getDeclaredMembers();
                while (members.hasNext()) {
                    Authorizable member = members.next();
                    if (member.hasProperty("profile/email")) {
                        var email = member.getProperty("profile/email")[0].getString();
                        emails.add(email);
                    }
                }
            }
        }

        return emails;
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
