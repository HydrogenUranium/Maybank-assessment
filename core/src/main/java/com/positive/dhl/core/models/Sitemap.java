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

import com.positive.dhl.core.services.PageUtilService;
import org.apache.commons.lang3.StringUtils;
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
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;
import static com.day.cq.wcm.api.constants.NameConstants.NT_PAGE;
import static com.day.cq.wcm.api.constants.NameConstants.PN_NAV_TITLE;
import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE;
import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_STATIC_RESOURCE_TYPE;
import static org.apache.jackrabbit.JcrConstants.JCR_CONTENT;
import static org.apache.sling.jcr.resource.api.JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class Sitemap {
	protected static final String HTML_EXTENSION = ".html";

	@Inject
	private ResourceResolver resourceResolver;

    @Inject
    private QueryBuilder builder;
    
	@Inject
	private Page currentPage;

	@OSGiService
	private PageUtilService pageUtilService;

	private List<SitemapLinkGroup> articleLinks;
	private List<SitemapLinkGroup> categoryLinks;
	private List<SitemapLinkGroup> otherPageLinks;
	
    /**
	 * 
	 */
	public List<SitemapLinkGroup> getArticleLinks() {
		return new ArrayList<>(articleLinks);
	}

    /**
	 * 
	 */
	public void setArticleLinks(List<SitemapLinkGroup> articleLinks) {
		this.articleLinks = new ArrayList<>(articleLinks);
	}

    /**
	 * 
	 */
	public List<SitemapLinkGroup> getCategoryLinks() {
		return new ArrayList<>(categoryLinks);
	}

    /**
	 * 
	 */
	public void setCategoryLinks(List<SitemapLinkGroup> categoryLinks) {
		this.categoryLinks = new ArrayList<>(categoryLinks);
	}

    /**
	 * 
	 */
	public List<SitemapLinkGroup> getOtherPageLinks() {
		return new ArrayList<>(otherPageLinks);
	}

    /**
	 * 
	 */
	public void setOtherPageLinks(List<SitemapLinkGroup> otherPageLinks) {
		this.otherPageLinks = new ArrayList<>(otherPageLinks);
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() throws RepositoryException {
		articleLinks = new ArrayList<>();
		Page home = pageUtilService.getHomePage(currentPage);
		if (builder != null && home != null) {
			Map<String, String> map = new HashMap<>();
			map.put("type", NT_PAGE);
			map.put("path", home.getPath());
			map.put("group.p.or", "true");
			
			List<String> articleTypes = Article.getArticlePageTypes();
			for (int x = 0; x < articleTypes.size(); x++) {
				map.put(String.format("group.%1$s_property", (x + 1)), JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY);
				map.put(String.format("group.%1$s_property.value", (x + 1)), String.format("dhl/components/pages/%1$s", articleTypes.get(x)));
				map.put(String.format("group.%1$s_property.operation", (x + 1)), "like");
			}
			
			map.put("orderby", JCR_CONTENT + "/" + JCR_TITLE);
			map.put("orderby.sort", "desc");
			map.put("p.limit", "50");
			
			Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
	        SearchResult searchResult = query.getResult();
	        if (searchResult != null) {
				for (Hit hit: searchResult.getHits()) {
					Resource resource = resourceResolver.getResource(hit.getPath());
					if (resource != null) {
						Page page = resource.adaptTo(Page.class);
						if (page != null) {
							if (page.isHideInNav()) {
								continue;
							}

							ValueMap properties = page.adaptTo(ValueMap.class);
							if (properties != null) {
								String title = properties.get(JCR_CONTENT + "/" + PN_NAV_TITLE, "");
								if ((title == null) || (title.trim().length() == 0)) {
									title = properties.get(JCR_CONTENT + "/" + JCR_TITLE, "");
								}

								SitemapLinkGroup linkGroup = new SitemapLinkGroup();
								linkGroup.setHeader(title);
								linkGroup.setLink(hit.getPath().concat(HTML_EXTENSION));
								articleLinks.add(linkGroup);
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
		
		categoryLinks = new ArrayList<>();
		if (home != null) {
			Iterator<Page> children = home.listChildren();
			while (children.hasNext()) {
				Page child = children.next();
				if (child.isHideInNav()) {
					continue;
				}

				SitemapLinkGroup linkGroup = new SitemapLinkGroup();
				ValueMap properties = child.adaptTo(ValueMap.class);

				if (properties != null) {
					String pageType = properties.get(JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY, "");
					if (!StringUtils.equalsAny(pageType, CATEGORY_PAGE_STATIC_RESOURCE_TYPE, CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE)) {
						continue;
					}

					String title = properties.get(JCR_CONTENT + "/" + PN_NAV_TITLE, "");
					if ((title == null) || (title.trim().length() == 0)) {
						title = properties.get(JCR_CONTENT + "/" + JCR_TITLE, "");
					}

					linkGroup.setHeader(title);
					linkGroup.setLink(child.getPath().concat(HTML_EXTENSION));
					linkGroup.setLinks(getChildrenCategories(child));

					categoryLinks.add(linkGroup);
				}
			}

			otherPageLinks = new ArrayList<>();
			if (builder != null) {
				Map<String, String> map = new HashMap<>();
				map.put("type", NT_PAGE);
				map.put("path", home.getPath());
				map.put("group.p.or", "true");
				map.put("group.1_property", JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY);
				map.put("group.1_property.value", "dhl/components/pages/sitemap");
				map.put("group.1_property.operation", "like");
				map.put("group.2_property", JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY);
				map.put("group.2_property.value", "dhl/components/pages/standard");
				map.put("group.2_property.operation", "like");
				map.put("group.3_property", JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY);
				map.put("group.3_property.value", "dhl/components/pages/userlogin");
				map.put("group.3_property.operation", "like");
				map.put("group.4_property", JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY);
				map.put("group.4_property.value", "dhl/components/pages/userregister");
				map.put("group.4_property.operation", "like");
				map.put("group.5_property", JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY);
				map.put("group.5_property.value", "dhl/components/pages/userforgotpassword");
				map.put("group.5_property.operation", "like");
				map.put("orderby.sort", "desc");
				map.put("p.limit", "50");

				Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
				SearchResult searchResult = query.getResult();
				if (searchResult != null) {
					for (Hit hit : searchResult.getHits()) {
						Resource item = resourceResolver.getResource(hit.getPath());
						if (item != null) {
							Page resource = item.adaptTo(Page.class);
							if (resource != null) {
								if (resource.isHideInNav()) {
									continue;
								}

								ValueMap properties = resource.adaptTo(ValueMap.class);
								if (properties != null) {
									String title = properties.get(JCR_CONTENT + "/" + PN_NAV_TITLE, "");
									if ((title == null) || (title.trim().length() == 0)) {
										title = properties.get(JCR_CONTENT + "/" + JCR_TITLE, "");
									}

									SitemapLinkGroup linkGroup = new SitemapLinkGroup();
									linkGroup.setHeader(title);
									linkGroup.setLink(hit.getPath().concat(HTML_EXTENSION));
									otherPageLinks.add(linkGroup);
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
	private List<SitemapLinkGroup> getChildrenCategories(Page page) {
		List<SitemapLinkGroup> links = new ArrayList<>();

		Iterator<Page> groupChildren = page.listChildren();
		while (groupChildren.hasNext()) {
			Page groupChild = groupChildren.next();
    		ValueMap groupProperties = groupChild.adaptTo(ValueMap.class);
    		
    		if (groupProperties != null) {
				if (groupChild.isHideInNav()) {
					continue;
				}
				String pageType = groupProperties.get(JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY, "");
				if (!StringUtils.equalsAny(pageType, CATEGORY_PAGE_STATIC_RESOURCE_TYPE, CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE)) {
					continue;
				}
				
				String groupTitle = groupProperties.get(JCR_CONTENT + "/" + PN_NAV_TITLE, "");
				if (groupTitle.trim().length() == 0) {
					groupTitle = groupProperties.get(JCR_CONTENT + "/" + JCR_TITLE, "");
				}
				
				SitemapLinkGroup currentItem = new SitemapLinkGroup();
				currentItem.setHeader(groupTitle);
				currentItem.setLink(groupChild.getPath().concat(HTML_EXTENSION));
				currentItem.setLinks(getChildrenCategories(groupChild));
				
				links.add(currentItem);
    		}
		}
		
		return links;
	}
}