package com.dhl.discover.core.services;


import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.RepositoryException;
import javax.jcr.query.QueryManager;
import java.util.List;
import java.util.Set;

public interface SuggestionsService {
    List<String> getTagsNamesByQuery(ResourceResolver resourceResolver, String query, String homePagePath);

    List<String> getSuggestionRows(String searchString, String mode, String indexName, QueryManager queryManager)
            throws RepositoryException;

    String getSuggestionIndexName(String homePath);

    String isValid(String input);

    Set<String> collectSuggestions(ResourceResolver resourceResolver, String query,
                                   String homePagePath, String indexName) throws RepositoryException;

}
