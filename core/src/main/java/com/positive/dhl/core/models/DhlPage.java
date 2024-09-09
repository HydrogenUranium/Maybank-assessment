package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.positive.dhl.core.components.EnvironmentConfiguration;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import static com.adobe.aem.wcm.seo.SeoTags.PN_ROBOTS_TAGS;
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
	private String ogtagimage;
	private String listimage;
	private String seoTitle;

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

	private String robotsTags = "";

	@PostConstruct
    protected void init() {
		assetprefix = environmentConfiguration.getAssetPrefix();
		akamaiHostname = environmentConfiguration.getAkamaiHostname();

		var isPublishRunmode = true;
		var mode = WCMMode.fromRequest(request);
		if (mode != WCMMode.DISABLED) {
			isPublishRunmode = false;
		}

		String currentPagePath = currentPage.getPath();

		fullUrl = (HTTPS_PREFIX + akamaiHostname).concat(request.getResourceResolver().map(currentPagePath));

		ValueMap properties = currentPage.getProperties();
		fullarticlepath = properties.get("fullarticlepath", "");
		amparticlepath = properties.get("amparticlepath", "");
		listimage = properties.get("listimage", "");
		seoTitle = properties.get("seoTitle", "");

		String path = properties.get("redirectTarget", "");
		if (!path.equals(currentPagePath) && !path.isEmpty() && isPublishRunmode) {
			response.setStatus(302);
			response.setHeader("Location", path);
		}

		robotsTags = getRobotTags(currentPage);

		pageUtilService.getAncestorPageByPredicate(currentPage,
				page -> page.getProperties().get("noIndexRobotsTagsInherit", false));

		String customOgTagImage = properties.get("ogtagimage", listimage);
		ogtagimage = StringUtils.isNotBlank(customOgTagImage)
				? (HTTPS_PREFIX + akamaiHostname + assetprefix).concat(customOgTagImage.trim())
				: HTTPS_PREFIX + akamaiHostname + "/etc.clientlibs/dhl/clientlibs/discover/resources/img/icons/192.png";
	}

	private String getRobotTags(Page page) {
		var tags = String.join(", ", page.getProperties().get(PN_ROBOTS_TAGS, new String[0]));
		if(!tags.contains("noindex") && pageUtilService.hasInheritedNoIndex(page)) {
			return tags.isBlank() ? "noindex" : tags + ", noindex";
		}
		return tags;
	}
}