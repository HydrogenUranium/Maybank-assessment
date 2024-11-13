package com.dhl.discover.core.services.schema;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import com.google.gson.JsonObject;

public interface SchemaAdapter {
    boolean canHandle(Resource resource);
    JsonObject toJson(Resource resource, SlingHttpServletRequest request);
}
