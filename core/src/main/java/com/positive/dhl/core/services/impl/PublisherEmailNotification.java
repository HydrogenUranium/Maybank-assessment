package com.positive.dhl.core.services.impl;

import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.positive.dhl.core.services.ResourceResolverHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

@Component(service = WorkflowProcess.class, property = {"process.label=Delete Page Email Notification Process"})
@Slf4j
public class PublisherEmailNotification implements WorkflowProcess {

    @Reference
    private MessageGatewayService messageGatewayService;

    @Reference
    private PublisherGroupService publisherGroupService;

    @Reference
    private ResourceResolverHelper resolverHelper;

    private List<String> getRecipients(String pagePath) throws WorkflowException {
        List<String> recipients = new ArrayList<>();
        try(var resolver = resolverHelper.getReadResourceResolver()) {
            UserManager userManager = resolver.adaptTo(UserManager.class);
            if(userManager == null) {
                return recipients;
            }
            var group = userManager.getAuthorizable(publisherGroupService.getPublisherGroup(pagePath));
            if (group instanceof Group) {
                Iterator<Authorizable> members = ((Group) group).getDeclaredMembers();
                while (members.hasNext()) {
                    Authorizable member = members.next();
                    if (member.hasProperty("profile/email")) {
                        var email = member.getProperty("profile/email")[0].getString();
                        recipients.add(email);
                    }
                }
            }
        } catch (Exception ex) {
            throw new WorkflowException("Failed to send email notification to group members", ex);
        }

        return recipients;
    }

    private String getDate() {
        var offset = ZoneOffset.of("+02:00");
        var currentDateTime = LocalDateTime.now(offset);
        var formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss").withLocale(Locale.GERMANY);
        return currentDateTime.format(formatter);
    }

    @Override
    public void execute(WorkItem item, WorkflowSession session, MetaDataMap args) throws WorkflowException {
        var payloadPath = item.getWorkflowData().getPayload().toString();
        var initiator = item.getWorkflow().getInitiator();
        var date = getDate();

        MessageGateway<HtmlEmail> messageGateway = messageGatewayService.getGateway(HtmlEmail.class);
        var email = new HtmlEmail();
        List<String> recipients = getRecipients(payloadPath);

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
            email.setSubject("Notification of Page Removal");
            email.setHtmlMsg(String.format(
                            "<html><body>" +
                            "<p>Hi,</p>" +
                            "<p>Page Removal operation has been started</p>"+
                            "<ul><li>Page Path: %s</li><li>Removed By: %s</li><li>Removal Date: %s (GMT+2)</li></ul>" +
                            "<p>This is an automatically generated message. Please do not reply.</p>" +
                            "</body></html>", payloadPath, initiator, date));
        } catch (EmailException e) {
            throw new WorkflowException(e);
        }

        messageGateway.send(email);
    }
}
