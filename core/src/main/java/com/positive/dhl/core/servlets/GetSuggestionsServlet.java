package com.positive.dhl.core.servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.ResourceResolverHelper;
import com.positive.dhl.core.services.TagUtilService;
import com.positive.dhl.core.utils.IndexUtils;
import com.positive.dhl.core.utils.QueryManagerUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
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
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.normalizeSpace;

@Component(
        service = Servlet.class,
        property = {
                Constants.SERVICE_DESCRIPTION + "=DHL Suggestions Servlet",
                "sling.servlet.methods=" + HttpConstants.METHOD_GET,
                "sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/suggestions/index.json"
        }
)
public class GetSuggestionsServlet extends SlingAllMethodsServlet {
    private static final String SUGGEST = "suggest";
    private static final String SPELLCHECK = "spellcheck";

    @Reference
    private TagUtilService tagUtilService;

    @Reference
    private PageUtilService pageUtilService;

    @Reference
    private ResourceResolverHelper resolverHelper;

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
        String query = request.getParameter("s");
        String homePagePath = request.getParameter("homepagepath");
        String indexName = getSuggestionIndexName(homePagePath);
        var queryManager = QueryManagerUtils.getQueryManager(request);

        List<String> tags = getTagsByQuery(request, query, homePagePath);
        List<String> suggestions = getSuggestionRows(query, SUGGEST, indexName, queryManager);
        List<String> spellcheck = getSuggestionRows(query, SPELLCHECK, indexName, queryManager);

        List<String> allSuggestions = new ArrayList<>();
        allSuggestions.addAll(tags);
        allSuggestions.addAll(suggestions);
        allSuggestions.addAll(spellcheck);

        Set<String> uniqueSuggestionsLowerCase = new HashSet<>();
        List<String> uniqueSuggestions = allSuggestions.stream()
                .filter(suggestion -> uniqueSuggestionsLowerCase.add(suggestion.toLowerCase()))
                .collect(Collectors.toList());

        var responseJson = new JsonObject();
        responseJson.addProperty("status", "ok");
        responseJson.addProperty("term", StringEscapeUtils.escapeHtml4(query));

        var results = new JsonArray();
        for (String s : uniqueSuggestions) {
            results.add(new JsonPrimitive(StringEscapeUtils.escapeHtml4(s)));
        }
        responseJson.add("results", results);

        return responseJson.toString();
    }

    private List<String> getTagsByQuery(SlingHttpServletRequest request, String query, String homePagePath) {
        if(StringUtils.isBlank(query)) {
            return new ArrayList<>();
        }

        var resolver = request.getResourceResolver();
        var locale = pageUtilService.getLocale(resolver.getResource(homePagePath));

        return tagUtilService
                .getTagsByLocalizedPrefix(resolver, query, "dhl:", locale)
                .stream().map(tag -> tag.getTitle(locale).trim())
                .filter(title -> !StringUtils.equalsIgnoreCase(query, title))
                .sorted(String::compareTo)
                .collect(Collectors.toList());
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
}
