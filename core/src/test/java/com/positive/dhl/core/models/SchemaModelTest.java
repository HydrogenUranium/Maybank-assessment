package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.schema.SchemaService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Objects;

import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SchemaModelTest {
    private final AemContext context = new AemContext();

    @Mock
    private SchemaService schemaService;

    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resolver = context.resourceResolver();

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/positive/dhl/core/content/simpleArticleContent.json", "/content/dhl/article");
        context.addModelsForClasses(SchemaModel.class);
        context.registerService(SchemaService.class, schemaService);
    }

    @Test
    void test() {
        request.setPathInfo("/content/dhl/article");
        request.setResource(resolver.getResource("/content/dhl/article"));
        SchemaModel model = request.adaptTo(SchemaModel.class);
        when(schemaService.getSchemas(any(), any())).thenReturn(List.of("schema"));
        List<String> list = model.getSchemas();

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("schema", list.get(0));
    }
}