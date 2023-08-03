package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;

import static com.positive.dhl.core.constants.DiscoverConstants.HOME_PAGE_LEVEL;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class FooterAbsolute {
	@Inject
	private Page currentPage;
	
	private String copyrightNotice;
	private List<Link> leftLinks;
	private List<Link> rightLinks;
	
    /**
	 * 
	 */
	public String getCopyrightNotice() {
		return copyrightNotice;
	}

    /**
	 * 
	 */
	public void setCopyrightNotice(String copyrightNotice) {
		this.copyrightNotice = copyrightNotice;
	}

    /**
	 * 
	 */
	public List<Link> getLeftLinks() {
		return new ArrayList<Link>(leftLinks);
	}

    /**
	 * 
	 */
	public void setLeftLinks(List<Link> leftLinks) {
		this.leftLinks = new ArrayList<Link>(leftLinks);
	}

    /**
	 * 
	 */
	public List<Link> getRightLinks() {
		return new ArrayList<Link>(rightLinks);
	}

    /**
	 * 
	 */
	public void setRightLinks(List<Link> rightLinks) {
		this.rightLinks = new ArrayList<Link>(rightLinks);
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() {
		Calendar date = Calendar.getInstance();
		int year = date.get(Calendar.YEAR);
		copyrightNotice = String.valueOf(year).concat(" &copy; DHL. All rights reserved.");

		Page home = currentPage.getAbsoluteParent(HOME_PAGE_LEVEL);
		leftLinks = new ArrayList<Link>();
		rightLinks = new ArrayList<Link>();

		if (home == null) {
			return;
		}
		Resource leftLinkItems = home.getContentResource("absolutefooterleftitems");
		if (leftLinkItems != null) {
			Iterator<Resource> socialsIterator = leftLinkItems.listChildren();
			while (socialsIterator.hasNext()) {
				ValueMap props = socialsIterator.next().adaptTo(ValueMap.class);
				if (props != null) {
					String title = props.get("title", "");
					String url = props.get("url", "");
					leftLinks.add(new Link(title, url));
				}
			}
		}

		Resource rightLinkItems = home.getContentResource("absolutefooterrightitems");
		if (rightLinkItems != null) {
			Iterator<Resource> socialsIterator = rightLinkItems.listChildren();
			while (socialsIterator.hasNext()) {
				ValueMap props = socialsIterator.next().adaptTo(ValueMap.class);
				if (props != null) {
					String title = props.get("title", "");
					String url = props.get("url", "");
					rightLinks.add(new Link(title, url));
				}
			}
		}
	}
}