package com.dhl.discover.core.services.schema.impl;

import com.adobe.cq.wcm.core.components.models.Breadcrumb;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.dhl.discover.core.utils.SchemaMarkupUtils;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.factory.ModelFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static com.dhl.discover.core.constants.SchemaMarkupType.BREADCRUMB_LIST;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.TYPE_FIELD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class BreadcrumbSchemaAdapterTest {
    private static final String CONTEXT_FIELD = "@context";
    private static final String HTTPS_SCHEMA_ORG_CONTEXT = "https://schema.org";
    private static final String POSITION = "position";
    private static final String NAME = "name";
    private static final String ITEM = "item";
    private static final String ITEM_LIST_ELEMENT = "itemListElement";

    private final AemContext context = new AemContext();

    @Mock
    private ModelFactory modelFactory;

    @Mock
    private Breadcrumb breadcrumb;

    @Mock
    private NavigationItem navigationItem;

    @InjectMocks
    private BreadcrumbSchemaAdapter adapter;

    private Resource resource;

    @BeforeEach
    void setUp() {
        resource = context.create().resource("/content/dhl/home/jcr:content/breadcrumb",
                "sling:resourceType", "dhl/components/content/breadcrumb");
        lenient().when(modelFactory.createModelFromWrappedRequest(context.request(), resource, Breadcrumb.class)).thenReturn(breadcrumb);
    }

    @Test
    void canHandle() {
        assertEquals(true, adapter.canHandle(resource));
    }

    @Test
    void toJson() {
        when(breadcrumb.getItems()).thenReturn(List.of(navigationItem));
        when(navigationItem.getTitle()).thenReturn("Home");
        when(navigationItem.getPath()).thenReturn("/content/dhl/home");

        JsonObject expected = SchemaMarkupUtils.createSchema(BREADCRUMB_LIST);
        expected.addProperty(TYPE_FIELD, BREADCRUMB_LIST.toString());
        expected.addProperty(CONTEXT_FIELD, HTTPS_SCHEMA_ORG_CONTEXT);

        JsonArray itemListElement = new JsonArray();
        JsonObject listItem = new JsonObject();
        listItem.addProperty(TYPE_FIELD, "ListItem");
        listItem.addProperty(POSITION, 1);
        listItem.addProperty(NAME, "Home");
        listItem.addProperty(ITEM, "/content/dhl/home");
        itemListElement.add(listItem);

        expected.add(ITEM_LIST_ELEMENT, itemListElement);

        JsonObject actual = adapter.toJson(resource, context.request());
        assertEquals(expected, actual);
    }
}