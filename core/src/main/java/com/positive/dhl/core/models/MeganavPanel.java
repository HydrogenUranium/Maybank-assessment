package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

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
		return new ArrayList<MeganavPanel>(panels);
	}

    /**
	 * 
	 */
	public void setPanels(List<MeganavPanel> panels) {
		this.panels = new ArrayList<MeganavPanel>(panels);
	}

    /**
	 * 
	 */
	public List<ArticleCategory> getArticleCategories() {
		return new ArrayList<ArticleCategory>(articleCategories);
	}

    /**
	 * 
	 */
	public void setArticleCategories(List<ArticleCategory> articleCategories) {
		this.articleCategories = new ArrayList<ArticleCategory>(articleCategories);
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
			if ((gtitle == null) || (gtitle.trim().length() == 0)) {
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
		panels = new ArrayList<MeganavPanel>();
		Iterator<Page> children = page.listChildren();
		while (children.hasNext()) {
			Page child = children.next();
			ValueMap properties = child.adaptTo(ValueMap.class);
			if ((properties != null) && ("dhl/components/pages/articlecategory").equals(properties.get("jcr:content/sling:resourceType", ""))) {
				panels.add(new MeganavPanel(count, child, topLevelCategory, null, null));
				count++;
			}
		}

		articleCategories = new ArrayList<ArticleCategory>();
		if (builder != null) {
			Map<String, String> map = new HashMap<String, String>();
			map.put("type", NameConstants.NT_PAGE);
			map.put("path", page.getPath());
			map.put("group.p.or", "true");
			map.put("group.1_property", "jcr:content/sling:resourceType");
			map.put("group.1_property.value", "dhl/components/pages/articlecategory");
			map.put("group.1_property.operation", "like");
			map.put("p.limit", "50");

			Query query = builder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
	        SearchResult searchResult = query.getResult();
	        if (searchResult != null) {
				for (Hit hit: searchResult.getHits()) {
					ValueMap hitProperties = hit.getProperties();
					Boolean hideInNav = hitProperties.get("hideInNav", false);
					if (hideInNav) {
						continue;
					}
					Resource resource = resourceResolver.getResource(hit.getPath());
					if (resource != null) {
			    		ValueMap properties = resource.adaptTo(ValueMap.class);
			    		if (properties != null) {
			    			Boolean showInMeganav = properties.get("jcr:content/showinmeganav", false);
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