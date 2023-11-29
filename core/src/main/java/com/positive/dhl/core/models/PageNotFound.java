package com.positive.dhl.core.models;

import java.util.*;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.Setter;
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
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import static com.day.cq.wcm.api.constants.NameConstants.NT_PAGE;
import static com.day.cq.wcm.api.constants.NameConstants.PN_HIDE_IN_NAV;

@Getter
@Setter
@Model(adaptables=SlingHttpServletRequest.class)
public class PageNotFound {
	@OSGiService
	private PageUtilService pageUtilService;

    @Inject
    private QueryBuilder builder;

	@Inject
	private ResourceResolver resourceResolver;
	
	private String searchResultsPage;
	private List<Article> trendingArticles;
	
	@PostConstruct
    protected void init() throws RepositoryException {
        if (builder != null) {
			//get search-results
			Map<String, String> map = new HashMap<>();
			map.put("type", NT_PAGE);
			map.put("property", "jcr:content/sling:resourceType");
			map.put("property.value", "dhl/components/pages/searchresults");
			Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
		    SearchResult searchResult = query.getResult();
		    if (searchResult != null) {
				searchResultsPage = searchResult.getHits().get(0).getPath().concat(".html");

				Iterator<Resource> resources = searchResult.getResources();
				if (resources.hasNext()) {
					resources.next().getResourceResolver().close();
				}
		    }
        }
        
		trendingArticles = new ArrayList<>();
		if (builder != null) {
			Map<String, String> map = new HashMap<>();
			map.put("type", NT_PAGE);

			map.put("group.p.or", "true");
			
			List<String> articleTypes = Article.getArticlePageTypes();
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
					boolean hideInNav = hitProperties.get(PN_HIDE_IN_NAV, false);
					if (!hideInNav) {
						Article article = pageUtilService.getArticle(hit.getPath(), resourceResolver);
						article.setIndex(count);
						trendingArticles.add(article);

						count++;

						if (count > 3) break;
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
