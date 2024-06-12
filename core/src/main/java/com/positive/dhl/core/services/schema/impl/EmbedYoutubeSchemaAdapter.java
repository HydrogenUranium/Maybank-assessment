package com.positive.dhl.core.services.schema.impl;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.positive.dhl.core.services.schema.AbstractSchemaAdapter;
import com.positive.dhl.core.services.schema.SchemaAdapter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;

import static com.positive.dhl.core.utils.SchemaMarkupUtils.isValidVideoObjectSchema;

@Component(service = SchemaAdapter.class)
public class EmbedYoutubeSchemaAdapter extends AbstractSchemaAdapter {
    public static final String RESOURCE_TYPE = "dhl/components/content/embed";
    public static final String YOUTUBE_EMBEDDABLE_RESOURCE_TYPE = "dhl/components/content/embed/embeddable/youtube";

    @Override
    public boolean canHandle(Resource resource) {
        String embeddableResourceType = resource.getValueMap().get("embeddableResourceType", "");
        return resource.isResourceType(RESOURCE_TYPE)
                && YOUTUBE_EMBEDDABLE_RESOURCE_TYPE.equals(embeddableResourceType)
                && hasFields(resource, "schema");
    }

    @Override
    public JsonObject toJson(Resource resource, SlingHttpServletRequest request) {
        try {
            var videoJson = JsonParser.parseString(resource.getValueMap().get("schema", ""))
                    .getAsJsonObject();
            return isValidVideoObjectSchema(videoJson) ? videoJson : null;
        } catch (Exception e) {
            return null;
        }
    }
}
