package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.google.gson.annotations.Expose;
import com.positive.dhl.core.constants.DiscoverConstants;
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
	private TagUtilService tagUtilService;

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
	private String heroimagemob;
	private String heroimagetab;
	private String heroimagedt;

	private String listimageProp;
	private String heroimagemobProp;
	private String heroimagetabProp;
	private String heroimagedtProp;
	private String authorimageProp;

	private String youtubeid;
	private boolean showshipnow;
	private List<TagWrapper> tags;
	@Expose private List<String> tagsToShow = new ArrayList<>();
	private List<String> highlights = new ArrayList<>();
	private int counter;
	private Locale locale;
	@Expose protected String path;

	public void initAssetDeliveryProperties(boolean enableAssetDelivery, Map<String, Object> props) {
		listimage = pathUtilService.resolveAssetPath(listimageProp, enableAssetDelivery, props);
		heroimagemob = pathUtilService.resolveAssetPath(heroimagemobProp, enableAssetDelivery, props);
		heroimagetab = pathUtilService.resolveAssetPath(heroimagetabProp, enableAssetDelivery, props);
		heroimagedt = pathUtilService.resolveAssetPath(heroimagedtProp, enableAssetDelivery, props);
		authorimage = pathUtilService.resolveAssetPath(authorimageProp, enableAssetDelivery, props);

	}

	public void initAssetDeliveryProperties(boolean enableAssetDelivery) {
		initAssetDeliveryProperties(enableAssetDelivery, new HashMap<>());
	}

	public void initAssetDeliveryProperties(boolean enableAssetDelivery, String quality) {
		initAssetDeliveryProperties(enableAssetDelivery, Map.of("quality", quality));
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
		ValueMap properties = resource.getValueMap();

		locale = pageUtilService.getLocale(resource);
		createdDate = getPublishDate(properties);
		createdMilliseconds = createdDate.getTime();
		created = (new SimpleDateFormat("yyyy-MM-dd")).format(createdDate);
		createdfriendly = DateFormat.getDateInstance(DateFormat.LONG, locale).format(createdDate);
		icon = properties.get("jcr:content/mediatype", "");
		grouptitle = getGroupTitle(resource);
		grouppath = getGroupPath(resource);
		groupTag = tagUtilService.transformToHashtag(grouptitle);

		fullTitle = properties.get("jcr:content/jcr:title", "");
		title = properties.get("jcr:content/navTitle", "");
		description = properties.get("jcr:content/jcr:description", "");
		if (title.isBlank()) {
			title = fullTitle;
		}
		brief = properties.get("jcr:content/listbrief", "");
		if (brief.length() > 120) {
			brief = brief.substring(0, 120).concat("...");
		}

		listimageProp = properties.get("jcr:content/listimage", "");
		heroimagemobProp = properties.get("jcr:content/heroimagemob", "");
		heroimagetabProp = properties.get("jcr:content/heroimagetab", "");
		heroimagedtProp = properties.get("jcr:content/heroimagedt", "");
		authorimageProp = properties.get("jcr:content/authorimage", "");

		listimage = pathUtilService.resolveAssetPath(listimageProp);
		heroimagemob = pathUtilService.resolveAssetPath(heroimagemobProp);
		heroimagetab = pathUtilService.resolveAssetPath(heroimagetabProp);
		heroimagedt = pathUtilService.resolveAssetPath(heroimagedtProp);
		authorimage = pathUtilService.resolveAssetPath(authorimageProp);

		youtubeid = properties.get("jcr:content/youtubeid", "");
		readtime = properties.get("jcr:content/readtime", "");
		author = properties.get("jcr:content/author", "");
		authortitle = properties.get("jcr:content/authortitle", "");

		showshipnow = properties.get("jcr:content/showshipnow", false);

		counter = properties.get("jcr:content/counter", 0);

		tags = new ArrayList<>();
		tagsToShow = tagUtilService.getExternalTags(resource);
		highlights = tagUtilService.getHighlightsTags(resource);

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