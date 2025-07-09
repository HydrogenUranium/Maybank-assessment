package com.dhl.discover.core.models;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.dhl.discover.core.services.ArticleUtilService;
import com.dhl.discover.core.services.PageUtilService;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.osgi.service.component.annotations.Reference;

import static com.day.cq.wcm.api.constants.NameConstants.NT_PAGE;
import static com.day.cq.wcm.api.constants.NameConstants.PN_HIDE_IN_NAV;

@Model(adaptables=SlingHttpServletRequest.class)
public class PageNotFound {

	@OSGiService
	private ArticleUtilService articleUtilService;

	private final QueryBuilder builder;

	private final ResourceResolver resourceResolver;

	@Getter
	@Setter
	private String searchResultsPage;

	@Getter
	@Setter
	private List<Article> trendingArticles;

	@Inject
	public PageNotFound(QueryBuilder builder, SlingHttpServletRequest request) {
		this.builder = builder;
		this.resourceResolver = request.getResourceResolver();
	}

    @PostConstruct
    protected void init() throws RepositoryException {
        if (builder != null) {
			searchResultsPage = receiveSearchResultsPage();
			trendingArticles = receiveTrendingArticles();
        }
	}

	private String receiveSearchResultsPage() throws RepositoryException {
		String result = StringUtils.EMPTY;
		Map<String, String> map = new HashMap<>();
		map.put("type", NT_PAGE);
		map.put("property", "jcr:content/sling:resourceType");
		map.put("property.value", "dhl/components/pages/searchresults");
		var query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
		var searchResult = query.getResult();
		if (searchResult != null) {
			result = searchResult.getHits().get(0).getPath().concat(".html");

			Iterator<Resource> resources = searchResult.getResources();
			if (resources.hasNext()) {
				resources.next().getResourceResolver().close();
			}
		}

		return result;
	}

	private List<Article> receiveTrendingArticles() throws RepositoryException {
		List<Article> result = new ArrayList<>();
		var query = builder.createQuery(PredicateGroup.create(getArticlesPageTypeQueryMap()), resourceResolver.adaptTo(Session.class));
		var searchResult = query.getResult();
		if (searchResult != null) {
			var count = 0;
			for (Hit hit: searchResult.getHits()) {
				var article = getArticle(hit);
				if (article != null) {
					article.setIndex(count);
					result.add(article);
					count++;
				}
				if (count > 3) break;
			}

			Iterator<Resource> resources = searchResult.getResources();
			if (resources.hasNext()) {
				resources.next().getResourceResolver().close();
			}
		}
		return result;
	}

	private Article getArticle(Hit hit) throws RepositoryException {
		ValueMap hitProperties = hit.getProperties();
		boolean hideInNav = hitProperties.get(PN_HIDE_IN_NAV, false);
		return !hideInNav ? articleUtilService.getArticle(hit.getPath(), resourceResolver) : null;
	}

	private Map<String, String> getArticlesPageTypeQueryMap() {
		Map<String, String> map = new HashMap<>();
		map.put("type", NT_PAGE);

		map.put("group.p.or", "true");

		List<String> articleTypes = Article.getArticlePageTypes();
		for (var x = 0; x < articleTypes.size(); x++) {
			map.put(String.format("group.%1$s_property", (x + 1)), "jcr:content/sling:resourceType");
			map.put(String.format("group.%1$s_property.value", (x + 1)), String.format("dhl/components/pages/%1$s", articleTypes.get(x)));
			map.put(String.format("group.%1$s_property.operation", (x + 1)), "like");
		}

		map.put("orderby", "@jcr:content/custompublishdate");
		map.put("orderby.sort", "desc");

		map.put("p.limit", "3");
		return map;
	}
}
