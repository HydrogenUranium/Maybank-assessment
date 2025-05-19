package com.dhl.discover.core.services.impl;

import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import java.util.Arrays;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import java.util.List;

@Component(service = WorkflowProcess.class, property = {"process.label=Move Page Email Notification Process"})
public class PublisherPageMovingNotification extends PublisherEmailNotification {

    @Reference
    private MessageGatewayService messageGatewayService;

    @Reference
    private PublisherGroupService publisherGroupService;

    public void setEmailBody(HtmlEmail email, WorkItem item, WorkflowSession session, MetaDataMap args) throws EmailException {
        var sourcePath = item.getWorkflowData().getMetaDataMap().get("srcPath", "");
        var payloadPath = getPayloadPath(item);
        var initiator = getInitiator(item);
        var date = getDate();
        var references = item.getWorkflowData().getMetaDataMap().get("publishReferences", new String[]{});

        email.setSubject(getEnvironmentName() + "Notification of Page Moving");
        email.setHtmlMsg(String.format(
                "<html><body>" +
                "<p>Dear publisher,</p>" +
                "<p>The page move operation has started.</p>"+
                "<ul>" +
                "<li>Environment: %s</li>" +
                "<li>Source Page Path: %s</li>" +
                "<li>New Page Path: %s</li>" +
                "<li>Moved By: %s</li>" +
                "<li>Moving Date: %s (GMT+2)</li>" +
                "<li>Updated References: %s</li>" +
                "</ul>" +
                "<p>This is an automatically generated message. Please do not reply.</p>" +
                "</body></html>", getAEMEnvironmentName(), sourcePath, payloadPath, initiator, date, Arrays.toString(references)));
    }

    @Override
    protected List<String> getRecipients(String payloadPath) throws RepositoryException {
        return publisherGroupService.getPublisherEmails(payloadPath);
    }

    @Override
    protected MessageGateway<HtmlEmail> getMessageGateway() {
        return messageGatewayService.getGateway(HtmlEmail.class);
    }
}
