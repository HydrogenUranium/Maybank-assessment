package com.dhl.discover.core.services.schema.impl;

import com.adobe.cq.wcm.core.components.models.Breadcrumb;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.dhl.discover.core.services.schema.SchemaAdapter;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.factory.ModelFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import java.util.List;

import static com.dhl.discover.core.constants.SchemaMarkupConstants.*;
import static com.dhl.discover.core.constants.SchemaMarkupType.*;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.*;

@Component(service = SchemaAdapter.class)
public class BreadcrumbSchemaAdapter implements SchemaAdapter {
    public static final String RESOURCE_TYPE = "dhl/components/content/breadcrumb";

    @Reference
    private ModelFactory modelFactory;

    @Override
    public boolean canHandle(Resource resource) {
        return resource.isResourceType(RESOURCE_TYPE);
    }

    public static String removeHtmlTags(String html) {
        String noHtml = html.replaceAll("<[^>]*>", " ");

        return StringUtils.normalizeSpace(noHtml.replaceAll("[\\r\\n]+", " "));
    }

    private JsonObject getEntry(NavigationItem item, int position) {
        JsonObject mainEntity = createType(LIST_ITEM);
        mainEntity.addProperty(POSITION, position);
        mainEntity.addProperty(NAME, removeHtmlTags(item.getTitle()));
        mainEntity.addProperty(ITEM, item.getPath());
        return mainEntity;
    }

    @Override
    public JsonObject toJson(Resource resource, SlingHttpServletRequest request) {
        JsonObject json = createSchema(BREADCRUMB_LIST);
        JsonObject breadcrumbJson = new JsonObject();
        breadcrumbJson.addProperty(TYPE_FIELD, BREADCRUMB_LIST.toString());
        breadcrumbJson.addProperty(CONTEXT_FIELD, HTTPS_SCHEMA_ORG_CONTEXT);
        List<NavigationItem> items = (List<NavigationItem>) modelFactory.createModelFromWrappedRequest(request, resource, Breadcrumb.class).getItems();

        var jsonArray = new JsonArray();
        int position = 1;
        for (NavigationItem item : items) {
            jsonArray.add(getEntry(item, position++));
        }
        json.add(ITEM_LIST_ELEMENT, jsonArray);
        return json;
    }

}
