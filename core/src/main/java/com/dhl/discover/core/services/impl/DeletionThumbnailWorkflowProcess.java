package com.dhl.discover.core.services.impl;

import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.dhl.discover.core.utils.OSGiConfigUtils;

import java.util.Map;

public abstract class DeletionThumbnailWorkflowProcess implements WorkflowProcess {
    protected static final String ORIGINAL_IMAGE_NODE_NAME = "original-image";
    protected static final String IMAGE_NODE_NAME = "image";
    protected static final String FILE_REFERENCE = "fileReference";
    protected static final String DELETED_IMAGE_REFERENCE = "deletedImageReference";

    protected Map<String, String> getConfig(MetaDataMap args) {
        return OSGiConfigUtils.arrayToMapWithDelimiter(args.get("PROCESS_ARGS", "").split("\\R"));
    }

    protected String getDeletedImageReference(MetaDataMap args) {
        return getConfig(args).get(DELETED_IMAGE_REFERENCE);
    }

    protected String getPayloadPath(WorkItem item) {
        return item.getWorkflowData().getPayload().toString();
    }

    protected String getContentNodePath(WorkItem item) {
        return getPayloadPath(item) + "/jcr:content";
    }

}
