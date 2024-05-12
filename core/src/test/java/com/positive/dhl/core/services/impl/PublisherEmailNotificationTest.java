package com.positive.dhl.core.services.impl;

import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.Workflow;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.positive.dhl.core.services.ResourceResolverHelper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.mail.HtmlEmail;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Value;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class PublisherEmailNotificationTest {

    private AemContext context = new AemContext();

    @Mock
    private MessageGatewayService messageGatewayService;

    @Mock
    private PublisherGroupService publisherGroupService;

    @Mock
    private ResourceResolverHelper resolverHelper;

    @InjectMocks
    private PublisherEmailNotification service;

    @Mock
    private UserManager userManager;

    @Mock
    private WorkItem item;

    @Mock
    private MetaDataMap metaDataMap;

    @Mock
    private WorkflowData workflowData;

    @Mock
    private Workflow workflow;

    @Mock
    private Group group;

    @Mock
    private Authorizable user;

    @Mock
    private Value value;

    @Mock
    private MessageGateway<Object> messageGateway;

    @BeforeEach
    void setUp() {
        context.registerAdapter(ResourceResolver.class, UserManager.class, userManager);
    }

    @Test
    void execute() throws WorkflowException, RepositoryException {
        when(resolverHelper.getReadResourceResolver()).thenReturn(context.resourceResolver());
        when(publisherGroupService.getPublisherGroup(anyString())).thenReturn("global");
        when(item.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn("/content/dhl/global/home");
        when(item.getWorkflow()).thenReturn(workflow);
        when(workflow.getInitiator()).thenReturn("dmytro");
        when(userManager.getAuthorizable(anyString())).thenReturn(group);
        when(group.getDeclaredMembers()).thenReturn(List.of(user).iterator());
        when(user.hasProperty("profile/email")).thenReturn(true);
        when(user.getProperty("profile/email")).thenReturn(new Value[]{value});
        when(value.getString()).thenReturn("dmytro@gmail.com");
        when(messageGatewayService.getGateway(any())).thenReturn(messageGateway);

        doAnswer(invocationOnMock -> {
            HtmlEmail email = invocationOnMock.getArgument(0, HtmlEmail.class);
            assertNotNull(email);
            assertEquals("Notification of Page Removal", email.getSubject());
            assertEquals(1, email.getToAddresses().size());
            assertEquals("dmytro@gmail.com", email.getToAddresses().get(0).getAddress());
            return null;
        }).when(messageGateway).send(any());

        service.execute(item, null, metaDataMap);

        verify(messageGateway).send(any());
    }

}