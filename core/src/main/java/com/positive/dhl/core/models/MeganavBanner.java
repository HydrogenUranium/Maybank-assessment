package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class MeganavBanner {
	@Inject
	private Page currentPage;

	@OSGiService
	private PageUtilService pageUtilService;

	private String title;
    private String subtitle;
    private String point1;
    private String point2;
    private String point3;
    private String point4;
    private String url;
    private String urltitle;
    
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
	public String getPoint1() {
		return point1;
	}

    /**
	 * 
	 */
	public void setPoint1(String point1) {
		this.point1 = point1;
	}

    /**
	 * 
	 */
	public String getPoint2() {
		return point2;
	}

    /**
	 * 
	 */
	public void setPoint2(String point2) {
		this.point2 = point2;
	}

    /**
	 * 
	 */
	public String getPoint3() {
		return point3;
	}

    /**
	 * 
	 */
	public void setPoint3(String point3) {
		this.point3 = point3;
	}

    /**
	 * 
	 */
	public String getPoint4() {
		return point4;
	}

    /**
	 * 
	 */
	public void setPoint4(String point4) {
		this.point4 = point4;
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
		ValueMap properties = pageUtilService.getHomePageProperties(currentPage);
		if (!properties.isEmpty()) {
			title = properties.get("jcr:content/meganavbannertitle", "");
			subtitle = properties.get("jcr:content/meganavbannersubtitle", "");

			point1 = properties.get("jcr:content/meganavbannerpoint1", "");
			point2 = properties.get("jcr:content/meganavbannerpoint2", "");
			point3 = properties.get("jcr:content/meganavbannerpoint3", "");
			point4 = properties.get("jcr:content/meganavbannerpoint4", "");
			
			url = properties.get("jcr:content/meganavbannerurl", "");
			urltitle = properties.get("jcr:content/meganavbannerurltitle", "");
		}
    }
}