package com.dhl.discover.core.services.schema;

import com.dhl.discover.core.config.SchemaServiceConfig;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.factory.ModelFactory;
import org.osgi.service.component.annotations.*;

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

    private String breadcrumbTemplatePath;

    @Activate
    @Modified
    protected void activate(SchemaServiceConfig config) {
        this.breadcrumbTemplatePath = config.breadcrumbTemplatePath();
    }

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
        if (resource == null) {
            return schemas;
        }
        collectSchemas(resource, request, schemas, r -> r != null);
        Resource templateStructureRoot = resource.getResourceResolver().getResource(resource.getValueMap().get(CQ_TEMPLATE, "") + breadcrumbTemplatePath);
        collectSchemas(templateStructureRoot, request, schemas, r -> r != null && !Boolean.TRUE.equals(r.getValueMap().get(TYPE_EDITABLE)));
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
