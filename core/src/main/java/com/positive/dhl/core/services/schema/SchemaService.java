package com.positive.dhl.core.services.schema;

import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;

import java.util.ArrayList;
import java.util.List;

@Component(service = SchemaService.class)
@Slf4j
public class SchemaService {

    private final List<SchemaAdapter> adapters = new ArrayList<>();

    @Reference(
            service = SchemaAdapter.class,
            cardinality = ReferenceCardinality.MULTIPLE,
            policy = ReferencePolicy.DYNAMIC
    )
    protected void bindSchemaAdapter(SchemaAdapter adapter) {
        adapters.add(adapter);
    }

    protected void unbindSchemaAdapter(SchemaAdapter adapter) {
        adapters.remove(adapter);
    }

    private SchemaAdapter getSchemaAdapter(Resource resource) {
        return adapters.stream()
                .filter(schemaAdapter -> schemaAdapter.canHandle(resource))
                .findFirst().orElse(null);
    }

    public List<String> getSchemas(Resource resource, SlingHttpServletRequest request) {
        List<String> schemas = new ArrayList<>();
        collectSchemas(resource, request, schemas);
        return schemas;
    }

    private void collectSchemas(Resource resource, SlingHttpServletRequest request, List<String> list) {
        if(resource == null) {
            return;
        }

        var adapter = getSchemaAdapter(resource);
        if (adapter != null) {
            JsonObject json = adapter.toJson(resource, request);
            if(json != null) {
                list.add(json.toString());
            }
        }
        resource.getChildren().forEach(child -> collectSchemas(child, request, list));
    }
}
