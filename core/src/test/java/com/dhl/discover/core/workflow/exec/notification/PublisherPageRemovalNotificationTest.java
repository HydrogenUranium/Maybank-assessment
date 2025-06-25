package com.dhl.discover.core.workflow.exec.notification;


import com.day.cq.mailer.MailingException;
import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.Workflow;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.dhl.discover.core.components.EnvironmentConfiguration;
import com.dhl.discover.core.workflow.helpers.PublisherGroupService;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PublisherPageRemovalNotificationTest {

    @Mock
    private MessageGatewayService messageGatewayService;

    @Mock
    private PublisherGroupService publisherGroupService;

    @Mock
    private WorkItem item;

    @Mock
    private MetaDataMap metaDataMap;

    @Mock
    private WorkflowData workflowData;

    @Mock
    private Workflow workflow;

    @Mock
    private EnvironmentConfiguration environmentConfiguration;

    @InjectMocks
    private PublisherPageRemovalNotification service;

    @Mock
    private MessageGateway<Object> messageGateway;

    @Test
    void execute() throws WorkflowException, RepositoryException {
        when(environmentConfiguration.getAemEnvName()).thenReturn("deutsche-post-ag-discover-dev");
        when(environmentConfiguration.getEnvironmentName()).thenReturn("DEV");
        when(publisherGroupService.getPublisherEmails(anyString())).thenReturn(List.of("dmytro@gmail.com"));
        when(item.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn("/content/dhl/global/home");
        when(item.getWorkflow()).thenReturn(workflow);
        when(workflow.getInitiator()).thenReturn("dmytro");
        when(messageGatewayService.getGateway(any())).thenReturn(messageGateway);

        doAnswer(invocationOnMock -> {
            HtmlEmail email = invocationOnMock.getArgument(0, HtmlEmail.class);
            assertNotNull(email);
            assertEquals("DEV: Notification of Page Removal", email.getSubject());
            assertEquals(1, email.getToAddresses().size());
            assertEquals("dmytro@gmail.com", email.getToAddresses().get(0).getAddress());
            return null;
        }).when(messageGateway).send(any());

        service.execute(item, null, metaDataMap);

        verify(messageGateway).send(any());
        }


    @Test
    void environmentNameIsEmpty() {
        when(environmentConfiguration.getEnvironmentName()).thenReturn("");
        assertEquals("", environmentConfiguration.getEnvironmentName());
    }

    @Test
    void whenNoPublishersFound() throws RepositoryException, WorkflowException {
        when(item.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn("/content/dhl/global/home");
        when(publisherGroupService.getPublisherEmails(anyString())).thenReturn(List.of());

        service.execute(item, null, metaDataMap);

        verify(publisherGroupService).getPublisherEmails("/content/dhl/global/home");
        verify(messageGatewayService, never()).getGateway(any());
        verify(messageGateway, never()).send(any());
    }

    @Test
    void setEmailBodyThrowsEmailException() throws RepositoryException, EmailException {
        when(item.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn("/content/dhl/global/home");
        when(publisherGroupService.getPublisherEmails(anyString())).thenReturn(List.of("publisher@example.com"));

        PublisherPageRemovalNotification serviceSpy = spy(service);
        doThrow(new EmailException("Test email exception")).when(serviceSpy)
                .setEmailBody(any(HtmlEmail.class), eq(item), any(), eq(metaDataMap));

        WorkflowException exception = assertThrows(WorkflowException.class, () ->
                serviceSpy.execute(item, null, metaDataMap));

        assertTrue(exception.getCause() instanceof EmailException);
        assertEquals("Test email exception", exception.getCause().getMessage());

        verify(messageGateway, never()).send(any());
    }

    @Test
    void whenMailingExceptionOccurs() throws RepositoryException, WorkflowException {
        when(environmentConfiguration.getAemEnvName()).thenReturn("deutsche-post-ag-discover-dev");
        when(environmentConfiguration.getEnvironmentName()).thenReturn("DEV");
        when(item.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn("/content/dhl/global/home");
        when(item.getWorkflow()).thenReturn(workflow);
        when(workflow.getInitiator()).thenReturn("dmytro");
        when(publisherGroupService.getPublisherEmails(anyString())).thenReturn(List.of("publisher@example.com"));
        when(messageGatewayService.getGateway(any())).thenReturn(messageGateway);

        doThrow(new MailingException("Failed to send email")).when(messageGateway).send(any());

        service.execute(item, null, metaDataMap);

        verify(messageGateway).send(any());
    }

}