package com.dhl.discover.core.services;

import com.dhl.discover.core.config.SchemaServiceConfig;
import com.dhl.discover.core.services.schema.SchemaService;
import com.dhl.discover.core.services.schema.SchemaAdapter;
import com.google.gson.JsonObject;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SchemaServiceTest {

    @Mock
    private Resource resource;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private SchemaAdapter schemaAdapter;

    @Mock
    private SchemaServiceConfig config;

    @InjectMocks
    private SchemaService schemaService;

    @BeforeEach
    void setUp() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
        when(config.breadcrumbTemplatePath()).thenReturn("/structure/jcr:content");
        Method activateMethod = SchemaService.class.getDeclaredMethod("activate", SchemaServiceConfig.class);
        activateMethod.setAccessible(true);
        activateMethod.invoke(schemaService, config);
    }

    @Test
    void testGetSchemasWithNullResource() {
        List<String> schemas = schemaService.getSchemas(null, request);
        assertTrue(schemas.isEmpty());
    }

    @Test
    void testCollectSchemasWithNullResource() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
        Method collectSchemasMethod = SchemaService.class.getDeclaredMethod("collectSchemas", Resource.class, SlingHttpServletRequest.class, List.class, Predicate.class);
        collectSchemasMethod.setAccessible(true);

        List<String> schemas = new ArrayList<>();
        collectSchemasMethod.invoke(schemaService, null, request, schemas, (Predicate<Resource>) r -> r != null);
        assertTrue(schemas.isEmpty());
    }

    @Test
    void testCollectSchemasWithValidResource() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
        when(resource.getChildren()).thenReturn(new ArrayList<>());
        when(schemaAdapter.canHandle(resource)).thenReturn(true);
        when(schemaAdapter.toJson(resource, request)).thenReturn(new JsonObject());

        Method bindSchemaAdapterMethod = SchemaService.class.getDeclaredMethod("bindSchemaAdapter", SchemaAdapter.class);
        bindSchemaAdapterMethod.setAccessible(true);
        bindSchemaAdapterMethod.invoke(schemaService, schemaAdapter);

        Method collectSchemasMethod = SchemaService.class.getDeclaredMethod("collectSchemas", Resource.class, SlingHttpServletRequest.class, List.class, Predicate.class);
        collectSchemasMethod.setAccessible(true);

        List<String> schemas = new ArrayList<>();
        collectSchemasMethod.invoke(schemaService, resource, request, schemas, (Predicate<Resource>) r -> r != null);
        assertFalse(schemas.isEmpty());
        verify(schemaAdapter).toJson(resource, request);
    }

    @Test
    void testGetSchemaAdapter() throws Exception {
        Method bindSchemaAdapterMethod = SchemaService.class.getDeclaredMethod("bindSchemaAdapter", SchemaAdapter.class);
        bindSchemaAdapterMethod.setAccessible(true);
        bindSchemaAdapterMethod.invoke(schemaService, schemaAdapter);

        when(schemaAdapter.canHandle(resource)).thenReturn(true);

        Method getSchemaAdapterMethod = SchemaService.class.getDeclaredMethod("getSchemaAdapter", Resource.class);
        getSchemaAdapterMethod.setAccessible(true);

        SchemaAdapter result = (SchemaAdapter) getSchemaAdapterMethod.invoke(schemaService, resource);
        assertNotNull(result);
        assertEquals(schemaAdapter, result);
    }
}
