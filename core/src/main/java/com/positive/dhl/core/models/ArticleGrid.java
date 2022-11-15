package com.positive.dhl.core.models;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;

/**
 *
 */
@Model(adaptables = { Resource.class, SlingHttpServletRequest.class })
public class ArticleGrid {
	@Inject
	private SlingHttpServletRequest request;

	@Inject
	private QueryBuilder builder;

	@Inject
	private ResourceResolver resourceResolver;

	@Inject
	private Resource resource;

	@Inject
	private Page currentPage;

	@Inject
	@Named("items")
	@Optional
	private Resource linksResource;

	@Inject
	@Named("hidelatest")
	@Optional
	public Boolean hidelatest;

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

	private List<CategoryLink> categories;
	private List<Article> articles;
	private String mode;

	private static final Logger LOGGER = LoggerFactory.getLogger(ArticleGrid.class);

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
	 * 
	 */
	@PostConstruct
	protected void init() {
		mode = "";

		ValueMap resourceProperties = resource.getValueMap();
		if (resourceProperties.get("hidelatest", false)) {
			hidelatest = true;
			mode = "trending";
		}
		if (resourceProperties.get("hidetrending", false)) {
			hidetrending = true;
			mode = "category0";
		}

		if (request != null) {
			mode = request.getRequestPathInfo().getSelectorString();
		}

		categories = null;

		String[] propNames = new String[] { "category0", "category1", "category2", "category3" };
		List<String> categoryPaths = new ArrayList<>();
		for (String propName : propNames) {
			String path = resourceProperties.get(propName, "");
			if (path.trim().length() > 0) {
				categoryPaths.add(path);
			}
		}

		// pre-fill if we're on the 404 page...
		if (categoryPaths.isEmpty()) {
			String currentPagePath = currentPage.getPath();
			if (currentPagePath.contains("page-not-found")) {
				hidetrending = true;
				categoryPaths.add("/content/dhl/business");
				categoryPaths.add("/content/dhl/culture");
				categoryPaths.add("/content/dhl/e-commerce");
			}
		}

		if (!categoryPaths.isEmpty()) {
			categories = new ArrayList<>();

			for (String categoryPath : categoryPaths) {
				if (null != resourceResolver.getResource(categoryPath)) {
					Page category = resourceResolver.getResource(categoryPath).adaptTo(Page.class);
					if (category != null) {
						ValueMap categoryProperties = category.getProperties();

						if (categoryProperties.get(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY, "")
								.equals("dhl/components/pages/articlecategory")) {
							String title = "";
							title = categoryProperties.get("navTitle", "");
							if ((title == null) || (title.trim().length() == 0)) {
								title = categoryProperties.get(JcrConstants.JCR_TITLE, "");
							}

							String categoryName = title.replaceAll("[^A-Za-z0-9]|\\s", "-").toLowerCase();
							CategoryLink categoryLink = new CategoryLink(categoryName, title, categoryPath);
							categories.add(categoryLink);
						}
					}
				} else {
					LOGGER.info("Category path {} does not exist!", categoryPath);
				}
			}
		}

		if (categories == null) {
			categories = new ArrayList<>();

			int count = 0;
			Iterator<Page> children = currentPage.listChildren();
			while (children.hasNext()) {
				Page child = children.next();
				ValueMap properties = child.getProperties();
				if (properties.get(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY)
						.equals("dhl/components/pages/articlecategory")) {
					Boolean hideInNav = properties.get("hideInNav", false);
					if (hideInNav) {
						continue;
					}

					String title = "";
					title = properties.get("navTitle", "");
					if ((title == null) || (title.trim().length() == 0)) {
						title = properties.get(JcrConstants.JCR_TITLE, "");
					}

					String categoryName = title.replaceAll("[^A-Za-z0-9]|\\s", "-").toLowerCase();
					CategoryLink categoryLink = new CategoryLink(categoryName, title, child.getPath());
					categories.add(categoryLink);

					count++;
					if (count > 2)
						break;
				}
			}
		}

		articles = new ArrayList<Article>();

		if (("trending").equals(mode)) {
			// trending
			if (linksResource == null) {
				linksResource = resource.getChild("items");
			}

			if (linksResource != null) {
				int count = 0;
				Iterator<Resource> linkResources = linksResource.listChildren();
				while (linkResources.hasNext()) {
					Resource resource = linkResources.next();
					Article link = resource.adaptTo(Article.class);
					if (link != null && link.getValid()) {
						link.setIndex(count);
						articles.add(link);
						count++;
					}
				}
			}

		} else {
			boolean found = false;
			String path = currentPage.getPath();
			for (CategoryLink item : categories) {
				if (item.category.equals(mode)) {
					found = true;
					path = item.link;
					break;
				}
			}

			// default 'latest'
			if (!found) {
				mode = "latest";

				Page groupPage = getGroupPage(currentPage);
				if (groupPage != null) {
					path = groupPage.getPath();
				}
			}

			if (builder != null) {
				Map<String, String> map = new HashMap<>();
				map.put("type", "cq:Page");
				map.put("path", path);
				map.put("group.p.or", "true");

				List<String> articleTypes = Article.GetArticlePageTypes();
				for (int x = 0; x < articleTypes.size(); x++) {
					map.put(String.format("group.%1$s_property", (x + 1)), "jcr:content/sling:resourceType");
					map.put(String.format("group.%1$s_property.value", (x + 1)),
							String.format("dhl/components/pages/%1$s", articleTypes.get(x)));
					map.put(String.format("group.%1$s_property.operation", (x + 1)), "like");
				}

				map.put("orderby", "@jcr:content/custompublishdate");
				map.put("orderby.sort", "desc");

				map.put("p.limit", "50");

				Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
				SearchResult searchResult = query.getResult();
				if (searchResult != null) {
					int count = 0;
					for (Hit hit : searchResult.getHits()) {

						try {
							ValueMap hitProperties = hit.getProperties();
							Boolean hideInNav = hitProperties.get("hideInNav", false);
							if (hideInNav) {
								continue;
							}

							Article article = new Article(hit.getPath(), resourceResolver);
							article.setIndex(count);
							articles.add(article);

						} catch (RepositoryException ignored) {
						}

						count++;
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
	private Page getGroupPage(Page self) {
		ValueMap parentProperties = self.adaptTo(ValueMap.class);
		if (parentProperties != null) {
			if (("dhl/components/pages/home").equals(parentProperties.get("jcr:content/sling:resourceType", "")) ||
					("dhl/components/pages/articlecategory")
							.equals(parentProperties.get("jcr:content/sling:resourceType", ""))) {
				return self;
			}
			if (self.getParent() != null) {
				return getGroupPage(self.getParent());
			}
		}
		return null;
	}
}