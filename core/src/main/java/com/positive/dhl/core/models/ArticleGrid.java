package com.positive.dhl.core.models;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.constants.DiscoverConstants;
import com.positive.dhl.core.services.CategoryFinder;
import com.positive.dhl.core.services.RepositoryChecks;
import com.positive.dhl.core.services.ResourceResolverHelper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.RepositoryException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


/**
 * {@code ArticleGrid} is a SlingModel class that can be leveraged to transform a resource into an ArticleGrid page - a page which contains a grid
 * of articles of certain categories.
 */
@Model(adaptables = { Resource.class, SlingHttpServletRequest.class })
public class ArticleGrid {

	private static final Logger LOGGER = LoggerFactory.getLogger(ArticleGrid.class);
	private static final String CTACOPY_DEFAULT_TEXT = "Speak to a Specialist Today";
	private static final String CTALINK_DEFAULT_TEXT = "/content/dhl/en-global/ship-now.html";

	@OSGiService
	private ResourceResolverHelper resourceResolverHelper;

	@Inject
	private SlingHttpServletRequest request;

  @Inject
  private QueryBuilder builder;

	@Inject
	private SlingScriptHelper slingScriptHelper;

	@Inject
	private CategoryFinder categoryFinder;

	@Inject
	private Resource resource;

	@Inject
	private Page currentPage;

	@Inject
	private RepositoryChecks repositoryChecks;

	@Inject
	@Named("items")
	@Optional
	private Resource linksResource;

	/**
	 * {@code true} or {@code false} flag indicating if we should hide 'latest' articles
	 */
	@Inject
	@Named("hidelatest")
	@Optional
	public Boolean hidelatest;
	/**
	 * {@code true} or {@code false} flag indicating if we should hide the 'trending' articles
	 */
	@Inject
	@Named("hidetrending")
	@Optional
	public Boolean hidetrending;

	@Inject
	@Named("category0")
	@Optional
	private String category0;

	@Inject
	@Named("category1")
	@Optional
	private String category1;

	@Inject
	@Named("category2")
	@Optional
	private String category2;

	@Inject
	@Named("category3")
	@Optional
	private String category3;

	@Inject
	@Named("applyForAccountCta")
	@Optional
	private String ctaCopy;

	@Inject
	@Named("applyForAccountUrl")
	@Optional
	private String ctaLink;

	private List<CategoryLink> categories;
	private List<Article> articles;
	private String mode;

    /**
	 *
	 */
	public List<CategoryLink> getCategories() {
		return new ArrayList<>(categories);
	}

    /**
	 *
	 */
	public void setCategories(List<CategoryLink> categories) {
		this.categories = new ArrayList<>(categories);
	}

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
	public String getMode() {
		return mode;
	}

    /**
	 *
	 */
	public void setMode(String mode) {
		this.mode = mode;
	}

	/**
	 * Returns the value associated with property ctaCopy, coming from ArticleGrid component's dialog.
	 *
	 * @return value stored in ArticleGrid node in repository or a default text in case this property is not set
	 */
	public String getCtaCopy(){
		if(null != ctaCopy && !ctaCopy.isEmpty()){
			if(LOGGER.isDebugEnabled()){
				LOGGER.debug("Getting the value from 'ctaCopy': {}", ctaCopy);
			}
			return ctaCopy;
		}
		LOGGER.info("'ctaCopy' property not set, falling back to default value '{}'", CTACOPY_DEFAULT_TEXT);
		return CTACOPY_DEFAULT_TEXT;
	}

	/**
	 * Returns the value associated with property catLink, coming from ArticleGrid component's dialog
	 *
	 * @return value stored in ArticleGrid node in repository or default value (default = 3rd element from conntent root + ship-now.html or if not
	 * available, then "/content/dhl/en-global/ship-now.html"
	 */
	public String getCtaLink(){
		if(null != ctaLink && !ctaLink.isEmpty()){
			return ctaLink;
		}
		LOGGER.info("'ctaLink' property not set, trying to fall back to 3rd level from content root + ship-now.html");
		var home = currentPage.getAbsoluteParent(2);
		if(null != home){
			return home.getPath() + "/ship-now.html";
		}
		LOGGER.warn("Unable to find the backup value, falling back to '{}' ",CTALINK_DEFAULT_TEXT);
		return CTALINK_DEFAULT_TEXT;
	}

	private String processMode(ValueMap properties, SlingHttpServletRequest request){
		if (properties.get("hidelatest", false)) {
			hidelatest = true;
			return "trending";
		}

		if (properties.get("hidetrending", false)) {
			hidetrending = true;
			return  "category0";
		}

		if (request != null) {
			var selectorString = request.getRequestPathInfo().getSelectorString();
			if(null != selectorString){
				return selectorString;
			}
		}
		return "";
	}

