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
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.api.Page;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class Sitemap {
	@Inject
	private ResourceResolver resourceResolver;

    @Inject
    private QueryBuilder builder;
    
	@Inject
	private Page currentPage;
	
	private List<SitemapLinkGroup> articleLinks;
	private List<SitemapLinkGroup> categoryLinks;
	private List<SitemapLinkGroup> otherPageLinks;
	
    /**
	 * 
	 */
	public List<SitemapLinkGroup> getArticleLinks() {
		return new ArrayList<SitemapLinkGroup>(articleLinks);
	}

    /**
	 * 
	 */
	public void setArticleLinks(List<SitemapLinkGroup> articleLinks) {
		this.articleLinks = new ArrayList<SitemapLinkGroup>(articleLinks);
	}

    /**
	 * 
	 */
	public List<SitemapLinkGroup> getCategoryLinks() {
		return new ArrayList<SitemapLinkGroup>(categoryLinks);
	}

    /**
	 * 
	 */
	public void setCategoryLinks(List<SitemapLinkGroup> categoryLinks) {
		this.categoryLinks = new ArrayList<SitemapLinkGroup>(categoryLinks);
	}

    /**
	 * 
	 */
	public List<SitemapLinkGroup> getOtherPageLinks() {
		return new ArrayList<SitemapLinkGroup>(otherPageLinks);
	}

    /**
	 * 
	 */
	public void setOtherPageLinks(List<SitemapLinkGroup> otherPageLinks) {
		this.otherPageLinks = new ArrayList<SitemapLinkGroup>(otherPageLinks);
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() throws RepositoryException {
		articleLinks = new ArrayList<SitemapLinkGroup>();
		Page home = currentPage.getAbsoluteParent(2);
		if (builder != null && home != null) {
			Map<String, String> map = new HashMap<String, String>();
			map.put("type", NameConstants.NT_PAGE);
			map.put("path", home.getPath());
			map.put("group.p.or", "true");
			
			List<String> articleTypes = Article.GetArticlePageTypes();
			for (int x = 0; x < articleTypes.size(); x++) {
				map.put(String.format("group.%1$s_property", (x + 1)), "jcr:content/sling:resourceType");
				map.put(String.format("group.%1$s_property.value", (x + 1)), String.format("dhl/components/pages/%1$s", articleTypes.get(x)));
				map.put(String.format("group.%1$s_property.operation", (x + 1)), "like");
			}
			
			map.put("orderby", "jcr:content/jcr:title");
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
								String title = properties.get("jcr:content/navTitle", "");
								if ((title == null) || (title.trim().length() == 0)) {
									title = properties.get("jcr:content/jcr:title", "");
								}

								SitemapLinkGroup linkGroup = new SitemapLinkGroup();
								linkGroup.setHeader(title);
								linkGroup.setLink(hit.getPath().concat(".html"));
								articleLinks.add(linkGroup);
							}
						}
					}
				}
	        }
		}
		
		categoryLinks = new ArrayList<SitemapLinkGroup>();
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
					String pageType = properties.get("jcr:content/sling:resourceType", "");
					if (!("dhl/components/pages/articlecategory").equals(pageType)) {
						continue;
					}

					String title = properties.get("jcr:content/navTitle", "");
					if ((title == null) || (title.trim().length() == 0)) {
						title = properties.get("jcr:content/jcr:title", "");
					}

					linkGroup.setHeader(title);
					linkGroup.setLink(child.getPath().concat(".html"));
					linkGroup.setLinks(getChildrenCategories(child));

					categoryLinks.add(linkGroup);
				}
			}

			otherPageLinks = new ArrayList<SitemapLinkGroup>();
			if (builder != null) {
				Map<String, String> map = new HashMap<String, String>();
				map.put("type", NameConstants.NT_PAGE);
				map.put("path", home.getPath());
				map.put("group.p.or", "true");
				map.put("group.1_property", "jcr:content/sling:resourceType");
				map.put("group.1_property.value", "dhl/components/pages/sitemap");
				map.put("group.1_property.operation", "like");
				map.put("group.2_property", "jcr:content/sling:resourceType");
				map.put("group.2_property.value", "dhl/components/pages/standard");
				map.put("group.2_property.operation", "like");
				map.put("group.3_property", "jcr:content/sling:resourceType");
				map.put("group.3_property.value", "dhl/components/pages/userlogin");
				map.put("group.3_property.operation", "like");
				map.put("group.4_property", "jcr:content/sling:resourceType");
				map.put("group.4_property.value", "dhl/components/pages/userregister");
				map.put("group.4_property.operation", "like");
				map.put("group.5_property", "jcr:content/sling:resourceType");
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
									String title = properties.get("jcr:content/navTitle", "");
									if ((title == null) || (title.trim().length() == 0)) {
										title = properties.get("jcr:content/jcr:title", "");
									}

									SitemapLinkGroup linkGroup = new SitemapLinkGroup();
									linkGroup.setHeader(title);
									linkGroup.setLink(hit.getPath().concat(".html"));
									otherPageLinks.add(linkGroup);
								}
							}
						}
					}
				}
			}
		}
	}
	
    /**
	 * 
	 */
	private List<SitemapLinkGroup> getChildrenCategories(Page page) {
		List<SitemapLinkGroup> links = new ArrayList<SitemapLinkGroup>();

		Iterator<Page> groupChildren = page.listChildren();
		while (groupChildren.hasNext()) {
			Page groupChild = groupChildren.next();
    		ValueMap groupProperties = groupChild.adaptTo(ValueMap.class);
    		
    		if (groupProperties != null) {
				if (groupChild.isHideInNav()) {
					continue;
				}
				String pageType = groupProperties.get("jcr:content/sling:resourceType", ""); 
				if (!("dhl/components/pages/articlecategory").equals(pageType)) {
					continue;
				}
				
				String groupTitle = groupProperties.get("jcr:content/navTitle", "");
				if ((groupTitle == null) || (groupTitle.trim().length() == 0)) {
					groupTitle = groupProperties.get("jcr:content/jcr:title", "");
				}
				
				SitemapLinkGroup currentItem = new SitemapLinkGroup();
				currentItem.setHeader(groupTitle);
				currentItem.setLink(groupChild.getPath().concat(".html"));
				currentItem.setLinks(getChildrenCategories(groupChild));
				
				links.add(currentItem);
    		}
		}
		
		return links;
	}
}