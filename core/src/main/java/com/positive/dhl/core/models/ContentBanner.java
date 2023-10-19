package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.components.EnvironmentConfiguration;
import com.positive.dhl.core.services.PageUtilService;
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
	public static final String JCR_CONTENT_CONTENTBANNER = "contentbanner";
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

	@OSGiService
	private PageUtilService pageUtilService;

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
		return new ArrayList<>(points);
	}

    /**
	 *
	 */
	public void setPoints(List<String> points) {
		this.points = new ArrayList<>(points);
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
    	
		ValueMap properties = pageUtilService.getHomePageProperties(currentPage);
		if (properties.isEmpty()) {
			return;
		}

		String prefix = "0";

		ValueMap currentPageProperties = currentPage.getProperties();
		if (!currentPageProperties.isEmpty()) {
			prefix = currentPageProperties.get(JCR_CONTENT_CONTENTBANNER, "0");
		}

		if (("1").equals(prefix) || ("2").equals(prefix)) {
			hasbanner = true;
		}

		String assetPrefix = environmentConfiguration.getAssetPrefix();
		title = properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "title", "");
		subtitle = properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "subtitle", "");
		img = assetPrefix + properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "img", "");
		imgmob = assetPrefix + properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "imgmob", "");

		points.add(properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "point1", ""));
		points.add(properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "point2", ""));
		points.add(properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "point3", ""));
		points.add(properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "point4", ""));

		url = properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "url", "");
		urltitle = properties.get(JCR_CONTENT_CONTENTBANNER + prefix + "urltitle", "");
    }
}
