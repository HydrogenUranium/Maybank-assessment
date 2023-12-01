package com.positive.dhl.core.models;

import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.constants.DiscoverConstants;
import com.positive.dhl.core.services.CategoryFinder;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.ResourceResolverHelper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE;
import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_STATIC_RESOURCE_TYPE;

/**
 * Serves as a Sling model for ArticleSideNavigation functionality used in home page template
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class ArticleSideNavigation {

	private static final Logger LOGGER = LoggerFactory.getLogger(ArticleSideNavigation.class);

	@OSGiService
	private PageUtilService pageUtilService;

	@Inject
	private CategoryFinder categoryFinder;

	@Inject
	private QueryBuilder builder;
    
	@Inject
	private Page currentPage;

	@Inject
	private ResourceResolverHelper resourceResolverHelper;
	
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

	private List<Article> processItems(Page page, ResourceResolver resourceResolver){
		List<Article> articleList = new ArrayList<>();
		Resource relatedArticlePaths = page.getContentResource("items");
		if (relatedArticlePaths != null) {
			String resource = relatedArticlePaths.getPath();
			LOGGER.info("Going to iterate {} to look for property 'url' - this will populate the 'side navigation'", resource);
			Iterator<Resource> relatedArticlePathsIterator = relatedArticlePaths.listChildren();
			while (relatedArticlePathsIterator.hasNext()) {
				ValueMap props = relatedArticlePathsIterator.next().adaptTo(ValueMap.class);
				if (props != null) {
					String url = props.get("url", "");

					Article article = pageUtilService.getArticle(url, resourceResolver);
					if (article.isValid()) {
						articleList.add(article);
					}
				}
			}
		} else {
			String pagePath = page.getPath();
			LOGGER.info("There is no 'items' property in page {}, we'll attempt to " +
					"find links with which to populate the 'side navigation' links differently.", pagePath);
		}
		return articleList;
	}

	private SearchResult runQuery(Page page, ResourceResolver resourceResolver){
		Map<String,String> predicatesMap = DiscoverConstants.getArticlesQueryMap();
		predicatesMap.put("path", page.getPath());
		return categoryFinder.executeQuery(predicatesMap,resourceResolver);
	}

	private List<Article> processSearchResult(SearchResult searchResult, ResourceResolver resourceResolver){
		List<Article> articleList = new ArrayList<>();
		int count = 0;
		try {
			for (Hit hit: searchResult.getHits()) {
				ValueMap properties = hit.getProperties();
				boolean hideInNav = properties.get("hideInNav", false);
				if (!hideInNav && !currentPage.getPath().equals(hit.getPath())) {
					Article article = pageUtilService.getArticle(hit.getPath(), resourceResolver);
					if (article.isValid()) {
						article.setIndex(count);
						article.setThird(article.getIndex() % 3 == 0);
						articleList.add(article);
						count++;
					}
				}
			}
		} catch (RepositoryException e) {
			LOGGER.info("Exception has occurred", e);
			LOGGER.error("Repository exception was swallowed when trying to access the search results");
		}

		return articleList;
	}

	/**
	 * Standard 'initialization' method of a Sling Model; sets up everything we need.
	 */
	@PostConstruct
    protected void init() {
		ResourceResolver resourceResolver = resourceResolverHelper.getReadResourceResolver();
		articles = new ArrayList<>();
		if(null != resourceResolver){
			articles.addAll(processItems(currentPage, resourceResolver));

			if (articles.isEmpty() && null != builder) {
				Page parentPage = currentPage.getParent();
				if (null != parentPage){
					Page categoryPage = categoryFinder.getGroupPage(CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE,parentPage);
					categoryPage = categoryPage == null ? categoryFinder.getGroupPage(CATEGORY_PAGE_STATIC_RESOURCE_TYPE,parentPage) : categoryPage;
					if(null != categoryPage){
						SearchResult searchResult = runQuery(categoryPage,resourceResolver);
						articles.addAll(processSearchResult(searchResult,resourceResolver ));
					}
				}
			}
		}
	}

}