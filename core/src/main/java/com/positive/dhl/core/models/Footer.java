package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE;

/**
 * @deprecated (will be removed together with old footer)
 */
@Deprecated(since = "2.1", forRemoval = true)
@Model(adaptables=SlingHttpServletRequest.class)
public class Footer {
	@Inject
	private Page currentPage;

	@OSGiService
	private PageUtilService pageUtilService;

	private String titleColumnOne;
	private List<Link> linksColumnOne;
	private String titleColumnTwo;
	private List<CategoryLink> linksColumnTwo;
	private String titleColumnTags;
	private List<TagWrapper> linksColumnTags;
	private String titleSocial;
	private List<SocialLink> linksSocial;

	public String getTitleColumnOne() {
		return titleColumnOne;
	}

	public void setTitleColumnOne(String titleColumnOne) {
		this.titleColumnOne = titleColumnOne;
	}

	public List<Link> getLinksColumnOne() {
		return new ArrayList<>(linksColumnOne);
	}

	public void setLinksColumnOne(List<Link> linksColumnOne) {
		this.linksColumnOne = new ArrayList<>(linksColumnOne);
	}

	public String getTitleColumnTwo() {
		return titleColumnTwo;
	}

	public void setTitleColumnTwo(String titleColumnTwo) {
		this.titleColumnTwo = titleColumnTwo;
	}

	public List<CategoryLink> getLinksColumnTwo() {
		return new ArrayList<>(linksColumnTwo);
	}

	public void setLinksColumnTwo(List<CategoryLink> linksColumnTwo) {
		this.linksColumnTwo = new ArrayList<>(linksColumnTwo);
	}

	public String getTitleColumnTags() {
		return titleColumnTags;
	}

	public void setTitleColumnTags(String titleColumnTags) {
		this.titleColumnTags = titleColumnTags;
	}

	public List<TagWrapper> getLinksColumnTags() {
		return new ArrayList<>(linksColumnTags);
	}

	public void setLinksColumnTags(List<TagWrapper> linksColumnTags) {
		this.linksColumnTags = new ArrayList<>(linksColumnTags);
	}

	public String getTitleSocial() {
		return titleSocial;
	}

	public void setTitleSocial(String titleSocial) {
		this.titleSocial = titleSocial;
	}

	public List<SocialLink> getLinksSocial() {
		return new ArrayList<>(linksSocial);
	}

	public void setLinksSocial(List<SocialLink> linksSocial) {
		this.linksSocial = new ArrayList<>(linksSocial);
	}

	@PostConstruct
    protected void init() {
		titleColumnOne = "Categories:";
		linksColumnOne = new ArrayList<>();

		// legacy
		titleColumnTwo = "Most Read:";
		titleColumnTags = "Popular Topics:";
		linksColumnTwo = new ArrayList<>();
		linksColumnTags = new ArrayList<>();

		titleSocial = "Follow Us:";
		linksSocial = new ArrayList<>();

		Page home = pageUtilService.getHomePage(currentPage);
		if (home == null) {
			return;
		}

		Iterator<Page> children = home.listChildren();
		while (children.hasNext()) {
			Page child = children.next();
			ValueMap properties = child.adaptTo(ValueMap.class);
			if ((properties != null) && properties.get("jcr:content/sling:resourceType", "").equals(CATEGORY_PAGE_DYNAMIC_RESOURCE_TYPE)) {
				String url = child.getPath() + ".html";

				boolean hideInNav = properties.get("jcr:content/hideInNav", false);
				if (hideInNav) {
					continue;
				}
				
    			String gtitle = properties.get("jcr:content/navTitle", "");
    			if (gtitle.isBlank()) {
    				gtitle = properties.get("jcr:content/jcr:title", "");
    			}
    			
				linksColumnOne.add(new Link(gtitle, url));
			}
		}

		Resource socialItems = home.getContentResource("items");
		if (socialItems == null) {
			return;
		}

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