package com.dhl.discover.core.services;


import org.apache.sling.api.SlingHttpServletRequest;

import javax.jcr.RepositoryException;
import javax.jcr.query.QueryManager;
import java.util.List;
import java.util.Set;

public interface SuggestionsService {
    String processRequest(SlingHttpServletRequest request) throws RepositoryException;

    List<String> getTagsNamesByQuery(SlingHttpServletRequest request, String query, String homePagePath);

    List<String> getSuggestionRows(String searchString, String mode, String indexName, QueryManager queryManager)
            throws RepositoryException;

    String getSuggestionIndexName(String homePath);

    String isValid(String input);

    Set<String> collectSuggestions(SlingHttpServletRequest request, String query,
                                   String homePagePath, String indexName) throws RepositoryException;

}
