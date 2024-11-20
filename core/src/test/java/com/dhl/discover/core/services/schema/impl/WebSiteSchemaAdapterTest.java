package com.dhl.discover.core.services.schema.impl;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.constants.SchemaMarkupType;
import com.google.gson.JsonObject;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.dhl.discover.core.utils.SchemaMarkupUtils.createSchema;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.createType;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class WebSiteSchemaAdapterTest {

    AemContext context = new AemContext();

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private PageUtilService pageUtilService;

    @InjectMocks
    private WebSiteSchemaAdapter adapter;

    @Test
    void canHandle() {
        Resource resource = context.create().resource("/content/home",
                "sling:resourceType", WebSiteSchemaAdapter.RESOURCE_TYPE,
                WebSiteSchemaAdapter.COUNTRY_FIELD, "Global",
                WebSiteSchemaAdapter.SEARCH_RESULT_PAGE_FIELD, "/content/home/search");

        assertTrue(adapter.canHandle(resource));
    }

    @Test
    void toJson() {
        when(pathUtilService.getFullMappedPath(anyString(), any()))
                .thenAnswer(invocationOnMock -> "https://www.example.com" + invocationOnMock.getArgument(0));
        Page page = context.create().page("/content/home", "home",
                "sling:resourceType", WebSiteSchemaAdapter.RESOURCE_TYPE,
                WebSiteSchemaAdapter.COUNTRY_FIELD, "Global",
                WebSiteSchemaAdapter.SEARCH_RESULT_PAGE_FIELD, "/content/home/search");
        when(pageUtilService.getHomePage(any(Resource.class))).thenReturn(page);

        JsonObject json = adapter.toJson(page.getContentResource(), context.request());

        JsonObject expected = createSchema(SchemaMarkupType.WEB_SITE);
        expected.addProperty("name", "DHL Discover Global");
        expected.addProperty("url", "https://www.example.com/content/home");
        var potentialActionJson = createType(SchemaMarkupType.SEARCH_ACTION);
        potentialActionJson.addProperty("target",  "https://www.example.com/content/home/search?searchfield={search_term_string}");
        potentialActionJson.addProperty("query-input", "required name=search_term_string");
        expected.add("potentialAction", potentialActionJson);

        assertEquals(expected, json);
    }
}