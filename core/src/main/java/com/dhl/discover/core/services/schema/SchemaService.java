package com.dhl.discover.core.services.schema;

import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.factory.ModelFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;


@Component(service = SchemaService.class)
@Slf4j
public class SchemaService {

    @Reference
    private ModelFactory modelFactory;

    private final List<SchemaAdapter> adapters = new ArrayList<>();
    public static final String CQ_TEMPLATE = "cq:template";
    public static final String TYPE_EDITABLE = "editable";
    public static final String BREADCRUMB_TEMPLATE_PATH = "/structure/jcr:content";
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
        collectSchemas(resource, request, schemas, r -> r != null);
        if( resource != null) {
            Resource templateStructureRoot = resource.getResourceResolver().getResource(resource.getValueMap().get(CQ_TEMPLATE, "") + BREADCRUMB_TEMPLATE_PATH);
            collectSchemas(templateStructureRoot, request, schemas, r -> r != null && !r.getValueMap().get(TYPE_EDITABLE, false));
        }
        return schemas;
    }

    private void collectSchemas(Resource resource, SlingHttpServletRequest request, List<String> list, Predicate<Resource> predicate) {
        if(resource == null || !predicate.test(resource)) {
            return;
        }
        var adapter = getSchemaAdapter(resource);
        if (adapter != null) {
            JsonObject json = adapter.toJson(resource, request);
            if(json != null) {
                list.add(json.toString());
            }
        }
        resource.getChildren().forEach(child -> collectSchemas(child, request, list, predicate));
    }
}
