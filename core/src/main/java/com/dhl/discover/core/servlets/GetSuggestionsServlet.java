package com.dhl.discover.core.servlets;

import com.dhl.discover.core.services.SuggestionsService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.jetbrains.annotations.NotNull;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import javax.servlet.Servlet;
import java.io.IOException;
import java.util.Set;

@Component(
        service = Servlet.class,
        property = {
                Constants.SERVICE_DESCRIPTION + "=DHL Suggestions Servlet",
                "sling.servlet.methods=GET",
                "sling.servlet.resourceTypes=cq/Page",
                "sling.servlet.selectors=suggestions",
                "sling.servlet.extensions=json"
        }
)
public class GetSuggestionsServlet extends SlingAllMethodsServlet {
    private static final long serialVersionUID = 1L;

    private static final String ERROR_RESPONSE_TEMPLATE =
            "{ \"results\": [], \"status\": \"ko\", \"error\": \"%s\" }";

    @Reference
    private transient SuggestionsService suggestionService;

    @Override
    public void doGet(@NotNull SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");

        String body = null;
        try {
            body = processRequest(request);
        } catch (RepositoryException e) {
            body = String.format(ERROR_RESPONSE_TEMPLATE, "Repository Exception");
        }

        response.getWriter().write(body);
    }

    public String processRequest(SlingHttpServletRequest request) throws RepositoryException {
        String query = suggestionService.isValid(request.getParameter("s"));
        String homePagePath = request.getRequestPathInfo().getResourcePath();
        String indexName = suggestionService.getSuggestionIndexName(homePagePath);

        Set<String> suggestions = suggestionService.collectSuggestions(request.getResourceResolver(), query, homePagePath, indexName);

        return buildJsonResponse(query, suggestions);

    }
    private String buildJsonResponse(String query, Set<String> suggestions) {
        var responseJson = new JsonObject();
        responseJson.addProperty("status", "ok");
        responseJson.addProperty("term", StringEscapeUtils.escapeHtml4(query));

        var results = new JsonArray();
        for (String suggestion : suggestions) {
            results.add(new JsonPrimitive(StringEscapeUtils.escapeHtml4(suggestion)));
        }
        responseJson.add("results", results);

        return responseJson.toString();
    }
}
