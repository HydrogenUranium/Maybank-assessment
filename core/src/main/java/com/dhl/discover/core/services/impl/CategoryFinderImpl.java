/* 9fbef606107a605d69c0edbcd8029e5d */
package com.dhl.discover.core.services.impl;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.CategoryFinder;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import java.util.Map;

/**
 * Provides implementation of {@link CategoryFinder} interface.
 */
@Component(
		service = CategoryFinder.class
)
public class CategoryFinderImpl implements CategoryFinder {

	private static final Logger LOGGER = LoggerFactory.getLogger(CategoryFinderImpl.class);

	@Reference
	QueryBuilder queryBuilder;

	@Override
	public Page getGroupPage(String resourceTypeValue, Page page) {
		String pagePath = page.getPath();
		ValueMap pageProperties = page.getProperties();
		if(pageProperties.containsKey(ResourceResolver.PROPERTY_RESOURCE_TYPE)){
			boolean containsRequestedResourceType = pageProperties.get(ResourceResolver.PROPERTY_RESOURCE_TYPE,"").equalsIgnoreCase(resourceTypeValue);
			if(containsRequestedResourceType){
				return page;
			}
		}
		Page parentPage = page.getParent();
		if(null != parentPage){
			return getGroupPage(resourceTypeValue,parentPage);
		}
		LOGGER.warn("Neither page {} nor its parents contain the resource type {} - " +
				"there is likely to be no result in side nav", pagePath, resourceTypeValue);
		return null;
	}

	@Override
	public Page getGroupPage(String[] resourceTypeValues, Page page) {
		for (String resourceTypeValue : resourceTypeValues){
			Page foundPage = getGroupPage(resourceTypeValue,page);
			if(null != foundPage){
				return foundPage;
			}
		}
		return null;
	}

	@Override
	public SearchResult executeQuery(Map<String, String> predicatesMap, Session session) {
		if(null != session){
			PredicateGroup predicates = PredicateGroup.create(predicatesMap);
			String queryString = predicates.toString();
			LOGGER.info("Query to find the data: {}", queryString);
			Query query = queryBuilder.createQuery(predicates, session);
			return query.getResult();
		}
		return null;
	}

	@Override
	public SearchResult executeQuery(Map<String, String> predicatesMap, ResourceResolver resourceResolver) {
		Session session = resourceResolver.adaptTo(Session.class);
		if(null != session){
			return executeQuery(predicatesMap,session);
		}
		return null;
	}
}