	private List<String> getCategoryPaths(ValueMap resourceProperties, ResourceResolver resourceResolver){
		List<String> categoryPaths = new ArrayList<>();
		for (String propName : DiscoverConstants.getCategoriesPropertyNames()) {
			String path = resourceProperties.get(propName, "");
			if (path.trim().length() > 0 && repositoryChecks.doesRepositoryPathExist(path,resourceResolver)) {
				categoryPaths.add(path);
			}
		}

		//pre-fill if we're on the 404 page...
		if (categoryPaths.isEmpty()) {
			String currentPagePath = currentPage.getPath();
			if (currentPagePath.contains("page-not-found")) {
				hidetrending = true;
				categoryPaths.add("/content/dhl/business");
				categoryPaths.add("/content/dhl/culture");
				categoryPaths.add("/content/dhl/e-commerce");
			}
		}
		return categoryPaths;
	}

	/**
	 * Helper method that constructs the {@link CategoryLink} object from {@link Page} object and page template
	 *
	 * @param page is an instance of {@code Page}
	 * @return new instance of {@code CategoryLink} or {@code null} if the page is not of the particular resource type.
	 */
	private CategoryLink getCategoryLinkFromPage(Page page){
		ValueMap categoryProperties = page.getProperties();

		if (categoryProperties.get(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY, "").
				equals(com.positive.dhl.core.constants.DiscoverConstants.CATEGORY_PAGE_TEMPLATE)) {
			String title = categoryProperties.get("navTitle", "");
			if (title.trim().length() == 0) {
				title = categoryProperties.get(JcrConstants.JCR_TITLE, "");
			}

			String categoryName = title.replaceAll("[^A-Za-z\\d]", "-").toLowerCase();
			return new CategoryLink(categoryName, title, page.getPath());
		}
		if(LOGGER.isDebugEnabled()){
		    LOGGER.debug("Page {} does not have a resource type {}, therefore NOT adapting it to CategoryLink object",
				    page.getPath(),
				    com.positive.dhl.core.constants.DiscoverConstants.CATEGORY_PAGE_TEMPLATE);
		}
		return null;
	}

	private List<CategoryLink> getCategoriesLinks(ResourceResolver resourceResolver, List<String> categoryPaths){
		List<CategoryLink> categoryLinks = new ArrayList<>();
		for (String categoryPath: categoryPaths) {
			var categoryResource = resourceResolver.getResource(categoryPath);
			if(null != categoryResource){
				Page category = categoryResource.adaptTo(Page.class);
				if (category != null) {
					var categoryLink = getCategoryLinkFromPage(category);
					if(null != categoryLink){
						categoryLinks.add(categoryLink);
					}
				} else {
					LOGGER.error("Unable to adapt resource ({}) to a Page object. ", categoryPath);
				}
			} else {
				LOGGER.error("Unable to get resource from 'categoryPath' {}", categoryPath);
			}
		}
		return categoryLinks;
	}

	/**
	 * Helper method that fetches a {@code List} of {@link CategoryLink}s that are children of provided AEM page
	 * @param page is an instance of {@link Page} object that we use as a base to search for its children
	 * @return a {@code List} of the {@code CategoryLink} objects (that may be empty)
	 */
	private List<CategoryLink> getCategoriesFromPage(Page page){
		List<CategoryLink> categoryLinks = new ArrayList<>();
		var count = 0;
		Iterator<Page> children = page.listChildren();
		while (children.hasNext()) {
			Page child = children.next();
			var categoryLink = getCategoryLinkFromPage(child);
			if(null != categoryLink){
				categoryLinks.add(categoryLink);
			}
			count++;
			if (count > 2){
				break;
			}
		}
		return categoryLinks;
	}

	/**
	 * Helper method that provides a {@code List} of {@link Article} objects that are children of
	 * {@link ArticleGrid#linksResource} and can be adapted to {@code Article} object
	 * @return a list of {@link Article}s
	 */
	private List<Article> processTrendingMode(){
		List<Article> articlesList = new ArrayList<>();
		if (linksResource == null) {
			linksResource = resource.getChild("items");
		}

		if (null != linksResource) {
			var count = 0;
			Iterator<Resource> linkResources = linksResource.listChildren();
			while (linkResources.hasNext()) {
				var linkResource = linkResources.next();
				Article link = linkResource.adaptTo(Article.class);
				if (link != null && link.getValid()) {
					link.setIndex(count);
					articlesList.add(link);
					count++;
				}
			}
		}
		return articlesList;
	}

