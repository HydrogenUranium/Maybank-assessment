package com.dhl.discover.core.services;

import com.dhl.discover.core.config.SchemaServiceConfig;
import com.dhl.discover.core.services.schema.SchemaService;
import com.dhl.discover.core.services.schema.SchemaAdapter;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
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

/**
 * Test class for SchemaService.
 */
@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SchemaServiceTest {
    private static final String RESOURCE_PATH = "/content/category/article/jcr:content";
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

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @SlingObject
    private ResourceResolver resourceResolver;

    /**
     *
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws NoSuchMethodException
     */
    @BeforeEach
    void setUp() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
        when(config.breadcrumbTemplatePath()).thenReturn("/structure/jcr:content");
        Method activateMethod = SchemaService.class.getDeclaredMethod("activate", SchemaServiceConfig.class);
        activateMethod.setAccessible(true);
        activateMethod.invoke(schemaService, config);
        context.load().json("/com/dhl/discover/core/services/schema/impl/schema-service.json", "/content");

        // Manually create resource if null
        if (context.resourceResolver().getResource("/content/category/article/jcr:content") == null) {
            context.create().resource("/content/category/article/jcr:content",
                    "jcr:primaryType", "cq:PageContent",
                    "jcr:title", "ARTICLE PAGE",
                    "cq:template", "/conf/dhl/settings/wcm/templates/article-with-new-ux-design",
                    "sling:resourceType", "dhl/components/pages/editable-article"
            );
        }

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

    @Test
    void testGetSchemasWithValidResource() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
        // Retrieve the resource from the context
        Resource resource = context.resourceResolver().getResource("/content/category/article/jcr:content");
        assertNotNull(resource, "Resource should not be null");

        // Mock the ValueMap and stub its behavior
        ValueMap valueMap = resource.adaptTo(ValueMap.class);
        when(valueMap.get("jcr:title", String.class)).thenReturn("ARTICLE PAGE");
        when(valueMap.get(SchemaService.CQ_TEMPLATE, "")).thenReturn("/conf/dhl/settings/wcm/templates/home-page");

        // Mock the ResourceResolver and stub its behavior
        Resource templateStructureRoot = mock(Resource.class);
        when(templateStructureRoot.getValueMap()).thenReturn(valueMap);

        // Stub schemaAdapter behavior
        when(schemaAdapter.canHandle(resource)).thenReturn(true);
        when(schemaAdapter.toJson(resource, request)).thenReturn(new JsonObject());
        when(schemaAdapter.canHandle(templateStructureRoot)).thenReturn(true);
        when(schemaAdapter.toJson(templateStructureRoot, request)).thenReturn(new JsonObject());

        // Bind the schemaAdapter to the schemaService
        Method bindSchemaAdapterMethod = SchemaService.class.getDeclaredMethod("bindSchemaAdapter", SchemaAdapter.class);
        bindSchemaAdapterMethod.setAccessible(true);
        bindSchemaAdapterMethod.invoke(schemaService, schemaAdapter);

        // Call the method under test
        List<String> schemas = schemaService.getSchemas(resource, request);

        assertFalse(schemas.isEmpty());
    }
}
