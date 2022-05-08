package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

import com.day.cq.wcm.api.NameConstants;

/**
 *
 */
@Model(adaptables=Resource.class)
public class CategoryListingItem {
	private String name;
	private List<Article> articles;
	
    /**
	 * 
	 */
	public String getName() {
		return name;
	}

    /**
	 * 
	 */
	public void setName(String name) {
		this.name = name;
	}

    /**
	 * 
	 */
	public List<Article> getArticles() {
		if (articles == null) {
			articles = new ArrayList<Article>();
		}
		return new ArrayList<Article>(articles);
	}

    /**
	 * 
	 */
	public void setArticles(List<Article> articles) {
		this.articles = new ArrayList<Article>(articles);
	}

    /**
	 * 
	 */
	public CategoryListingItem(String path, QueryBuilder builder, ResourceResolver resourceResolver) throws RepositoryException {
		Resource resource = resourceResolver.getResource(path);
		if (resource != null) {
    		ValueMap properties = resource.adaptTo(ValueMap.class);
    		if (properties != null) {
    			name = properties.get("jcr:content/navTitle", "");
    			if ((name == null) || (name.trim().length() == 0)) {
    				name = properties.get("jcr:content/jcr:title", "");
    			}
    		}

    		articles = new ArrayList<Article>();
    		if (builder != null) {
    			Map<String, String> map = new HashMap<String, String>();
    			map.put("type", NameConstants.NT_PAGE);
    			map.put("path", resource.getPath());
    			
    			map.put("1_group.property", "jcr:content/hideInNav");
    			map.put("1_group.operation", "exists");
    			map.put("1_group.value", "false");
    			
    			map.put("2_group.p.or", "true");
    			
    			List<String> articleTypes = Article.GetArticlePageTypes();
    			for (int x = 0; x < articleTypes.size(); x++) {
    				map.put(String.format("2_group.%1$s_property", (x + 1)), "jcr:content/sling:resourceType");
    				map.put(String.format("2_group.%1$s_property.value", (x + 1)), String.format("dhl/components/pages/%1$s", articleTypes.get(x)));
    				map.put(String.format("2_group.%1$s_property.operation", (x + 1)), "like");
    			}
    			
    			map.put("orderby", "jcr:content/custompublishdate");
    			map.put("orderby.sort", "desc");
    			map.put("p.limit", "-1");

    			Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
    	        SearchResult searchResult = query.getResult();
    	        if (searchResult != null) {
    				for (Hit hit: searchResult.getHits()) {
    					ValueMap hitProperties = hit.getProperties();
    					Boolean hideInNav = hitProperties.get("hideInNav", false);
    					if (hideInNav) {
    						continue;
    					}
    					
    					if (articles.size() < 5) {
    						articles.add(new Article(hit.getPath(), resourceResolver));
    					} else {
    						break;
    					}
    				}
    	        }
    		}
		}
	}
}