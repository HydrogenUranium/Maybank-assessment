package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class AllCategories {
	@Inject
	private Page currentPage;

	@OSGiService
	private PageUtilService pageUtilService;

	private List<SitemapLinkGroup> categoryLinks;
	
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
	@PostConstruct
    protected void init() {
		categoryLinks = new ArrayList<>();
		
		Page home = pageUtilService.getHomePage(currentPage);
		Resource interestItems = home.getContentResource("interestitems");
		if (interestItems != null) {
			Iterator<Resource> interestItemsIterator = interestItems.listChildren();
			while (interestItemsIterator.hasNext()) {
				ValueMap props = interestItemsIterator.next().adaptTo(ValueMap.class);
				
				if (props != null) {
					SitemapLinkGroup linkGroup = new SitemapLinkGroup();
					linkGroup.setHeader(props.get("title", ""));
					linkGroup.setLink("/content/dhl.html");
					categoryLinks.add(linkGroup);
				}
			}
		}
	}
}