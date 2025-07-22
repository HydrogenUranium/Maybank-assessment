package com.dhl.discover.core.services.impl;

import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.core.services.SuggestionsService;
import com.dhl.discover.core.services.TagUtilService;
import com.dhl.discover.core.utils.IndexUtils;
import com.dhl.discover.core.utils.QueryManagerUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import javax.jcr.query.QueryManager;

import java.util.*;

import static org.apache.commons.lang3.StringUtils.normalizeSpace;

@Slf4j
@Component(service = SuggestionsService.class)
public class SuggestionsServiceImpl implements SuggestionsService {

    private static final String SUGGEST = "suggest";
    private static final String SPELLCHECK = "spellcheck";

    private static final int MAX_SUGGESTIONS = 5;

    @Reference
    private TagUtilService tagUtilService;

    @Reference
    private PageUtilService pageUtilService;

    @Reference
    private ResourceResolverHelper resolverHelper;

    @Override
    public  Set<String> collectSuggestions(ResourceResolver resourceResolver, String query,
                                           String homePagePath, String indexName) throws RepositoryException {
        var queryManager = QueryManagerUtils.getQueryManager(resourceResolver);
        Set<String> allSuggestions = new LinkedHashSet<>();

        List<String> tags = getTagsNamesByQuery(resourceResolver, query, homePagePath);
        allSuggestions.addAll(tags);

        if(allSuggestions.size() < MAX_SUGGESTIONS) {
            List<String> suggestions = getSuggestionRows(query, SUGGEST, indexName, queryManager);
            allSuggestions.addAll(suggestions);
        }

        if(allSuggestions.size() < MAX_SUGGESTIONS) {
            List<String> spellcheck = getSuggestionRows(query, SPELLCHECK, indexName, queryManager);
            allSuggestions.addAll(spellcheck);
        }
        return allSuggestions;
    }


    @Override
    public List<String> getTagsNamesByQuery(ResourceResolver resolver, String query, String homePagePath) {
        if (StringUtils.isBlank(query)) {
            return Collections.emptyList();
        }
        var resource = resolver.getResource(homePagePath);
        if (resource == null) {
            log.warn("Resource not found for path: {}", homePagePath);
            return Collections.emptyList();
        }
        var locale = pageUtilService.getLocale(resource);

        return tagUtilService.getTagLocalizedSuggestionsByQuery(resolver, query, "dhl:", locale, MAX_SUGGESTIONS);
    }

    @Override
    public List<String> getSuggestionRows(String searchString, String mode, String indexName,
                                          QueryManager queryManager) throws RepositoryException {
        List<String> suggestions = new ArrayList<>();

        if (StringUtils.isBlank(indexName) || StringUtils.isBlank(searchString)) {
            return suggestions;
        }

        String base = getStringWithoutLastWord(searchString);
        String lastWord = getLastWord(searchString);

        List<String> suggestedWords = QueryManagerUtils.getSuggestedWords(lastWord, mode, indexName, queryManager);

        for (String suggestedWord : suggestedWords) {
            String fullSuggestion = StringUtils.joinWith(" ", base, suggestedWord).trim();
            if (!StringUtils.equalsIgnoreCase(searchString.trim(), fullSuggestion)) {
                suggestions.add(fullSuggestion);
            }
        }

        return suggestions;
    }

    @Override
    public String getSuggestionIndexName(String homePath) {
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
    @Override
    public String isValid(String input) {
        return input.matches("^(?!.*[<>&])[a-zA-Z0-9\\s\\u00C0-\\u017F!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]+$") ? input : "";
    }

}
