package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.search.QueryBuilder;
import com.day.cq.wcm.api.Page;

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
	
	private String siteTitle;
	private String logoUrl;
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
	public String getLogoUrl() {
		return logoUrl;
	}

    /**
	 * 
	 */
	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
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
	public List<SocialLink> getLinksSocial() {
		return new ArrayList<SocialLink>(linksSocial);
	}

    /**
	 * 
	 */
	public void setLinksSocial(List<SocialLink> linksSocial) {
		this.linksSocial = new ArrayList<SocialLink>(linksSocial);
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
		
		Page home = currentPage.getAbsoluteParent(2);
		ValueMap properties = home.adaptTo(ValueMap.class);
		
		if (properties != null) {
			searchResultsPage = properties.get("jcr:content/searchresultspage", "");
		}
		
		// homeUrl = home.getVanityUrl();
		// if (homeUrl == null || homeUrl.length() == 0) {
		homeUrl = home.getPath() + ".html";
		// }
		logoUrl = "/etc.clientlibs/dhl/clientlibs/clientlib-site/resources/img/logo.png";
		
		linksSocial = new ArrayList<SocialLink>();
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
		
		Page topLevelCategory = currentPage.getAbsoluteParent(3);
		siteTitle = home.getPageTitle();

		int count = 0;
		panels = new ArrayList<MeganavPanel>();
		Iterator<Page> children = home.listChildren();
		while (children.hasNext()) {
			Page child = children.next();
			ValueMap childProperties = child.adaptTo(ValueMap.class);
			if ((childProperties != null) && ("dhl/components/pages/articlecategory").equals(childProperties.get("jcr:content/sling:resourceType", ""))) {
				Boolean hideInNav = childProperties.get("jcr:content/hideInNav", false);
				if (hideInNav) {
					continue;
				}
				
				panels.add(new MeganavPanel(count, child, topLevelCategory, builder, resourceResolver));
				count++;
			}
		}
	}
}