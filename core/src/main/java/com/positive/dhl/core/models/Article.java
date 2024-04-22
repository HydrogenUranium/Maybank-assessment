package com.positive.dhl.core.models;

import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.wcm.api.Page;
import com.google.gson.annotations.Expose;
import com.positive.dhl.core.constants.DiscoverConstants;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import com.positive.dhl.core.services.TagUtilService;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;

import javax.annotation.PostConstruct;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.day.cq.wcm.api.constants.NameConstants.*;
import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_LEVEL;

/**
 * It's a sling model of the 'article' piece of content
 */
@Getter
@Model(adaptables=Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class Article {

	@Self
	private Resource resource;

	@OSGiService
	private PageUtilService pageUtilService;

	@OSGiService
	private PathUtilService pathUtilService;

	@OSGiService
	private AssetUtilService assetUtilService;

	@OSGiService
	private TagUtilService tagUtilService;

	@OSGiService(
			injectionStrategy = InjectionStrategy.OPTIONAL
	)
	protected AssetDelivery assetDelivery;

	@Setter
	private boolean valid;

	@Setter
	private boolean current;

	@Setter
	private int index;

	@Setter
	private boolean third;

	@Setter
	private boolean fourth;

	@Expose private String createdfriendly;
	@Expose private String created;
    private Date createdDate;
	@Expose private long createdMilliseconds;
	private String icon;
	private String grouptitle;
	@Expose private String groupTag;
	private String grouppath;
	private String fullTitle;
	@Expose private String title;
	@Expose private String description;
	private String brief;
	@Expose private String author;
	private String authortitle;
	private String authorimage;
	@Expose private String readtime;
	@Expose private String listimage;

	@Setter
	private String heroimagemob;
	@Setter
	private String heroimagetab;
	@Setter
	private String heroimagedt;

	private String youtubeid;
	private boolean showshipnow;
	private List<TagWrapper> tags;
	@Expose private List<String> tagsToShow = new ArrayList<>();
	private List<String> highlights = new ArrayList<>();
	private int counter;
	private Locale locale;
	@Expose protected String path;
	private String jcrPath;
	private ValueMap valueMap;

	public String getMappedValue(String path, boolean enableAssetDelivery, Map<String, Object> props) {
		return enableAssetDelivery ? assetUtilService.getMappedDeliveryUrl(path, props, assetDelivery) : pathUtilService.map(path);
	}

	/**
	 * This method updates all asset paths. If the article is used in HTL, all link transformations will
	 * be processed by the link transformer, and link optimization will be processed in the HTL template. However,
	 * if the article is used outside HTL, this method can transform and optimize links.
	 * @param enableAssetDelivery enable dynamic media asset optimization
	 * @param props dynamic media parameters
	 */
	public void initAssetDeliveryProperties(boolean enableAssetDelivery, Map<String, Object> props) {
			listimage = getMappedValue(listimage, enableAssetDelivery, props);
			heroimagemob = getMappedValue(heroimagemob, enableAssetDelivery, props);
			heroimagetab = getMappedValue(heroimagetab, enableAssetDelivery, props);
			heroimagedt = getMappedValue(heroimagedt, enableAssetDelivery, props);
			authorimage = getMappedValue(authorimage, enableAssetDelivery, props);
	}

	public void initAssetDeliveryProperties(boolean enableAssetDelivery) {
		initAssetDeliveryProperties(enableAssetDelivery, new HashMap<>());
	}

	public void initAssetDeliveryProperties(boolean enableAssetDelivery, String quality) {
		if (quality == null) {
			initAssetDeliveryProperties(enableAssetDelivery);
		} else {
			initAssetDeliveryProperties(enableAssetDelivery, Map.of("quality", quality));
		}

	}

	/**
	 * Returns the article category types
	 * @return a {@link List} of {@code String}s where each element represents one category type
	 */
	public static List<String> getArticlePageTypes() {
		return DiscoverConstants.getCategoryTypes();
	}

    @PostConstruct
	protected void init() {
    	valid = false;
		valueMap = resource.getValueMap();

		locale = pageUtilService.getLocale(resource);
		createdDate = getPublishDate(valueMap);
		createdMilliseconds = createdDate.getTime();
		created = (new SimpleDateFormat("yyyy-MM-dd")).format(createdDate);
		createdfriendly = DateFormat.getDateInstance(DateFormat.LONG, locale).format(createdDate);
		icon = valueMap.get("jcr:content/mediatype", "");
		grouptitle = getGroupTitle(resource);
		grouppath = getGroupPath(resource);
		groupTag = tagUtilService.transformToHashtag(grouptitle);

		fullTitle = valueMap.get("jcr:content/jcr:title", "");
		title = valueMap.get("jcr:content/navTitle", "");
		description = valueMap.get("jcr:content/jcr:description", "");
		if (title.isBlank()) {
			title = fullTitle;
		}
		brief = valueMap.get("jcr:content/listbrief", "");
		if (brief.length() > 120) {
			brief = brief.substring(0, 120).concat("...");
		}

		listimage = valueMap.get("jcr:content/listimage", "");
		heroimagemob = valueMap.get("jcr:content/heroimagemob", "");
		heroimagetab = valueMap.get("jcr:content/heroimagetab", "");
		heroimagedt = valueMap.get("jcr:content/heroimagedt", "");
		authorimage = valueMap.get("jcr:content/authorimage", "");

		youtubeid = valueMap.get("jcr:content/youtubeid", "");
		readtime = valueMap.get("jcr:content/readtime", "");
		author = valueMap.get("jcr:content/author", "");
		authortitle = valueMap.get("jcr:content/authortitle", "");

		showshipnow = valueMap.get("jcr:content/showshipnow", false);

		counter = valueMap.get("jcr:content/counter", 0);

		tags = new ArrayList<>();
		tagsToShow = tagUtilService.getExternalTags(resource);
		highlights = tagUtilService.getHighlightsTags(resource);

		jcrPath = resource.getPath();
		path = resource.getResourceResolver().map(resource.getPath());

		valid = true;
	}

    /**
	 *
	 */
    private String getGroupTitle(Resource self) {
		return Optional.ofNullable(self)
				.map(r -> r.adaptTo(Page.class))
				.map(p -> p.getAbsoluteParent(CATEGORY_PAGE_LEVEL))
				.map(Page::getProperties)
				.map(properties -> properties.get(PN_NAV_TITLE, properties.get(PN_TITLE, "")))
				.orElse("");
    }

    /**
	 *
	 */
    private String getGroupPath(Resource self) {
		return Optional.ofNullable(self)
				.map(r -> r.adaptTo(Page.class))
				.map(p -> p.getAbsoluteParent(CATEGORY_PAGE_LEVEL))
				.map(Page::getPath)
				.orElse("");
    }

	private Date getPublishDate(@NonNull ValueMap properties) {
		Date customPublishDate = properties.get("jcr:content/custompublishdate", Date.class);
		if (customPublishDate != null) {
			return customPublishDate;
		} else {
			Date jcrCreated = properties.get(PN_CREATED, new Date());
			Date cqLastModified = properties.get("jcr:content/" + PN_PAGE_LAST_MOD, jcrCreated);
			return jcrCreated.after(cqLastModified) ? jcrCreated : cqLastModified;
		}
	}
}