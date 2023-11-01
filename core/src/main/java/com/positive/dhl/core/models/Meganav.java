package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.search.QueryBuilder;
import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE;
import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_STATIC_RESOURCE_TYPE;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class Meganav {
    @Inject
    private QueryBuilder builder;

	@Inject
	private ResourceResolver resourceResolver;
    
	@Inject
	private Page currentPage;

	@OSGiService
	private PageUtilService pageUtilService;

	private String siteTitle;
	private String homeUrl;
	private String searchResultsPage;
	private List<MeganavPanel> panels;
	private List<SocialLink> linksSocial;
	private String autocompleteUrl;
	private String topsearchesUrl;
	
    /**
	 * 
	 */
	public String getSiteTitle() {
		return siteTitle;
	}

    /**
	 * 
	 */
	public void setSiteTitle(String siteTitle) {
		this.siteTitle = siteTitle;
	}

    /**
	 * 
	 */
	public String getHomeUrl() {
		return homeUrl;
	}

    /**
	 * 
	 */
	public void setHomeUrl(String homeUrl) {
		this.homeUrl = homeUrl;
	}

    /**
	 * 
	 */
	public String getSearchResultsPage() {
		return searchResultsPage;
	}

    /**
	 * 
	 */
	public void setSearchResultsPage(String searchResultsPage) {
		this.searchResultsPage = searchResultsPage;
	}

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
	public List<SocialLink> getLinksSocial() {
		return new ArrayList<>(linksSocial);
	}

    /**
	 * 
	 */
	public void setLinksSocial(List<SocialLink> linksSocial) {
		this.linksSocial = new ArrayList<>(linksSocial);
	}

    /**
	 * 
	 */
	public String getAutocompleteUrl() {
		return autocompleteUrl;
	}

    /**
	 * 
	 */
	public void setAutocompleteUrl(String autocompleteUrl) {
		this.autocompleteUrl = autocompleteUrl;
	}

    /**
	 * 
	 */
	public String getTopsearchesUrl() {
		return topsearchesUrl;
	}

    /**
	 * 
	 */
	public void setTopsearchesUrl(String topsearchesUrl) {
		this.topsearchesUrl = topsearchesUrl;
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() throws RepositoryException {
		autocompleteUrl = "/apps/dhl/discoverdhlapi/tags/index.json";
		topsearchesUrl = "/apps/dhl/discoverdhlapi/searchsuggest/index.json";

		panels = new ArrayList<>();
		linksSocial = new ArrayList<>();
		
		Page home = pageUtilService.getHomePage(currentPage);
		if (home == null) {
			return;
		}
		ValueMap properties = pageUtilService.getPageProperties(home);
		
		if (!properties.isEmpty()) {
			searchResultsPage = properties.get("searchresultspage", "");
		}
		
		homeUrl = home.getPath() + ".html";

		Resource socialItems = home.getContentResource("items");
		if (socialItems != null) {
			Iterator<Resource> socialsIterator = socialItems.listChildren();
			while (socialsIterator.hasNext()) {
				ValueMap props = socialsIterator.next().adaptTo(ValueMap.class);
				if (props != null) {
					String title = props.get("title", "");
					String url = props.get("url", "");
					String category = props.get("category", "linkedin");
			 		linksSocial.add(new SocialLink(category, title, url));
				}
			}
		}
		
		Page topLevelCategory = currentPage.getAbsoluteParent(pageUtilService.getHomePageLevel() + 1);
		siteTitle = home.getPageTitle();

		int count = 0;
		Iterator<Page> children = home.listChildren();
		while (children.hasNext()) {
			Page child = children.next();
			ValueMap childProperties = child.adaptTo(ValueMap.class);
			if (childProperties != null
					&& StringUtils.equalsAny(childProperties.get("jcr:content/sling:resourceType", ""), CATEGORY_PAGE_STATIC_RESOURCE_TYPE, CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE)) {
				boolean hideInNav = childProperties.get("jcr:content/hideInNav", false);
				if (hideInNav) {
					continue;
				}
				
				panels.add(new MeganavPanel(count, child, topLevelCategory, builder, resourceResolver));
				count++;
			}
		}
	}
}