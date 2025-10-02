package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.api.policies.ContentPolicy;
import com.day.cq.wcm.api.policies.ContentPolicyManager;
import com.dhl.discover.core.components.EnvironmentConfiguration;
import com.dhl.discover.core.injectors.InjectHomeProperty;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.PageUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;

import static com.adobe.aem.wcm.seo.SeoTags.PN_ROBOTS_TAGS;
import static com.dhl.discover.core.constants.DiscoverConstants.HTTPS_PREFIX;

@Getter
@Model(adaptables=SlingHttpServletRequest.class)
public class DhlPage {
	@OSGiService
	@Getter(AccessLevel.NONE)
	private AssetUtilService assetUtilService;

	@SlingObject
	private SlingHttpServletRequest request;
	
	@SlingObject
	private SlingHttpServletResponse response;

	@SlingObject
	private Resource currentResource;

	@SlingObject
	private ResourceResolver resourceResolver;
	
	@ScriptVariable
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
	private String pageImage;
	private String seoTitle;
	private String adobeDtmLink;
	private String gtmDelayEnabled;
	private Boolean chatbotEnabled;
	private String isChatbotEnabledPage;
	private String isChatbotEnabledTemplate;

	@InjectHomeProperty
	@Default(values = "")
	private String gtmtrackingid;
	@InjectHomeProperty
	@Default(values = "ltr")
	private String direction;

	private String robotsTags = "";

	private static final String DEFAULT_PAGE_IMAGE = "/etc.clientlibs/dhl/clientlibs/discover/resources/img/categoryCarouselImage-desk.jpg";
	private static final String DEFAULT_OG_IMAGE = "/etc.clientlibs/dhl/clientlibs/discover/resources/img/icons/200.png";

	private static final String CHAT_ENABLED_STRING = "enabled";
	private static final String CHAT_DISABLED_STRING = "disabled";

	@InjectHomeProperty
	@Default(values = "")
	private String brandSlug;

	@InjectHomeProperty
	@Default(values = CHAT_ENABLED_STRING)
	private String isChatbotEnabledHomepage;

	@InjectHomeProperty
	@Default(values = "")
	private String chatbotId;

	@PostConstruct
    protected void init() {
		adobeDtmLink = environmentConfiguration.getAdobeDtmLink();
		assetprefix = environmentConfiguration.getAssetPrefix();
		akamaiHostname = environmentConfiguration.getAkamaiHostname();
		gtmDelayEnabled = environmentConfiguration.getGtmDelayEnabled();

		gtmtrackingid = StringUtils.trimToEmpty(gtmtrackingid);

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
		pageImage = assetUtilService.getPageImagePath(currentPage.getContentResource());
		seoTitle = properties.get("seoTitle", "");

		String path = properties.get("redirectTarget", "");
		if (!path.equals(currentPagePath) && !path.isEmpty() && isPublishRunmode) {
			response.setStatus(302);
			response.setHeader("Location", path);
		}

		robotsTags = getRobotTags(currentPage);

		pageUtilService.getAncestorPageByPredicate(currentPage,
				page -> page.getProperties().get("noIndexRobotsTagsInherit", false));

		String customOgTagImage = properties.get("ogtagimage", pageImage);

		String basePrefix = DEFAULT_PAGE_IMAGE.equals(customOgTagImage)
				? (HTTPS_PREFIX + akamaiHostname)
				: (HTTPS_PREFIX + akamaiHostname + assetprefix);

		ogtagimage = StringUtils.isNotBlank(customOgTagImage)
				? basePrefix.concat(customOgTagImage.trim())
				: (HTTPS_PREFIX + akamaiHostname + DEFAULT_OG_IMAGE);

		if (StringUtils.isNotBlank(brandSlug) && brandSlug.contains("DHL")) {
			brandSlug = brandSlug.replace("DHL ", "");
		}

		chatbotId = StringUtils.trimToEmpty(chatbotId);

		isChatbotEnabledPage = properties.get("isChatbotEnabledPage", "inherit");

		isChatbotEnabledTemplate = getEnabledChatbotTemplate();

		if (isChatbotEnabledTemplate.equals(CHAT_ENABLED_STRING) && isChatbotEnabledHomepage.equals(CHAT_ENABLED_STRING) && (isChatbotEnabledPage.equals(CHAT_ENABLED_STRING) || isChatbotEnabledPage.equals("inherit"))) {
			chatbotEnabled = Boolean.TRUE;
		} else  {
			chatbotEnabled = Boolean.FALSE;
		}
	}

	private String getEnabledChatbotTemplate() {
		resourceResolver = request.getResourceResolver();
		currentResource = resourceResolver.resolve(request.getRequestPathInfo().getResourcePath());
		ContentPolicyManager contentPolicyManager = resourceResolver.adaptTo(ContentPolicyManager.class);
		ContentPolicy contentPolicy = contentPolicyManager.getPolicy(currentResource);

		if (contentPolicy == null) {
			return CHAT_DISABLED_STRING;
		}

		ValueMap properties = contentPolicy.getProperties();
		if (properties == null) {
			return CHAT_DISABLED_STRING;
		}

		String chatbotEnabledTemplate = properties.get("isChatbotEnabledTemplate", String.class);
		if (chatbotEnabledTemplate == null) {
			return CHAT_DISABLED_STRING;
		}

		return chatbotEnabledTemplate.equals(CHAT_ENABLED_STRING) ? CHAT_ENABLED_STRING : CHAT_DISABLED_STRING;
	}

	private String getRobotTags(Page page) {
		var tags = String.join(", ", page.getProperties().get(PN_ROBOTS_TAGS, new String[0]));
		if(!tags.contains("noindex") && pageUtilService.hasInheritedNoIndex(page)) {
			return tags.isBlank() ? "noindex" : (tags + ", noindex");
		}
		return tags;
	}
}