	/**
	 * Simple method that goes through the provided {@link List} of {@link CategoryLink}s and tries to match each item against
	 * the (also) provided String representing the 'mode'
	 * @param categoryLinks is a {@code List} of {@code CategoryLink}s representing the values we want to match
	 * @param mode is a String representing the mode we try to match against the category links
	 * @return String representing the link of the {@code CategoryLink} object or path to {@code current} page
	 */
	private String verifyMode(List<CategoryLink> categoryLinks, String mode){
		String path = null;
		for (CategoryLink item: categoryLinks) {
			if (item.category.equals(mode)) {
				path = item.link;
				break;
			}
		}

		if(null == path){
			var groupPage = getGroupPage(currentPage);
			if (groupPage != null) {
				path = groupPage.getPath();
			}
		}

		if(null != path){
			return path;
		}
		return currentPage.getPath();
	}

	/**
	 * Executes the query defined by the {@link Map} with String as both key & value, this {@code Map} represents the predicates that are to be passed to the query.
	 * @param predicatesMap is the predicates map, this constitutes the 'query'
	 * @param queryPath is a {@link String} representing the 'path', base of the query
	 * @param resourceResolver is an instance of {@link ResourceResolver} we use to access the repository
	 * @return a {@link SearchResult} object or {@code null} in case we were unable to get an instance os {@code Session} object (and were therefore
	 * unable to execute the query).
	 */
	private SearchResult runQuery(Map<String,String> predicatesMap, String queryPath, ResourceResolver resourceResolver){
		predicatesMap.put("path", queryPath);
		return categoryFinder.executeQuery(predicatesMap,resourceResolver);
	}

	private List<Article> processSearchResults(SearchResult searchResult, ResourceResolver resourceResolver){
		List<Article> articlesList = new ArrayList<>();
		var count = 0;
		for (Hit hit: searchResult.getHits()) {

			try {
				ValueMap hitProperties = hit.getProperties();
				Boolean hideInNav = hitProperties.get("hideInNav", false);
				if (Boolean.TRUE.equals(hideInNav)) {
					continue;
				}

				var article = new Article(hit.getPath(), resourceResolver);
				article.setIndex(count);
				articlesList.add(article);

			} catch (RepositoryException repositoryException) {
				LOGGER.error("Error has occurred when trying to read the properties of a " +
						"search result. Some details (if available): {}", repositoryException.getMessage());
			}

			count++;
		}
		return articlesList;
	}

	/**
	 * Method that sets us up and gets executed whenever this {@code Sling Model} is actually used (such as when the page gets opened)
	 */
	@PostConstruct
	protected void init() {

		try(var resourceResolver = resourceResolverHelper.getReadResourceResolver()){
			if(null != resourceResolver){
				var resourceProperties = resource.getValueMap();
				mode = processMode(resourceProperties,request);
				categories = new ArrayList<>();

				//populate category paths, if not empty, add category links to 'categories' list
				List<String> categoryPaths = getCategoryPaths(resourceProperties, resourceResolver);
				if (!categoryPaths.isEmpty()) {
					categories.addAll(getCategoriesLinks(resourceResolver,categoryPaths));
				}

				// if categories list is still empty, try to add two child pages from current
				// page (this may still end up being empty list as there is no guarantee there are actually any child pages)
				if (categories.isEmpty()) {
					categories.addAll(getCategoriesFromPage(currentPage));
				}

				articles = new ArrayList<>();

				if (mode.equalsIgnoreCase("trending")) {
					articles.addAll(processTrendingMode());
				} else {
					String path = verifyMode(categories,mode);
					LOGGER.info("Going to execute the query to fetch articles based on their categories");
					var searchResult = runQuery(DiscoverConstants.getArticlesQueryMap(),path,resourceResolver);
					if (searchResult != null) {
						LOGGER.info("Query to find articles returned {} results.", searchResult.getTotalMatches());
						articles.addAll(processSearchResults(searchResult, resourceResolver));
					}
				}
			} else {
				LOGGER.error("Unable to obtain ResourceResolver from the model. This may have unpleasant " +
						"consequences on pages. Details why this happened can be found in this log file");
			}
		}


	}

	/**
	 * Helper method that returns the 'group page' (page that can be used as path for searches of its children)
	 * @param self is an instance of AEM {@link Page}, we test this page's resource type against specific values
	 *             <ul>
	 *             <li>dhl/components/pages/home</li>
	 *             <li>dhl/components/pages/articlecategory</li>
	 *             </ul>
	 * @return a {@code Page} that matches the resource type or {@code null} if nothing was found
	 */
	private Page getGroupPage(Page self) {
			String[] resourceTypes = {"dhl/components/pages/home","dhl/components/pages/articlecategory"};
			return categoryFinder.getGroupPage(resourceTypes,self);
    }
}
