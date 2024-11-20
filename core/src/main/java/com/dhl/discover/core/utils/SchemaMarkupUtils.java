package com.dhl.discover.core.utils;

import com.dhl.discover.core.constants.SchemaMarkupType;
import com.google.gson.JsonObject;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Map;

@UtilityClass
public class SchemaMarkupUtils {
    public static final String HTTPS_SCHEMA_ORG_CONTEXT = "https://schema.org";
    public static final String HTTP_SCHEMA_ORG_CONTEXT = "http://schema.org";
    public static final String CONTEXT_FIELD = "@context";
    public static final String TYPE_FIELD = "@type";

    private static final Map<SchemaMarkupType, List<String>> REQUIRED_FIELDS_MAP = Map.of(
            SchemaMarkupType.VIDEO_OBJECT, List.of("name", "thumbnailUrl", "uploadDate")
    );

    private static boolean hasFields(List<String> fields, JsonObject schema){
        return isValidCommonFields(schema) && fields.stream().allMatch(schema::has);
    }

    private static boolean isValidCommonFields(JsonObject schema) {
        var schemaContext = schema.get(CONTEXT_FIELD).getAsString();
        return schema.has(CONTEXT_FIELD)
                && StringUtils.equalsAny(schemaContext, HTTP_SCHEMA_ORG_CONTEXT, HTTPS_SCHEMA_ORG_CONTEXT)
                && schema.has(TYPE_FIELD);
    }

    public static boolean isValidSchema(SchemaMarkupType type, JsonObject schema){
        if(!REQUIRED_FIELDS_MAP.containsKey(type)) {
            return false;
        }

        return hasFields(REQUIRED_FIELDS_MAP.get(type), schema);
    }

    public static boolean isValidVideoObjectSchema(JsonObject schema) {
        return isValidSchema(SchemaMarkupType.VIDEO_OBJECT, schema);
    }

    public static JsonObject createSchema(SchemaMarkupType type) {
        var schema = new JsonObject();
        schema.addProperty(CONTEXT_FIELD, HTTPS_SCHEMA_ORG_CONTEXT);
        schema.addProperty(TYPE_FIELD, type.toString());
        return schema;
    }

    public static JsonObject createType(SchemaMarkupType type){
        var json = new JsonObject();
        json.addProperty(TYPE_FIELD, type.toString());
        return json;
    }
}
