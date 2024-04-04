package com.positive.dhl.core.models;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;

import static com.day.cq.wcm.api.constants.NameConstants.NT_PAGE;
import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE;
import static org.apache.jackrabbit.JcrConstants.JCR_CONTENT;
import static org.apache.sling.jcr.resource.api.JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY;

/**
 *
 */
@Model(adaptables=Resource.class)
public class MeganavPanel {
	private List<MeganavPanel> panels;
	private List<ArticleCategory> articleCategories;
	private int index;
	private Boolean current;
	private Page page;
	
    /**
	 * 
	 */
	public List<MeganavPanel> getPanels() {
		return new ArrayList<>(panels);
	}

    /**
	 * 
	 */
	public void setPanels(List<MeganavPanel> panels) {
		this.panels = new ArrayList<>(panels);
	}

    /**
	 * 
	 */
	public List<ArticleCategory> getArticleCategories() {
		return new ArrayList<>(articleCategories);
	}

    /**
	 * 
	 */
	public void setArticleCategories(List<ArticleCategory> articleCategories) {
		this.articleCategories = new ArrayList<>(articleCategories);
	}

    /**
	 * 
	 */
	public int getIndex() {
		return index;
	}

    /**
	 * 
	 */
	public void setIndex(int index) {
		this.index = index;
	}

    /**
	 * 
	 */
	public Boolean getCurrent() {
		return current;
	}

    /**
	 * 
	 */
	public void setCurrent(Boolean current) {
		this.current = current;
	}

    /**
	 * 
	 */
	public Page getPage() {
		return page;
	}

    /**
	 * 
	 */
	public void setPage(Page page) {
		this.page = page;
	}

    /**
	 * 
	 */
	public String url() {
		return page.getPath() + ".html";
	}
	
    /**
	 * 
	 */
	public String navigationTitle() {
		ValueMap properties = page.adaptTo(ValueMap.class);
		if (properties != null) {
			String gtitle = properties.get("jcr:content/navTitle", "");
			if (gtitle.trim().length() == 0) {
				gtitle = properties.get("jcr:content/jcr:title", "");
			}
			return gtitle;
		}
		return "";
	}

    /**
	 * 
	 */
	public MeganavPanel(int index, Page page, Page topLevelCategory, QueryBuilder builder, ResourceResolver resourceResolver) throws RepositoryException {
		this.index = index;
		this.page = page;
		this.current = false;
		if (topLevelCategory != null) {
			this.current = (page.getPath().equals(topLevelCategory.getPath()));
		}

		int count = 0;
		panels = new ArrayList<>();
		Iterator<Page> children = page.listChildren();
		while (children.hasNext()) {
			Page child = children.next();
			ValueMap properties = child.adaptTo(ValueMap.class);
			if ((properties != null)
					&& properties.get(JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY, "").equals(CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE)) {
				panels.add(new MeganavPanel(count, child, topLevelCategory, null, null));
				count++;
			}
		}

		articleCategories = new ArrayList<>();
		if (builder != null) {
			Map<String, String> map = new HashMap<>();
			map.put("type", NT_PAGE);
			map.put("path", page.getPath());
			map.put("group.p.or", "true");
			map.put("group.1_property", JCR_CONTENT + "/" + SLING_RESOURCE_TYPE_PROPERTY);
			map.put("group.1_property.value", CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE);
			map.put("group.1_property.operation", "like");
			map.put("p.limit", "50");

			Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
	        SearchResult searchResult = query.getResult();
	        if (searchResult != null) {
				for (Hit hit: searchResult.getHits()) {
					ValueMap hitProperties = hit.getProperties();
					boolean hideInNav = hitProperties.get("hideInNav", false);
					if (hideInNav) {
						continue;
					}
					Resource resource = resourceResolver.getResource(hit.getPath());
					if (resource != null) {
			    		ValueMap properties = resource.adaptTo(ValueMap.class);
			    		if (properties != null) {
			    			boolean showInMeganav = properties.get("jcr:content/showinmeganav", false);
			    			if (showInMeganav) {
			    				ArticleCategory articleCategory = new ArticleCategory();

			    				articleCategory.path = hit.getPath().trim();
				    			String externalUrl = properties.get("jcr:content/externalurl", "");
				    			if (externalUrl.length() > 0) {
				    				articleCategory.path = externalUrl.trim();
				    				articleCategory.setExternal(true);
				    			} else {
				    				articleCategory.setExternal(false);
				    			}

				    			String fullTitle = properties.get("jcr:content/jcr:title", "");
				    			articleCategory.setTitle(properties.get("jcr:content/navTitle", ""));
				    			if ((articleCategory.getTitle() == null) || (articleCategory.getTitle().trim().length() == 0)) {
				    				articleCategory.setTitle(fullTitle);
				    			}

				    			articleCategory.setListimage(properties.get("jcr:content/listimage", ""));
			    				
								articleCategories.add(articleCategory);
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