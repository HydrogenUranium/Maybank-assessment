package com.dhl.discover.core.services.schema;

import com.adobe.cq.wcm.core.components.models.Breadcrumb;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;

import java.util.ArrayList;
import java.util.List;
import com.adobe.cq.wcm.core.components.models.Breadcrumb;

@Component(service = SchemaService.class)
@Slf4j
public class SchemaService {

    private final List<SchemaAdapter> adapters = new ArrayList<>();
    public static final String BREADCRUMB_RESOURCE_TYPE = "dhl/components/content/breadcrumb";

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
        if(resource.isResourceType(BREADCRUMB_RESOURCE_TYPE)) {
            JsonObject breadcrumbJson = handleBreadcrumbRequest(request);
            if(breadcrumbJson != null) {
                list.add(breadcrumbJson.toString());
            }
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

    public JsonObject handleBreadcrumbRequest(SlingHttpServletRequest request) {
        Breadcrumb breadcrumb = request.adaptTo(Breadcrumb.class);
        if (breadcrumb == null) {
            log.warn("Breadcrumb component could not be adapted from the request.");
            return null;
        }

        JsonObject breadcrumbJson = new JsonObject();
        breadcrumbJson.addProperty("type", "BreadcrumbList");
        breadcrumbJson.addProperty("context", "http://schema.org");

        JsonArray itemListElement = new JsonArray();
        /*List<Breadcrumb.Item> items = breadcrumb.getItems();
        for (int i = 0; i < items.size(); i++) {
            Breadcrumb.Item item = items.get(i);
            JsonObject listItem = new JsonObject();
            listItem.addProperty("type", "ListItem");
            listItem.addProperty("position", i + 1);
            listItem.addProperty("name", item.getTitle());
            listItem.addProperty("item", item.getPath());
            itemListElement.add(listItem);
        }*/

        breadcrumbJson.add("itemListElement", itemListElement);
        return breadcrumbJson;
    }
}
