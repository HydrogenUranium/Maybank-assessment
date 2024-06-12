package com.positive.dhl.core.services.schema.impl;

import com.day.cq.wcm.api.Page;
import com.google.gson.JsonObject;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import com.positive.dhl.core.services.schema.AbstractSchemaAdapter;
import com.positive.dhl.core.services.schema.SchemaAdapter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import static com.positive.dhl.core.constants.SchemaMarkupType.SEARCH_ACTION;
import static com.positive.dhl.core.constants.SchemaMarkupType.WEB_SITE;
import static com.positive.dhl.core.utils.SchemaMarkupUtils.createSchema;
import static com.positive.dhl.core.utils.SchemaMarkupUtils.createType;

@Component(service = SchemaAdapter.class)
public class WebSiteSchemaAdapter extends AbstractSchemaAdapter {
    public static final String RESOURCE_TYPE = "dhl/components/pages/editable-home-page";
    public static final String SEARCH_RESULT_PAGE_FIELD = "searchBar-searchResultPage";
    public static final String COUNTRY_FIELD = "siteregion";

    @Reference
    private PathUtilService pathUtilService;

    @Reference
    private PageUtilService pageUtilService;

    @Override
    public boolean canHandle(Resource resource) {
        return resource.isResourceType(RESOURCE_TYPE)
                && hasFields(resource, SEARCH_RESULT_PAGE_FIELD, COUNTRY_FIELD);
    }

    @Override
    public JsonObject toJson(Resource resource, SlingHttpServletRequest request) {
        var homePage = pageUtilService.getHomePage(resource);
        var valueMap = homePage.getProperties();

        JsonObject json = createSchema(WEB_SITE);
        json.addProperty("name", "DHL Discover " + valueMap.get(COUNTRY_FIELD));
        json.addProperty("url", pathUtilService.getFullMappedPath(homePage.getPath(), request));

        String searchPath = pathUtilService.getFullMappedPath(valueMap.get(SEARCH_RESULT_PAGE_FIELD, ""), request);
        var potentialActionJson = createType(SEARCH_ACTION);
        potentialActionJson.addProperty("target",  searchPath + "?searchfield={search_term_string}");
        potentialActionJson.addProperty("query-input", "required name=search_term_string");

        json.add("potentialAction", potentialActionJson);
        return json;
    }
}
