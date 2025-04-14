package com.dhl.discover.core.services;

import com.dhl.discover.core.services.schema.SchemaAdapter;
import com.dhl.discover.core.services.schema.SchemaService;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test class for SchemaService.
 */
@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SchemaServiceTest {
    private static final String RESOURCE_PATH = "/content/category/article/jcr:content";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private MockSlingHttpServletRequest request = context.request();

    @Mock
    private SchemaAdapter schemaAdapter;

    private SchemaService schemaService;

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

//    @Test
//    void testCollectSchemasWithNullResource() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
//        Method collectSchemasMethod = SchemaService.class.getDeclaredMethod("collectSchemas", Resource.class, SlingHttpServletRequest.class, List.class, Predicate.class);
//        collectSchemasMethod.setAccessible(true);
//
//        List<String> schemas = new ArrayList<>();
//        collectSchemasMethod.invoke(schemaService, null, request, schemas, (Predicate<Resource>) r -> r != null);
//        assertTrue(schemas.isEmpty());
//    }
//
//    @Test
//    void testCollectSchemasWithValidResource() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
//        when(schemaAdapter.canHandle(any())).thenReturn(true);
//        when(schemaAdapter.toJson(any(), any())).thenReturn(new JsonObject());
//
//        Method collectSchemasMethod = SchemaService.class.getDeclaredMethod("collectSchemas", Resource.class, SlingHttpServletRequest.class, List.class, Predicate.class);
//        collectSchemasMethod.setAccessible(true);
//
//        List<String> schemas = new ArrayList<>();
//        collectSchemasMethod.invoke(schemaService, resource, request, schemas, (Predicate<Resource>) r -> r != null);
//        assertFalse(schemas.isEmpty());
//        verify(schemaAdapter).toJson(resource, request);
//    }
//
//    @Test
//    void testGetSchemaAdapter() throws Exception {
//        Method bindSchemaAdapterMethod = SchemaService.class.getDeclaredMethod("bindSchemaAdapter", SchemaAdapter.class);
//        bindSchemaAdapterMethod.setAccessible(true);
//        bindSchemaAdapterMethod.invoke(schemaService, schemaAdapter);
//
//        when(schemaAdapter.canHandle(resource)).thenReturn(true);
//
//        Method getSchemaAdapterMethod = SchemaService.class.getDeclaredMethod("getSchemaAdapter", Resource.class);
//        getSchemaAdapterMethod.setAccessible(true);
//
//        SchemaAdapter result = (SchemaAdapter) getSchemaAdapterMethod.invoke(schemaService, resource);
//        assertNotNull(result);
//        assertEquals(schemaAdapter, result);
//    }

    @Test
    void testGetSchemasWithValidResource() {
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
    }
}
