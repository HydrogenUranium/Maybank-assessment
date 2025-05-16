package com.dhl.discover.core.services.impl;

import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.util.List;

@Component(service = WorkflowProcess.class, property = {"process.label=Delete Page Email Notification Process"})
public class PublisherPageRemovalNotification extends PublisherEmailNotification {

    @Reference
    private MessageGatewayService messageGatewayService;

    @Reference
    private PublisherGroupService publisherGroupService;

    public void setEmailBody(HtmlEmail email, WorkItem item, WorkflowSession session, MetaDataMap args) throws EmailException {
        String environmentPrefix = getEnvironmentName();
        var payloadPath = getPayloadPath(item);
        var initiator = getInitiator(item);
        var date = getDate();

        email.setSubject(environmentPrefix+"Notification of Page Removal");
        email.setHtmlMsg(String.format(
                "<html><body>" +
                "<p>Dear publisher,</p>" +
                "<p>The page delete operation has started.</p>"+
                "<ul><li>Page Path: %s</li><li>Removed By: %s</li><li>Removal Date: %s (GMT+2)</li></ul>" +
                "<p>This is an automatically generated message. Please do not reply.</p>" +
                "</body></html>", payloadPath, initiator, date));
    }

    @Override
    protected List<String> getRecipients(String payloadPath) throws RepositoryException {
        return publisherGroupService.getPublisherEmails(payloadPath);
    }

    @Override
    protected MessageGateway<HtmlEmail> getMessageGateway() {
        return messageGatewayService.getGateway(HtmlEmail.class);
    }

    protected String getEnvironmentName() {
        String envName = System.getenv("ENVIRONMENT_NAME");
        return envName != null && !envName.isEmpty() ? envName + ": " : "";
    }

}
