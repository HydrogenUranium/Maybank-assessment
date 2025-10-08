package com.dhl.discover.core.jobs;

import com.adobe.granite.workflow.WorkflowSession;
import com.dhl.discover.core.services.ResourceResolverHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.consumer.JobConsumer;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = JobConsumer.class,
        immediate = true,
        property = { JobConsumer.PROPERTY_TOPICS + "=discover/workflow/start" })
@Slf4j
public class StartWorkflowConsumer implements JobConsumer {

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    @Override
    public JobConsumer.JobResult process(Job job) {
        String path = (String) job.getProperty("jcrPath");
        String modelPath = (String) job.getProperty("modelPath");
        try (var resourceResolver = resourceResolverHelper.getWriteResourceResolver()) {
            WorkflowSession workflowSession = resourceResolver.adaptTo(WorkflowSession.class);
            if(workflowSession == null) {
                log.error("Could not adapt to workflow session");
                return JobConsumer.JobResult.FAILED;
            }
            var model = workflowSession.getModel(modelPath);
            workflowSession.startWorkflow(model, workflowSession.newWorkflowData("JCR_PATH", path));
            return JobConsumer.JobResult.OK;
        } catch (Exception e) {
            log.error("Error starting workflow at path: {} with model: {}", path, modelPath, e);
            return JobConsumer.JobResult.FAILED;
        }
    }
}
