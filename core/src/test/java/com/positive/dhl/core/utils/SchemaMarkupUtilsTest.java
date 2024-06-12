package com.positive.dhl.core.utils;

import com.google.gson.JsonObject;
import com.positive.dhl.core.constants.SchemaMarkupType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SchemaMarkupUtilsTest {

    @Test
    void testIsValidVideoObjectSchema_validSchema() {
        JsonObject validSchema = new JsonObject();
        validSchema.addProperty(SchemaMarkupUtils.CONTEXT_FIELD, SchemaMarkupUtils.HTTPS_SCHEMA_ORG_CONTEXT);
        validSchema.addProperty(SchemaMarkupUtils.TYPE_FIELD, SchemaMarkupType.VIDEO_OBJECT.toString());
        validSchema.addProperty("name", "Test Video");
        validSchema.addProperty("thumbnailUrl", "http://example.com/thumbnail.jpg");
        validSchema.addProperty("uploadDate", "2023-01-01");

        assertTrue(SchemaMarkupUtils.isValidVideoObjectSchema(validSchema));
    }

    @Test
    void testIsValidVideoObjectSchema_invalidSchema_missingFields() {
        JsonObject invalidSchema = new JsonObject();
        invalidSchema.addProperty(SchemaMarkupUtils.CONTEXT_FIELD, SchemaMarkupUtils.HTTPS_SCHEMA_ORG_CONTEXT);
        invalidSchema.addProperty(SchemaMarkupUtils.TYPE_FIELD, SchemaMarkupType.VIDEO_OBJECT.toString());
        invalidSchema.addProperty("name", "Test Video");

        assertFalse(SchemaMarkupUtils.isValidVideoObjectSchema(invalidSchema));
    }

    @Test
    void testIsValidVideoObjectSchema_invalidSchema_wrongContext() {
        JsonObject invalidSchema = new JsonObject();
        invalidSchema.addProperty(SchemaMarkupUtils.CONTEXT_FIELD, "http://example.com");
        invalidSchema.addProperty(SchemaMarkupUtils.TYPE_FIELD, SchemaMarkupType.VIDEO_OBJECT.toString());
        invalidSchema.addProperty("name", "Test Video");
        invalidSchema.addProperty("thumbnailUrl", "http://example.com/thumbnail.jpg");
        invalidSchema.addProperty("uploadDate", "2023-01-01");

        assertFalse(SchemaMarkupUtils.isValidVideoObjectSchema(invalidSchema));
    }

    @Test
    void testCreateSchema() {
        JsonObject schema = SchemaMarkupUtils.createSchema(SchemaMarkupType.VIDEO_OBJECT);

        assertNotNull(schema);
        assertEquals(SchemaMarkupUtils.HTTPS_SCHEMA_ORG_CONTEXT, schema.get(SchemaMarkupUtils.CONTEXT_FIELD).getAsString());
        assertEquals(SchemaMarkupType.VIDEO_OBJECT.toString(), schema.get(SchemaMarkupUtils.TYPE_FIELD).getAsString());
    }

    @Test
    void testCreateType() {
        JsonObject type = SchemaMarkupUtils.createType(SchemaMarkupType.VIDEO_OBJECT);

        assertNotNull(type);
        assertEquals(SchemaMarkupType.VIDEO_OBJECT.toString(), type.get(SchemaMarkupUtils.TYPE_FIELD).getAsString());
    }

    @Test
    void testIsValidSchema_valid() {
        JsonObject validSchema = new JsonObject();
        validSchema.addProperty(SchemaMarkupUtils.CONTEXT_FIELD, SchemaMarkupUtils.HTTPS_SCHEMA_ORG_CONTEXT);
        validSchema.addProperty(SchemaMarkupUtils.TYPE_FIELD, SchemaMarkupType.VIDEO_OBJECT.toString());
        validSchema.addProperty("name", "Test Video");
        validSchema.addProperty("thumbnailUrl", "http://example.com/thumbnail.jpg");
        validSchema.addProperty("uploadDate", "2023-01-01");

        assertTrue(SchemaMarkupUtils.isValidSchema(SchemaMarkupType.VIDEO_OBJECT, validSchema));
    }

    @Test
    void testIsValidSchema_invalid() {
        JsonObject invalidSchema = new JsonObject();
        invalidSchema.addProperty(SchemaMarkupUtils.CONTEXT_FIELD, SchemaMarkupUtils.HTTPS_SCHEMA_ORG_CONTEXT);
        invalidSchema.addProperty(SchemaMarkupUtils.TYPE_FIELD, SchemaMarkupType.VIDEO_OBJECT.toString());
        invalidSchema.addProperty("name", "Test Video");

        assertFalse(SchemaMarkupUtils.isValidSchema(SchemaMarkupType.VIDEO_OBJECT, invalidSchema));
    }
}