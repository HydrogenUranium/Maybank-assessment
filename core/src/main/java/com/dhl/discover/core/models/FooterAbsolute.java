package com.dhl.discover.core.models;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;

import com.dhl.discover.core.services.PageUtilService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

/**
 * @deprecated (will be removed together with old footer)
 */
@Deprecated(since = "2.1", forRemoval = true)
@Model(adaptables=SlingHttpServletRequest.class)
public class FooterAbsolute {
	@ScriptVariable
	private Page currentPage;

	@OSGiService
	private PageUtilService pageUtilService;

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
		return new ArrayList<>(leftLinks);
	}

    /**
	 * 
	 */
	public void setLeftLinks(List<Link> leftLinks) {
		this.leftLinks = new ArrayList<>(leftLinks);
	}

    /**
	 * 
	 */
	public List<Link> getRightLinks() {
		return new ArrayList<>(rightLinks);
	}

    /**
	 * 
	 */
	public void setRightLinks(List<Link> rightLinks) {
		this.rightLinks = new ArrayList<>(rightLinks);
	}

    /**
	 * 
	 */
	@PostConstruct
    protected void init() {
		Calendar date = Calendar.getInstance();
		int year = date.get(Calendar.YEAR);
		copyrightNotice = String.valueOf(year).concat(" &copy; DHL. All rights reserved.");

		Page home = pageUtilService.getHomePage(currentPage);
		leftLinks = new ArrayList<>();
		rightLinks = new ArrayList<>();

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