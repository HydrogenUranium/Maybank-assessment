package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.positive.dhl.core.components.EnvironmentConfiguration;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static com.positive.dhl.core.constants.DiscoverConstants.HTTPS_PREFIX;

@Getter
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
	private String assetprefix;
	private String akamaiHostname;
	private List<Canonical> canonicals;

	@InjectHomeProperty
	@Default(values = "")
	private String trackingid;
	@InjectHomeProperty
	@Default(values = "")
	private String gtmtrackingid;
	@InjectHomeProperty
	@Default(values = "")
	private String pathprefix;
	@InjectHomeProperty
	@Default(values = "ltr")
	private String direction;

	private boolean noindex = false;

	@PostConstruct
    protected void init() {
		assetprefix = environmentConfiguration.getAssetPrefix();
		akamaiHostname = environmentConfiguration.getAkamaiHostname();

		boolean isPublishRunmode = true;
		WCMMode mode = WCMMode.fromRequest(request);
		if (mode != WCMMode.DISABLED) {
			isPublishRunmode = false;
		}

		ValueMap homeProperties = pageUtilService.getHomePageProperties(currentPage);
		if (!homeProperties.isEmpty()) {
			noindex = homeProperties.get("noindex", false);
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