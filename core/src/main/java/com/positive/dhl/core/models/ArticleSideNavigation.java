package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

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
import com.day.cq.wcm.api.Page;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class ArticleSideNavigation {
	@Inject
	private SlingHttpServletRequest request;

	@Inject
	private ResourceResolver resourceResolver;
    
	@Inject
	private Page currentPage;
	
	private List<Article> articles;

    /**
	 * 
	 */
	public List<Article> getArticles() {
		return new ArrayList<>(articles);
	}

    /**
	 * 
	 */
	public void setArticles(List<Article> articles) {
		this.articles = new ArrayList<>(articles);
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() throws RepositoryException {
		articles = new ArrayList<>();
		
		Resource relatedArticlePaths = currentPage.getContentResource("items");
		if (relatedArticlePaths != null) {
			Iterator<Resource> relatedArticlePathsIterator = relatedArticlePaths.listChildren();
			while (relatedArticlePathsIterator.hasNext()) {
				ValueMap props = relatedArticlePathsIterator.next().adaptTo(ValueMap.class);
				if (props != null) {
					String url = props.get("url", "");
					
					Article article = new Article(url, resourceResolver);
					if (Boolean.TRUE.equals(article.getValid())) {
						articles.add(article);
					}
				}
			}
		}

		if (articles.isEmpty()) {
			final QueryBuilder builder = request.getResourceResolver().adaptTo(QueryBuilder.class);
			if (builder != null) {
				Page categoryPage = getGroupPage(currentPage.getParent());
				
				Map<String, String> map = new HashMap<>();
				map.put("type", "cq:Page");
				map.put("path", categoryPage.getPath());
				map.put("group.p.or", "true");
    			
    			List<String> articleTypes = Article.GetArticlePageTypes();
    			for (int x = 0; x < articleTypes.size(); x++) {
    				map.put(String.format("group.%1$s_property", (x + 1)), "jcr:content/sling:resourceType");
    				map.put(String.format("group.%1$s_property.value", (x + 1)), String.format("dhl/components/pages/%1$s", articleTypes.get(x)));
    				map.put(String.format("group.%1$s_property.operation", (x + 1)), "like");
    			}
    			
				Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
		        SearchResult searchResult = query.getResult();
		        if (searchResult != null) {
					int count = 0;
					for (Hit hit: searchResult.getHits()) {
						ValueMap properties = hit.getProperties();
						boolean hideInNav = properties.get("hideInNav", false);
						if (!hideInNav) {
							if (!currentPage.getPath().equals(hit.getPath())) {
								Article article = new Article(hit.getPath(), resourceResolver);
								
								if (Boolean.TRUE.equals(article.getValid())) {
									article.setIndex(count);
									article.setThird(article.getIndex() % 3 == 0);
									articles.add(article);
									
									count++;
								}
							}
						}
					}

					Iterator<Resource> resources = searchResult.getResources();
					if (resources.hasNext()) {
						resources.next().getResourceResolver().close();
					}
		        }
			}
		}
	}
	
    /**
	 * 
	 */
	private Page getGroupPage(Page parent) {
		ValueMap properties = parent.adaptTo(ValueMap.class);
		if ((properties != null) && ("dhl/components/pages/articlecategory").equals(properties.get("jcr:content/sling:resourceType", ""))) {
			return parent;
		}
		return getGroupPage(parent.getParent());
	}
}