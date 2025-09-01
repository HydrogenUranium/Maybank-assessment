package com.dhl.discover.core.servlets;

import com.dhl.discover.core.services.ReferenceService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.jetbrains.annotations.NotNull;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import java.io.IOException;
import java.util.Set;

@Slf4j
@Component(service = {Servlet.class}, immediate = true)
@SlingServletResourceTypes(
        resourceTypes = "cq/Page",
        methods = HttpConstants.METHOD_GET,
        extensions = "json",
        selectors = "page-references"
)
public class PageReferencesServlet extends SlingSafeMethodsServlet {

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    @Reference
    private transient ReferenceService referenceService;

    @Override
    public void doGet(@NotNull SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");

        String body = processRequest(request);

        response.getWriter().write(body);
    }

    private String processRequest(SlingHttpServletRequest request) {
        String path = request.getResource().getPath();

        try(var resolver = resourceResolverHelper.getReadResourceResolver()) {
            return buildJsonResponse(path, referenceService.search(resolver, path));
        }
    }

    private String buildJsonResponse(String query, Set<String> paths) {
        var responseJson = new JsonObject();
        responseJson.addProperty("status", "ok");
        responseJson.addProperty("page", StringEscapeUtils.escapeHtml4(query));

        var results = new JsonArray();
        for (String suggestion : paths) {
            results.add(new JsonPrimitive(StringEscapeUtils.escapeHtml4(suggestion)));
        }
        responseJson.add("references", results);

        return responseJson.toString();
    }
}
