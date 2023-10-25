package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.tagging.TagManager;
import com.positive.dhl.core.constants.DiscoverConstants;
import com.positive.dhl.core.services.PageUtilService;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import static com.day.cq.commons.jcr.JcrConstants.JCR_CONTENT;
import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;
import static com.day.cq.wcm.api.constants.NameConstants.PN_CREATED;
import static com.day.cq.wcm.api.constants.NameConstants.PN_PAGE_LAST_MOD;
import static com.positive.dhl.core.services.PageUtilService.CATEGORY_PAGE_LEVEL;

/**
 * It's a sling model of the 'article' piece of content
 */
@Getter
@Setter
@Model(adaptables=Resource.class)
public class Article {
	@Inject
	private ResourceResolver resourceResolver;

	@Inject
	public String path;

	private Boolean valid;
	private Boolean current;
	private int index;
	private Boolean third;
	private Boolean fourth;
	private String createdfriendly;
	private String created;
	private Date createdDate;
	private String icon;
	private String grouptitle;
	private String groupTag;
	private String grouppath;
	private String fullTitle;
	private String title;
	private String description;
	private String brief;
	private String author;
	private String authortitle;
	private String authorimage;
	private String readtime;
	private String listimage;
	private String heroimagemob;
	private String heroimagetab;
	private String heroimagedt;
	private String youtubeid;
	private Boolean showshipnow;
	private List<TagWrapper> tags;
	private List<String> tagsToShow = new ArrayList<>();
	private Integer counter;



	/**
	 * Returns the article category types
	 * @return a {@link List} of {@code String}s where each element represents one category type
	 */
	public static List<String> getArticlePageTypes() {
		return DiscoverConstants.getCategoryTypes();
	}

    /**
	 *
	 */
	public Article() { }

	/**
	 * Constructor setting up only the most basic properties
	 * @param path is a String representing the repository path of the resource we're adapting to model
	 * @param resourceResolver is an instance of {@link ResourceResolver}
	 */
	public Article(String path, ResourceResolver resourceResolver) {
		this.resourceResolver = resourceResolver;
		this.path = path;
		this.init();
	}



    /**
	 *
	 */
    @PostConstruct
	protected void init() {
    	valid = false;
		Resource resource = resourceResolver.getResource(path);
		if (resource == null) {
			return;
		}
		ValueMap properties = resource.getValueMap();

		createdDate = getPublishDate(properties);
		created = (new SimpleDateFormat("yyyy-MM-dd")).format(createdDate);
		createdfriendly = DateFormat.getDateInstance(DateFormat.LONG, new PageUtilService().getLocale(resource)).format(createdDate);
		icon = properties.get("jcr:content/mediatype", "");
		grouptitle = getGroupTitle(resource);
		grouppath = getGroupPath(resource);
		groupTag = transformToTag(grouptitle);

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

		listimage = properties.get("jcr:content/listimage", "");

		heroimagemob = properties.get("jcr:content/heroimagemob", "");
		heroimagetab = properties.get("jcr:content/heroimagetab", "");
		heroimagedt = properties.get("jcr:content/heroimagedt", "");
		youtubeid = properties.get("jcr:content/youtubeid", "");
		readtime = properties.get("jcr:content/readtime", "");
		author = properties.get("jcr:content/author", "");
		authortitle = properties.get("jcr:content/authortitle", "");
		authorimage = properties.get("jcr:content/authorimage", "");

		showshipnow = properties.get("jcr:content/showshipnow", false);

		counter = properties.get("jcr:content/counter", 0);

		tags = new ArrayList<>();
		TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
		if (tagManager != null) {
			tagsToShow = Arrays.stream(tagManager.getTags(resource.getChild(JCR_CONTENT)))
					.map(tag -> transformToTag(tag.getTitle()))
					.collect(Collectors.toList());
		}

		valid = true;
		path = resourceResolver.map(path);
	}

    /**
	 *
	 */
    private String getGroupTitle(Resource self) {
		return Optional.ofNullable(self)
				.map(r -> r.adaptTo(Page.class))
				.map(p -> p.getAbsoluteParent(CATEGORY_PAGE_LEVEL))
				.map(Page::getProperties)
				.map(properties -> properties.get("navTitle", properties.get(JCR_TITLE, "")))
				.orElse("");
    }

	private String transformToTag(String name) {
		Map<String, String> customTransformation = Map.of(
				"e-commerce", "eCommerce",
				"b2b", "b2b"
		);

		return "#" + Arrays.stream(StringUtils.lowerCase(name)
				.split(" "))
				.map(s -> customTransformation.getOrDefault(s, StringUtils.capitalize(s)))
				.collect(Collectors.joining());
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
			Date cqLastModified = properties.get(PN_PAGE_LAST_MOD, jcrCreated);
			return jcrCreated.after(cqLastModified) ? jcrCreated : cqLastModified;
		}
	}
}