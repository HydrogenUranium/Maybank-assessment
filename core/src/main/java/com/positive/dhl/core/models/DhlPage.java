package com.positive.dhl.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.components.GeneralSiteComponentConfig;
import com.positive.dhl.core.services.GeneralSiteConfigurationService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.settings.SlingSettingsService;

import com.day.cq.wcm.api.Page;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class DhlPage {
	@Inject
    private SlingSettingsService slingSettingsService;

	@Inject
	private SlingHttpServletRequest request;
	
	@Inject
	private SlingHttpServletResponse response;

	@OSGiService
	GeneralSiteConfigurationService generalSiteConfigurationService;
	
	@Inject
	private Page currentPage;
	
	private String fullUrl;
	private String fullarticlepath;
	private String amparticlepath;
	private String trackingid;
	private String gtmtrackingid;
	private String pathprefix;
	private String assetprefix;

	private Boolean noindex;
	
    /**
	 * 
	 */
	public String getFullUrl() {
		return fullUrl;
	}

    /**
	 * 
	 */
	public void setFullUrl(String fullUrl) {
		this.fullUrl = fullUrl;
	}

    /**
	 * 
	 */
	public String getFullarticlepath() {
		return fullarticlepath;
	}

    /**
	 * 
	 */
	public void setFullarticlepath(String fullarticlepath) {
		this.fullarticlepath = fullarticlepath;
	}

    /**
	 * 
	 */
	public String getAmparticlepath() {
		return amparticlepath;
	}

    /**
	 * 
	 */
	public void setAmparticlepath(String amparticlepath) {
		this.amparticlepath = amparticlepath;
	}
	
    /**
	 * 
	 */
	public String getTrackingid() {
		return trackingid;
	}

    /**
	 * 
	 */
	public void setTrackingid(String trackingid) {
		this.trackingid = trackingid;
	}
	
    /**
	 * 
	 */
	public String getGtmtrackingid() {
		return gtmtrackingid;
	}

    /**
	 * 
	 */
	public void setGtmtrackingid(String gtmtrackingid) {
		this.gtmtrackingid = gtmtrackingid;
	}
	
    /**
	 * 
	 */
	public String getPathprefix() {
		return pathprefix;
	}

    /**
	 * 
	 */
	public void setPathprefix(String pathprefix) {
		this.pathprefix = pathprefix;
	}

	/**
	 *
	 */
	public Boolean getNoindex() {
		return noindex;
	}

	/**
	 *
	 */
	public void setNoindex(Boolean noindex) {
		this.noindex = noindex;
	}

	/**
	 *
	 */
	public String getAssetprefix() { return assetprefix; }

	/**
	 *
	 */
	public void setAssetprefix(String assetprefix) { this.assetprefix = assetprefix; }

    /**
	 * 
	 */
	@PostConstruct
    protected void init() {
		pathprefix = "";
		assetprefix = "";
		trackingid = "";
		gtmtrackingid = "";
		noindex = false;

		Page home = currentPage.getAbsoluteParent(2);
		if (home != null) {
			ValueMap homeProperties = home.adaptTo(ValueMap.class);
			if (homeProperties != null) {
				pathprefix = homeProperties.get("jcr:content/pathprefix", "");
				trackingid = homeProperties.get("jcr:content/trackingid", "");
				gtmtrackingid = homeProperties.get("jcr:content/gtmtrackingid", "");
				noindex = homeProperties.get("jcr:content/noindex", false);
			}
		}

		if (this.generalSiteConfigurationService != null) {
			assetprefix = this.generalSiteConfigurationService.getAssetprefix();
		}

		String currentPagePath = currentPage.getPath();

		fullUrl = ("https://www.dhl.com" + pathprefix).concat(currentPage.getPath().replace("/content/dhl", ""));
		if (("https://www.dhl.com" + pathprefix).equals(fullUrl)) {
			fullUrl = ("https://www.dhl.com" + pathprefix).concat("/");
		}
		
		ValueMap properties = currentPage.getProperties();
		if (properties != null) {
			fullarticlepath = properties.get("fullarticlepath", "");
			amparticlepath = properties.get("amparticlepath", "");
			
			String path = properties.get("redirectTarget", "");
			if (!path.equals(currentPagePath) && !path.isEmpty()) {
				if (slingSettingsService.getRunModes().contains("publish")) {
					response.setStatus(302);  
					response.setHeader("Location", path); 
				}
			}
		}
	}
	
    /**
	 * 
	 */
	public String getHostDetail() {
		String serverName = request.getServerName();
		int port = request.getServerPort();
		
		if (!((port == 80) || (port == 443))) {
			return String.format("%s:%d", serverName, port);
		}
		
		return serverName;
	}
}