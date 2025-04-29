package com.dhl.discover.core.services;

import com.dhl.discover.core.services.schema.SchemaAdapter;
import com.dhl.discover.core.services.schema.SchemaService;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Method;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test class for SchemaService.
 */
@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SchemaServiceTest {
    private static final String RESOURCE_PATH = "/content/category/article/jcr:content";
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private final MockSlingHttpServletRequest request = context.request();

    @Mock
    private SchemaAdapter schemaAdapter;

    private SchemaService schemaService;

    @Mock
    private Resource resp;

    @BeforeEach
    void setUp() {
        schemaService = context.registerService(SchemaService.class, new SchemaService());
        context.registerService(SchemaAdapter.class, schemaAdapter);
        context.load().json("/com/dhl/discover/core/services/schema/impl/SchemaService/content.json", "/content/category/article");
        context.load().json("/com/dhl/discover/core/services/schema/impl/SchemaService/template.json", "/conf/dhl/settings/wcm/templates/article");
    }

    @Test
    void testGetSchemasWithNullResource() {
        List<String> schemas = schemaService.getSchemas(null, request);
        assertTrue(schemas.isEmpty());
    }

    @Test
    void testGetSchemasWithValidResource() {
        try {
            Resource resource = context.resourceResolver().getResource(RESOURCE_PATH);
            request.setResource(resource);

            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("type", "breadcrumb");

            when(schemaAdapter.canHandle(any())).thenAnswer(invocation -> {
                Resource res = invocation.getArgument(0);
                return res != null && res.getResourceType().equals("dhl/components/content/breadcrumb");
            });
            when(schemaAdapter.toJson(any(), any())).thenReturn(jsonObject);

            List<String> schemas = schemaService.getSchemas(resource, request);

            assertEquals(1, schemas.size());
            assertEquals("{\"type\":\"breadcrumb\"}", schemas.get(0));
        }catch(Exception e) {
            fail("Exception occurred: " + e.getMessage());
        }
    }
    @Test
    void testGetSchemaAdapter() throws Exception {
        Method bindSchemaAdapterMethod = SchemaService.class.getDeclaredMethod("bindSchemaAdapter", SchemaAdapter.class);
        bindSchemaAdapterMethod.setAccessible(true);
        bindSchemaAdapterMethod.invoke(schemaService, schemaAdapter);

        when(schemaAdapter.canHandle(resp)).thenReturn(true);

        Method getSchemaAdapterMethod = SchemaService.class.getDeclaredMethod("getSchemaAdapter", Resource.class);
        getSchemaAdapterMethod.setAccessible(true);

        SchemaAdapter result = (SchemaAdapter) getSchemaAdapterMethod.invoke(schemaService, resp);
        assertNotNull(result);
        assertEquals(schemaAdapter, result);
    }
}
