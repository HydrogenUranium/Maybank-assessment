package com.dhl.discover.core.workflow.helpers;

import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.core.workflow.exec.notification.PublisherPageRemovalNotification;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class PublisherGroupServiceTest {

    private final AemContext context = new AemContext();

    @Mock
    private PublisherGroupService.Configuration configuration;

    @Mock
    private ResourceResolverHelper resolverHelper;

    @InjectMocks
    private PublisherPageRemovalNotification service;

    @Mock
    private UserManager userManager;

    @Mock
    private Group group;

    @Mock
    private Authorizable user;

    @Mock
    private Value value;

    @InjectMocks
    private PublisherGroupService publisherGroupService;

    @BeforeEach
    void setUp() {
        context.registerAdapter(ResourceResolver.class, UserManager.class, userManager);
        when(configuration.defaultParticipant()).thenReturn("global");
    }

    @ParameterizedTest
    @CsvSource({
            "/content/my=malaysia, /content/my/home, global",
            "/content/my:malaysia, /content/en/home, global",
            "/content/my:malaysia, /content/my/home, malaysia",
    })
    void getPublisherGroup(String mapping, String pagePath, String expected) {
        when(configuration.mappings()).thenReturn(new String[]{mapping});
        publisherGroupService.activate(configuration);

        String result = publisherGroupService.getPublisherGroup(pagePath);

        assertEquals(expected, result);
    }

    @Test
    void getPublisherEmails() throws RepositoryException {
        when(configuration.mappings()).thenReturn(new String[]{"/content/my:malaysia"});
        when(resolverHelper.getReadResourceResolver()).thenReturn(context.resourceResolver());
        when(userManager.getAuthorizable(anyString())).thenReturn(group);
        when(group.getDeclaredMembers()).thenReturn(List.of(user).iterator());
        when(user.hasProperty("profile/email")).thenReturn(true);
        when(user.getProperty("profile/email")).thenReturn(new Value[]{value});
        when(value.getString()).thenReturn("dmytro@gmail.com");
        publisherGroupService.activate(configuration);

        List<String> emails = publisherGroupService.getPublisherEmails("/content/my/home");

        assertEquals(emails, List.of("dmytro@gmail.com"));
    }
}