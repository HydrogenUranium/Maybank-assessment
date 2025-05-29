package com.dhl.discover.core.services.impl;

import com.day.cq.mailer.MessageGatewayService;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.dhl.discover.core.components.EnvironmentConfiguration;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = WorkflowProcess.class, property = {"process.label=Delete Page Email Notification Process"})
public class PublisherPageRemovalNotification extends PublisherEmailNotification {

    @Reference
    @Getter(AccessLevel.PROTECTED)
    private MessageGatewayService messageGatewayService;

    @Reference
    @Getter(AccessLevel.PROTECTED)
    private PublisherGroupService publisherGroupService;

    @OSGiService
    private EnvironmentConfiguration environmentConfiguration;

    public void setEmailBody(HtmlEmail email, WorkItem item, WorkflowSession session, MetaDataMap args) throws EmailException {
        var payloadPath = getPayloadPath(item);
        var initiator = getInitiator(item);
        var date = getDate();
        email.setSubject(environmentConfiguration.getEnvironmentName() + ": Notification of Page Removal");
        email.setHtmlMsg(String.format(
                "<html><body>" +
                "<p>Dear publisher,</p>" +
                "<p>The page delete operation has started.</p>"+
                "<ul><li>Environment: %s</li><li>Page Path: %s</li><li>Removed By: %s</li><li>Removal Date: %s (GMT+2)</li></ul>" +
                "<p>This is an automatically generated message. Please do not reply.</p>" +
                "</body></html>", environmentConfiguration.getAemEnvName(), payloadPath, initiator, date));
    }
}
