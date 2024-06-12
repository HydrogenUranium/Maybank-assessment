package com.positive.dhl.core.services.schema.impl;

import com.google.gson.JsonObject;
import com.positive.dhl.core.utils.SchemaMarkupUtils;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;

import static com.positive.dhl.core.constants.SchemaMarkupType.VIDEO_OBJECT;
import static com.positive.dhl.core.utils.SchemaMarkupUtils.createSchema;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockStatic;

@ExtendWith(AemContextExtension.class)
class EmbedYoutubeSchemaAdapterTest {
    private static final String RESOURCE_PATH = "/content/home/article/jcr:content/embed";

    private final AemContext context = new AemContext();

    private final EmbedYoutubeSchemaAdapter adapter = new EmbedYoutubeSchemaAdapter();

    @Test
    void canHandle_ShouldReturnTrue_WhenPropertiesOk() {
        Resource resource = context.create().resource(RESOURCE_PATH,
                "sling:resourceType", EmbedYoutubeSchemaAdapter.RESOURCE_TYPE,
                "embeddableResourceType", EmbedYoutubeSchemaAdapter.YOUTUBE_EMBEDDABLE_RESOURCE_TYPE,
                "schema", "{}");

        boolean result = adapter.canHandle(resource);

        assertTrue(result);
    }

    @Test
    void canHandle_ShouldReturnFalse_WhenResourceTypeIsNotCorrect() {
        Resource resource = context.create().resource(RESOURCE_PATH,
                "sling:resourceType", "/test",
                "embeddableResourceType", EmbedYoutubeSchemaAdapter.YOUTUBE_EMBEDDABLE_RESOURCE_TYPE,
                "schema", "{}");

        boolean result = adapter.canHandle(resource);

        assertFalse(result);
    }

    @Test
    void canHandle_ShouldReturnFalse_WhenEmbedTypeIsNotCorrect() {
        Resource resource = context.create().resource(RESOURCE_PATH,
                "sling:resourceType", EmbedYoutubeSchemaAdapter.RESOURCE_TYPE,
                "embeddableResourceType", "/test",
                "schema", "{}");

        boolean result = adapter.canHandle(resource);

        assertFalse(result);
    }

    @Test
    void canHandle_ShouldReturnFalse_WhenSchemaIsEmpty() {
        Resource resource = context.create().resource(RESOURCE_PATH,
                "sling:resourceType", EmbedYoutubeSchemaAdapter.RESOURCE_TYPE,
                "embeddableResourceType", EmbedYoutubeSchemaAdapter.YOUTUBE_EMBEDDABLE_RESOURCE_TYPE,
                "schema", "");

        boolean result = adapter.canHandle(resource);

        assertFalse(result);
    }

    @Test
    void toJson_ShouldReturnJson_WhenJsonIsValid() {
        JsonObject expected = createSchema(VIDEO_OBJECT);

        try(MockedStatic<SchemaMarkupUtils> mockedStatic = mockStatic(SchemaMarkupUtils.class)) {
            mockedStatic.when(() -> SchemaMarkupUtils.isValidVideoObjectSchema(any())).thenReturn(true);

            Resource resource = context.create().resource(RESOURCE_PATH,
                    "schema", expected.toString());

            JsonObject result = adapter.toJson(resource, context.request());

            assertEquals(expected, result);
        }
    }

    @Test
    void toJson_ShouldReturnNull_WhenIsNotValid() {
        JsonObject expected = createSchema(VIDEO_OBJECT);

        try(MockedStatic<SchemaMarkupUtils> mockedStatic = mockStatic(SchemaMarkupUtils.class)) {
            mockedStatic.when(() -> SchemaMarkupUtils.isValidVideoObjectSchema(any())).thenReturn(false);

            Resource resource = context.create().resource(RESOURCE_PATH,
                    "schema", expected.toString());

            JsonObject result = adapter.toJson(resource, context.request());

            assertNull(result);
        }
    }

}