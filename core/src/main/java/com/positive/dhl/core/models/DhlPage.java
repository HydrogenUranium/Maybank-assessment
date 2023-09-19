package com.positive.dhl.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.positive.dhl.core.components.EnvironmentConfiguration;

import static com.positive.dhl.core.constants.DiscoverConstants.HTTPS_PREFIX;

/**
 *
 */
@Model(adaptables=SlingHttpServletRequest.class)
public class DhlPage {

	@Inject
	private SlingHttpServletRequest request;
	
	@Inject
	private SlingHttpServletResponse response;
	
	@Inject
	private Page currentPage;

	@OSGiService
	private EnvironmentConfiguration environmentConfiguration;

	@OSGiService
	private PageUtilService pageUtilService;

	private String fullUrl;
	private String fullarticlepath;
	private String amparticlepath;
	private String trackingid;
	private String gtmtrackingid;
	private String pathprefix;
	private String assetprefix;
	private String akamaiHostname;

	private boolean noindex;
	private List<Canonical> canonicals;
	
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
	public boolean getNoindex() {
		return noindex;
	}

    /**
	 * 
	 */
	public List<Canonical> getCanonicals() {
		return new ArrayList<>(canonicals);
	}

	/**
	 *
	 */
	public void setNoindex(boolean noindex) {
		this.noindex = noindex;
	}

    /**
	 * 
	 */
	public void setCanonicals(List<Canonical> canonicals) {
		this.canonicals = new ArrayList<>(canonicals);
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
	public String getAkamaiHostname() { return akamaiHostname; }

	/**
	 *
	 */
	public void setAkamaiHostname(String akamaiHostname) { this.akamaiHostname = akamaiHostname; }

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
		akamaiHostname = environmentConfiguration.getAkamaiHostname();

		boolean isPublishRunmode = true;
		WCMMode mode = WCMMode.fromRequest(request);
		if (mode != WCMMode.DISABLED) {
			isPublishRunmode = false;
		}

		ValueMap homeProperties = pageUtilService.getHomePageProperties(currentPage);
		if (!homeProperties.isEmpty()) {

			assetprefix = environmentConfiguration.getAssetPrefix();
			pathprefix = homeProperties.get("jcr:content/pathprefix", "");
			trackingid = homeProperties.get("jcr:content/trackingid", "");
			gtmtrackingid = homeProperties.get("jcr:content/gtmtrackingid", "");
			noindex = homeProperties.get("jcr:content/noindex", false);
		}

		String currentPagePath = currentPage.getPath();

		fullUrl = (HTTPS_PREFIX + akamaiHostname).concat(request.getResourceResolver().map(currentPagePath));
		
		ValueMap properties = currentPage.getProperties();
		if (properties != null) {
			fullarticlepath = properties.get("fullarticlepath", "");
			amparticlepath = properties.get("amparticlepath", "");
			
			String path = properties.get("redirectTarget", "");
			if (!path.equals(currentPagePath) && !path.isEmpty() && isPublishRunmode) {
				response.setStatus(302);  
				response.setHeader("Location", path);
			}

			// if 'noindex' is set on the homepage, all pages have no-index set, otherwise the settings is on individual pages
			if (!noindex) {
				noindex = properties.get("noindex", false);
			}

			// get list of canonical URLs
 			canonicals = new ArrayList<>();
			Resource canonicalItems = currentPage.getContentResource("canonicalitems");
			if (canonicalItems != null) {
				Iterator<Resource> canonicalItemsIterator = canonicalItems.listChildren();
				while (canonicalItemsIterator.hasNext()) {
					ValueMap props = canonicalItemsIterator.next().adaptTo(ValueMap.class);
					if (props != null) {

						String url = props.get("url", "");
						if (!("").equals(url)) {
							canonicals.add(new Canonical(url));
						}
					}
				}
			}
		}
	}
}