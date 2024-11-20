package com.dhl.discover.core.services.schema.impl;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.dhl.discover.core.services.PageContentExtractorService;
import com.dhl.discover.core.services.schema.SchemaAdapter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import static com.dhl.discover.core.constants.SchemaMarkupConstants.*;
import static com.dhl.discover.core.constants.SchemaMarkupType.*;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.createSchema;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.createType;

@Component(service = SchemaAdapter.class)
public class FAQSchemaAdapter implements SchemaAdapter {
    public static final String RESOURCE_TYPE = "dhl/components/content/accordion-v2";
    private static final String PROPERTY_IS_FAQ = "isFAQ";
    private static final String PROPERTY_PANEL_TITLE = "cq:panelTitle";

    @Reference
    private PageContentExtractorService extractorService;

    @Override
    public boolean canHandle(Resource resource) {
        var valueMap = resource.getValueMap();
        return resource.isResourceType(RESOURCE_TYPE) && valueMap.get(PROPERTY_IS_FAQ, false);
    }

    public static String removeHtmlTags(String html) {
        String noHtml = html.replaceAll("<[^>]*>", " ");

        return StringUtils.normalizeSpace(noHtml.replaceAll("[\\r\\n]+", " "));
    }

    private JsonObject getEntry(Resource resource) {
        var valueMap = resource.getValueMap();

        var questionString = valueMap.get(PROPERTY_PANEL_TITLE, "");
        var answerString = removeHtmlTags(extractorService.extract(resource));

        JsonObject mainEntity = createType(QUESTION);
        mainEntity.addProperty(NAME, questionString);

        JsonObject answer = createType(ANSWER);
        mainEntity.add(ACCEPTED_ANSWER, answer);
        answer.addProperty(TEXT, answerString);

        return mainEntity;
    }

    @Override
    public JsonObject toJson(Resource resource, SlingHttpServletRequest request) {
        JsonObject json = createSchema(FAQ_PAGE);
        var jsonArray = new JsonArray();
        resource.getChildren().forEach(child -> jsonArray.add(getEntry(child)));
        json.add(MAIN_ENTITY, jsonArray);
        return json;
    }
}
