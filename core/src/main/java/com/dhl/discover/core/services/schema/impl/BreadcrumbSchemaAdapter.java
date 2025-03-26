package com.dhl.discover.core.services.schema.impl;

import com.dhl.discover.core.services.PageContentExtractorService;
import com.dhl.discover.core.services.schema.SchemaAdapter;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import static com.dhl.discover.core.constants.SchemaMarkupConstants.*;
import static com.dhl.discover.core.constants.SchemaMarkupType.*;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.createSchema;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.createType;

/*@Component(service = SchemaAdapter.class)
public class BreadcrumbSchemaAdapter implements SchemaAdapter {
    public static final String RESOURCE_TYPE = "dhl/components/content/breadcrumb";
    private static final String PROPERTY_IS_BREADCRUMNB = "breadcrumb";
    private static final String PROPERTY_PANEL_TITLE = "cq:panelTitle";

    @Reference
    private PageContentExtractorService extractorService;

    @Override
    public boolean canHandle(Resource resource) {
        var valueMap = resource.getValueMap();
        return resource.isResourceType(RESOURCE_TYPE);
    }

    public static String removeHtmlTags(String html) {
        String noHtml = html.replaceAll("<[^>]*>", " ");

        return StringUtils.normalizeSpace(noHtml.replaceAll("[\\r\\n]+", " "));
    }

    private JsonObject getEntry(Resource resource, int position) {
        var valueMap = resource.getValueMap();
        var nameString = valueMap.get(NAME, "");

        JsonObject mainEntity = createType(LIST_ITEM);
        mainEntity.addProperty(ITEM, nameString);
        mainEntity.addProperty("position", position);

        // Add additional properties if needed
        mainEntity.addProperty("url", valueMap.get("url", ""));
        mainEntity.addProperty("name", removeHtmlTags(nameString));
        return mainEntity;
    }

    @Override
    public JsonObject toJson(Resource resource, SlingHttpServletRequest request) {
        JsonObject json = createSchema(BREADCRUMB_LIST);

        var jsonArray = new JsonArray();
        int position = 1;
        for (Resource child : resource.getChildren()) {
            jsonArray.add(getEntry(child, position++));
        }
        json.add(ITEM_LIST_ELEMENT, jsonArray);
        return json;
    }
}*/
