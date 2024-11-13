package com.dhl.discover.core.services;

import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.Session;
import java.util.Map;

/**
 * Provides functionality to search 'categories' as children or descendants of specific nodes, required by multiple components
 */
public interface CategoryFinder {

	/**
	 * Returns a page that serves as 'category home' for articles
	 * @param resourceTypeValue is the value we try to find in the page's (or its parents') properties
	 * @param page is an instance of {@link Page} where we start the search
	 * @return a {@code Page} that serves as 'category home' or {@code null} in case nothing is found
	 */
	Page getGroupPage(String resourceTypeValue, Page page);

	/**
	 * Very similar to {@link CategoryFinder#getGroupPage(String, Page)} with the ability to search for multiple resource types at once
	 * @param resourceTypeValues is an array of resource types (provided as {@code String}s
	 * @param page is an instance of {@link Page} where we start the search
	 * @return a {@code Page} that serves as 'category home' or {@code null} in case nothing is found. First found {@code Page} is returned, if there
	 * are multiple matches, the first one wins
	 */
	Page getGroupPage(String[] resourceTypeValues, Page page);

	/**
	 * Executes the query against AEM using the provided {@link Map} as a way to
	 * build the query from {@code predicates} and returns the {@link SearchResult} as response
	 * @param predicatesMap is a {@code Map} of {@code String}s a both keys & values
	 * @param session is an instance of JCR Session
	 * @return an instance of {@code SearchResult} object, may be empty or even {@code null} (if it is null, then something went wrong)
	 */
	SearchResult executeQuery(Map<String,String> predicatesMap, Session session);

	/**
	 * Executes the query against AEM using the provided {@link Map} as a way to build the
	 * query from {@code predicates} and returns the {@link SearchResult} as response
	 * @param predicatesMap is a {@code Map} of {@code String}s a both keys & values
	 * @param resourceResolver is an instance of Sling {@link ResourceResolver} that we leverage to access the repository
	 * @return an instance of {@code SearchResult} object, may be empty or even {@code null} (if it is null, then something went wrong)
	 */
	SearchResult executeQuery(Map<String,String> predicatesMap, ResourceResolver resourceResolver);
}
