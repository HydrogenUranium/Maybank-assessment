package com.dhl.discover.core.services.impl;

import com.day.cq.mailer.MailingException;
import com.day.cq.mailer.MessageGateway;
import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;

import javax.jcr.RepositoryException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Slf4j
public abstract class PublisherEmailNotification implements WorkflowProcess {
    protected String getDate() {
        var offset = ZoneOffset.of("+02:00");
        var currentDateTime = LocalDateTime.now(offset);
        var formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss").withLocale(Locale.GERMANY);
        return currentDateTime.format(formatter);
    }

    protected String getPayloadPath(WorkItem item) {
        return item.getWorkflowData().getPayload().toString();
    }

    protected String getInitiator(WorkItem item) {
        return item.getWorkflow().getInitiator();
    }

    protected abstract List<String> getRecipients(String payloadPath) throws RepositoryException;

    protected abstract MessageGateway<HtmlEmail> getMessageGateway();

    @Override
    public final void execute(WorkItem item, WorkflowSession session, MetaDataMap args) throws WorkflowException {
        var payloadPath = getPayloadPath(item);
        var email = new HtmlEmail();
        List<String> recipients = null;
        try {
            recipients = getRecipients(payloadPath);
        } catch (RepositoryException e) {
            throw new WorkflowException(e);
        }

        if(recipients.isEmpty()) {
            log.warn("No responsible publishers for: {}", payloadPath);
            return;
        }

        for(String recipient : recipients){
            try {
                email.addTo(recipient);
            } catch (EmailException e) {
                log.warn("Invalid email address: {}", recipient);
            }
        }

        try {
            setEmailBody(email, item, session, args);
        } catch (EmailException e) {
            throw new WorkflowException(e);
        }

        try {
            getMessageGateway().send(email);
        } catch (MailingException e) {
            log.warn("Failed to sand email: {}", e.getMessage());
        }

    }

    public abstract void setEmailBody(HtmlEmail email, WorkItem item, WorkflowSession session, MetaDataMap args) throws EmailException;
}
