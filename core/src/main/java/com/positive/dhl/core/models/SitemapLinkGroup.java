package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

/**
 *
 */
@Model(adaptables=Resource.class)
public class SitemapLinkGroup {
    private String header;
    private String link;
    private List<SitemapLinkGroup> links;
    
    /**
	 * 
	 */
    public String getHeader() {
		return header;
	}

    /**
	 * 
	 */
	public void setHeader(String header) {
		this.header = header;
	}

    /**
	 * 
	 */
	public String getLink() {
		return link;
	}

    /**
	 * 
	 */
	public void setLink(String link) {
		this.link = link;
	}

    /**
	 * 
	 */
	public List<SitemapLinkGroup> getLinks() {
		return new ArrayList<SitemapLinkGroup>(links);
	}

    /**
	 * 
	 */
	public void setLinks(List<SitemapLinkGroup> links) {
		this.links = new ArrayList<SitemapLinkGroup>(links);
	}

    /**
	 * 
	 */
	public SitemapLinkGroup() {
    	links = new ArrayList<SitemapLinkGroup>();
    }
}