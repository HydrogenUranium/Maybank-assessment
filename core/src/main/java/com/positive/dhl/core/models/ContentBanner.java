package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.components.EnvironmentConfiguration;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import com.day.cq.wcm.api.Page;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class ContentBanner {
	@Inject
	private Page currentPage;

	private Boolean hasbanner;
	private String title;
	private String subtitle;
	private List<String> points;
	private String img;
	private String imgmob;
	private String url;
	private String urltitle;

	@OSGiService
	private EnvironmentConfiguration environmentConfiguration;

    /**
	 *
	 */
    public Boolean getHasbanner() {
		return hasbanner;
	}

    /**
	 *
	 */
	public void setHasbanner(Boolean hasbanner) {
		this.hasbanner = hasbanner;
	}

    /**
	 *
	 */
	public String getTitle() {
		return title;
	}

    /**
	 *
	 */
	public void setTitle(String title) {
		this.title = title;
	}

    /**
	 *
	 */
	public String getSubtitle() {
		return subtitle;
	}

    /**
	 *
	 */
	public void setSubtitle(String subtitle) {
		this.subtitle = subtitle;
	}

    /**
	 *
	 */
	public List<String> getPoints() {
		return new ArrayList<String>(points);
	}

    /**
	 *
	 */
	public void setPoints(List<String> points) {
		this.points = new ArrayList<String>(points);
	}

    /**
	 *
	 */
	public String getImg() {
		return img;
	}

    /**
	 *
	 */
	public void setImg(String img) {
		this.img = img;
	}

    /**
	 *
	 */
	public String getImgmob() {
		return imgmob;
	}

    /**
	 *
	 */
	public void setImgmob(String imgmob) {
		this.imgmob = imgmob;
	}

    /**
	 *
	 */
	public String getUrl() {
		return url;
	}

    /**
	 *
	 */
	public void setUrl(String url) {
		this.url = url;
	}

    /**
	 *
	 */
	public String getUrltitle() {
		return urltitle;
	}

    /**
	 *
	 */
	public void setUrltitle(String urltitle) {
		this.urltitle = urltitle;
	}

    /**
	 *
	 */
	@PostConstruct
	protected void init() {
    	hasbanner = false;
    	points = new ArrayList<>();
    	
		Page home = currentPage.getAbsoluteParent(2);
		if (home == null) {
			return;
		}

		ValueMap properties = home.adaptTo(ValueMap.class);
		if (properties == null) {
			return;
		}

		String prefix = "0";

		ValueMap currentPageProperties = currentPage.adaptTo(ValueMap.class);
		if (currentPageProperties != null) {
			prefix = currentPageProperties.get("jcr:content/contentbanner", "0");
		}

		if (("1").equals(prefix) || ("2").equals(prefix)) {
			hasbanner = true;
		}

		String assetPrefix = environmentConfiguration.getAssetPrefix();
		title = properties.get("jcr:content/contentbanner" + prefix + "title", "");
		subtitle = properties.get("jcr:content/contentbanner" + prefix + "subtitle", "");
		img = assetPrefix + properties.get("jcr:content/contentbanner" + prefix + "img", "");
		imgmob = assetPrefix + properties.get("jcr:content/contentbanner" + prefix + "imgmob", "");

		points.add(properties.get("jcr:content/contentbanner" + prefix + "point1", ""));
		points.add(properties.get("jcr:content/contentbanner" + prefix + "point2", ""));
		points.add(properties.get("jcr:content/contentbanner" + prefix + "point3", ""));
		points.add(properties.get("jcr:content/contentbanner" + prefix + "point4", ""));

		url = properties.get("jcr:content/contentbanner" + prefix + "url", "");
		urltitle = properties.get("jcr:content/contentbanner" + prefix + "urltitle", "");
    }
}
