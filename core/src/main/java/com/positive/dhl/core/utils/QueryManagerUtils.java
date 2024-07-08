package com.positive.dhl.core.utils;

import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.Row;
import javax.jcr.query.RowIterator;
import java.util.ArrayList;
import java.util.List;

@UtilityClass
public class QueryManagerUtils {
    private static final String SUGGEST = "suggest";
    private static final String SPELLCHECK = "spellcheck";

    public static QueryManager getQueryManager (SlingHttpServletRequest request) throws RepositoryException {
        return getQueryManager(RequestUtils.getSession(request));
    }

    public static QueryManager getQueryManager (ResourceResolver resolver) throws RepositoryException {
        return getQueryManager(resolver.adaptTo(Session.class));
    }

    public static QueryManager getQueryManager (Session session) throws RepositoryException {
        if(session == null) {
            return null;
        }
        return session.getWorkspace().getQueryManager();
    }

    public static List<String> getSuggestedWords (String searchString, String indexName, QueryManager queryManager) throws RepositoryException {
        return getSuggestedWords(searchString, SUGGEST, indexName, queryManager);
    }

    public static List<String> getSpellcheckedWords(String searchString, String indexName, QueryManager queryManager) throws RepositoryException {
        return getSuggestedWords(searchString, SPELLCHECK, indexName, queryManager);
    }

    public static List<String> getSuggestedWords(String searchString, String mode, String indexName, QueryManager queryManager) throws RepositoryException {
        List<String> suggestions = new ArrayList<>();

        if(StringUtils.isBlank(indexName)) {
            return suggestions;
        }

        var queryString = String.format("SELECT [rep:%s()]  FROM [nt:unstructured] WHERE %s('%s') AND ISDESCENDANTNODE('') OPTION(INDEX NAME [%s])",
                mode, mode, searchString, indexName);
        var query = queryManager.createQuery(queryString, Query.JCR_SQL2);

        RowIterator rows = query.execute().getRows();
        while (rows.hasNext()) {
            var suggestion = ((Row) rows.next()).getValue("rep:" + mode + "()").getString();
            suggestions.add(suggestion);
        }

        return suggestions;
    }
}
