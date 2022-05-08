package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class Footer {
	@Inject
	private Page currentPage;
	
	private String titleColumnOne;
	private List<Link> linksColumnOne;
	private String titleColumnTwo;
	private List<CategoryLink> linksColumnTwo;
	private String titleColumnTags;
	private List<TagWrapper> linksColumnTags;
	private String titleSocial;
	private List<SocialLink> linksSocial;
	
    /**
	 * 
	 */
	public String getTitleColumnOne() {
		return titleColumnOne;
	}

    /**
	 * 
	 */
	public void setTitleColumnOne(String titleColumnOne) {
		this.titleColumnOne = titleColumnOne;
	}

    /**
	 * 
	 */
	public List<Link> getLinksColumnOne() {
		return new ArrayList<Link>(linksColumnOne);
	}

    /**
	 * 
	 */
	public void setLinksColumnOne(List<Link> linksColumnOne) {
		this.linksColumnOne = new ArrayList<Link>(linksColumnOne);
	}

    /**
	 * 
	 */
	public String getTitleColumnTwo() {
		return titleColumnTwo;
	}

    /**
	 * 
	 */
	public void setTitleColumnTwo(String titleColumnTwo) {
		this.titleColumnTwo = titleColumnTwo;
	}

    /**
	 * 
	 */
	public List<CategoryLink> getLinksColumnTwo() {
		return new ArrayList<CategoryLink>(linksColumnTwo);
	}

    /**
	 * 
	 */
	public void setLinksColumnTwo(List<CategoryLink> linksColumnTwo) {
		this.linksColumnTwo = new ArrayList<CategoryLink>(linksColumnTwo);
	}

    /**
	 * 
	 */
	public String getTitleColumnTags() {
		return titleColumnTags;
	}

    /**
	 * 
	 */
	public void setTitleColumnTags(String titleColumnTags) {
		this.titleColumnTags = titleColumnTags;
	}

    /**
	 * 
	 */
	public List<TagWrapper> getLinksColumnTags() {
		return new ArrayList<TagWrapper>(linksColumnTags);
	}

    /**
	 * 
	 */
	public void setLinksColumnTags(List<TagWrapper> linksColumnTags) {
		this.linksColumnTags = new ArrayList<TagWrapper>(linksColumnTags);
	}

    /**
	 * 
	 */
	public String getTitleSocial() {
		return titleSocial;
	}

    /**
	 * 
	 */
	public void setTitleSocial(String titleSocial) {
		this.titleSocial = titleSocial;
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
	@PostConstruct
    protected void init() {
		Page home = currentPage.getAbsoluteParent(2);

		titleColumnOne = "Categories:";
		linksColumnOne = new ArrayList<Link>();
		Iterator<Page> children = home.listChildren();
		while (children.hasNext()) {
			Page child = children.next();
			ValueMap properties = child.adaptTo(ValueMap.class);
			if ((properties != null) && ("dhl/components/pages/articlecategory").equals(properties.get("jcr:content/sling:resourceType", ""))) {
				// String url = child.getVanityUrl();
				// if (url == null || url.length() == 0) {
				String url = child.getPath() + ".html";
				// }
				
				Boolean hideInNav = properties.get("jcr:content/hideInNav", false);
				if (hideInNav) {
					continue;
				}
				
    			String gtitle = properties.get("jcr:content/navTitle", "");
    			if ((gtitle == null) || (gtitle.trim().length() == 0)) {
    				gtitle = properties.get("jcr:content/jcr:title", "");
    			}
    			
				linksColumnOne.add(new Link(gtitle, url));
			}
		}

		// legacy
		titleColumnTwo = "Most Read:";
		titleColumnTags = "Popular Topics:";
		linksColumnTwo = new ArrayList<CategoryLink>();
		linksColumnTags = new ArrayList<TagWrapper>();

		titleSocial = "Follow Us:";
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
	}
}