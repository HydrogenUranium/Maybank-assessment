package com.positive.dhl.core.models;

import java.util.*;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.SlingHttpServletRequest;
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
@Model(adaptables=SlingHttpServletRequest.class)
public class PageNotFound {
    @Inject
    private QueryBuilder builder;

	@Inject
	private ResourceResolver resourceResolver;
	
	private String searchResultsPage;
	private List<Article> trendingArticles;
	
    /**
	 * 
	 */
	public String getSearchResultsPage() {
		return searchResultsPage;
	}

    /**
	 * 
	 */
	public void setSearchResultsPage(String searchResultsPage) {
		this.searchResultsPage = searchResultsPage;
	}

    /**
	 * 
	 */
	public List<Article> getTrendingArticles() {
		return new ArrayList<Article>(trendingArticles);
	}

    /**
	 * 
	 */
	public void setTrendingArticles(List<Article> trendingArticles) {
		this.trendingArticles = new ArrayList<Article>(trendingArticles);
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() throws RepositoryException {
        if (builder != null) {
			//get search-results
			Map<String, String> map = new HashMap<String, String>();
			map.put("type", NameConstants.NT_PAGE);
			map.put("property", "jcr:content/sling:resourceType");
			map.put("property.value", "dhl/components/pages/searchresults");
			Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
		    SearchResult searchResult = query.getResult();
		    if (searchResult != null) {
				for (Hit hit: searchResult.getHits()) {
					searchResultsPage = hit.getPath().concat(".html");
					break;
				}

				Iterator<Resource> resources = searchResult.getResources();
				if (resources.hasNext()) {
					resources.next().getResourceResolver().close();
				}
		    }
        }
        
		trendingArticles = new ArrayList<Article>();
		if (builder != null) {
			Map<String, String> map = new HashMap<String, String>();
			map.put("type", NameConstants.NT_PAGE);

			map.put("group.p.or", "true");
			
			List<String> articleTypes = Article.GetArticlePageTypes();
			for (int x = 0; x < articleTypes.size(); x++) {
				map.put(String.format("group.%1$s_property", (x + 1)), "jcr:content/sling:resourceType");
				map.put(String.format("group.%1$s_property.value", (x + 1)), String.format("dhl/components/pages/%1$s", articleTypes.get(x)));
				map.put(String.format("group.%1$s_property.operation", (x + 1)), "like");
			}
			
			map.put("orderby", "@jcr:content/custompublishdate");
			map.put("orderby.sort", "desc");
			
			map.put("p.limit", "3");

			Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
	        SearchResult searchResult = query.getResult();
	        if (searchResult != null) {
				int count = 0;
				for (Hit hit: searchResult.getHits()) {
					ValueMap hitProperties = hit.getProperties();
					Boolean hideInNav = hitProperties.get("hideInNav", false);
					if (hideInNav) {
						continue;
					}
					
					Article article = new Article(hit.getPath(), resourceResolver);
					article.setIndex(count);
					trendingArticles.add(article);
    				
					count++;
					
					if (count > 3) break;
				}

				Iterator<Resource> resources = searchResult.getResources();
				if (resources.hasNext()) {
					resources.next().getResourceResolver().close();
				}
	        }
		}
	}
}