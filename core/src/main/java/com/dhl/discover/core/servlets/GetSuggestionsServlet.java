package com.dhl.discover.core.servlets;

import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.core.services.TagUtilService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.dhl.discover.core.utils.IndexUtils;
import com.dhl.discover.core.utils.QueryManagerUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.jetbrains.annotations.NotNull;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import javax.jcr.query.QueryManager;
import javax.servlet.Servlet;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.normalizeSpace;
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
    private static final String SUGGEST = "suggest";
    private static final String SPELLCHECK = "spellcheck";

    private static final int MAX_SUGGESTIONS = 5;

    @Reference
    private transient TagUtilService tagUtilService;

    @Reference
    private transient PageUtilService pageUtilService;

    @Reference
    private transient ResourceResolverHelper resolverHelper;

    @Override
    public void doGet(@NotNull SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");

        String body = null;
        try {
            body = processRequest(request);
        } catch (RepositoryException e) {
            body = "{ \"results\": [], \"status\": \"ko\", \"error\": \"Repository Exception\" }";
        }

        response.getWriter().write(body);
    }

    private String processRequest(SlingHttpServletRequest request) throws RepositoryException {
        String query = isValid(request.getParameter("s"));
        String homePagePath = request.getRequestPathInfo().getResourcePath();
        String indexName = getSuggestionIndexName(homePagePath);

        var queryManager = QueryManagerUtils.getQueryManager(request);

        List<String> tags = getTagsNamesByQuery(request, query, homePagePath);
        HashSet<String> allSuggestions = new LinkedHashSet<>(tags);

        if(allSuggestions.size() < MAX_SUGGESTIONS) {
            List<String> suggestions = getSuggestionRows(query, SUGGEST, indexName, queryManager);
            allSuggestions.addAll(suggestions);
        }

        if(allSuggestions.size() < MAX_SUGGESTIONS) {
            List<String> spellcheck = getSuggestionRows(query, SPELLCHECK, indexName, queryManager);
            allSuggestions.addAll(spellcheck);
        }

        var responseJson = new JsonObject();
        responseJson.addProperty("status", "ok");
        responseJson.addProperty("term", StringEscapeUtils.escapeHtml4(query));

        var results = new JsonArray();
        for (String s : allSuggestions) {
            results.add(new JsonPrimitive(StringEscapeUtils.escapeHtml4(s)));
        }
        responseJson.add("results", results);

        return responseJson.toString();
    }

    private List<String> getTagsNamesByQuery(SlingHttpServletRequest request, String query, String homePagePath) {
        if(StringUtils.isBlank(query)) {
            return new ArrayList<>();
        }

        var resolver = request.getResourceResolver();
        var locale = pageUtilService.getLocale(resolver.getResource(homePagePath));

        return tagUtilService.getTagLocalizedSuggestionsByQuery(resolver, query, "dhl:", locale, MAX_SUGGESTIONS);
    }

    private List<String> getSuggestionRows(String searchString, String mode, String indexName, QueryManager queryManager) throws RepositoryException {
        List<String> suggestions = new ArrayList<>();

        if(StringUtils.isBlank(indexName)) {
            return suggestions;
        }

        var base = getStringWithoutLastWord(searchString);
        var lastWord = getLastWord(searchString);

        List<String> suggestedWords = QueryManagerUtils.getSuggestedWords(lastWord, mode, indexName, queryManager);


        suggestedWords.forEach(suggestedWord -> {
            var fullSuggestion = StringUtils.joinWith(" ", base, suggestedWord).trim();
            if(!StringUtils.equalsIgnoreCase(searchString.trim(), fullSuggestion)) {
                suggestions.add(fullSuggestion);
            }
        });

        return suggestions;
    }

    private String getSuggestionIndexName(String homePath) {
        try(var resolver = resolverHelper.getReadResourceResolver()) {
            return IndexUtils.getSuggestionIndexName(homePath, resolver);
        }
    }

    private String getStringWithoutLastWord(String query) {
        return normalizeSpace(query).replaceAll(getLastWord(query) + "$", "").trim();
    }

    private String getLastWord(String query){
        return normalizeSpace(query).replaceAll("^.*\\s+", "");
    }

    private String isValid(String input) {
        return input.matches("^(?!.*[<>&])[a-zA-Z0-9\\s\\u00C0-\\u017F!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]+$") ? input : "";
    }
}
