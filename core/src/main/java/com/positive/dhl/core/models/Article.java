package com.positive.dhl.core.models;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.positive.dhl.core.constants.DiscoverConstants;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;

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
	private String icon;
	private String grouptitle;
	private String groupTag;
	private String grouppath;
	private String fullTitle;
	private String title;
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
		if (resource != null) {
			ValueMap properties = resource.getValueMap();
			Date createdDate;
			String customDate = properties.get("jcr:content/custompublishdate", "");
			if ((customDate.trim().length() > 0) && (customDate.contains("T"))) {
				try {
					String[] parts = customDate.split("T");
					createdDate = (new SimpleDateFormat("yyyy-MM-dd")).parse(parts[0]);

				} catch (ParseException e) {
					createdDate = properties.get("jcr:content/custompublishdate", new Date());
				}

			} else {
				createdDate = properties.get("jcr:content/custompublishdate", new Date());
			}


			created = (new SimpleDateFormat("yyyy-MM-dd")).format(createdDate);
			createdfriendly = (new SimpleDateFormat("dd MMMM yyyy")).format(createdDate);
			icon = properties.get("jcr:content/mediatype", "");

			grouptitle = getGroupTitle(resource);
			grouppath = getGroupPath(resource);
			groupTag = transformToTag(grouptitle);

			fullTitle = properties.get("jcr:content/jcr:title", "");
			title = properties.get("jcr:content/navTitle", "");
			if ((title == null) || (title.trim().length() == 0)) {
				title = fullTitle;
			}
			brief = properties.get("jcr:content/listbrief", "");
			if (brief != null && brief.length() > 120) {
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

			tags = new ArrayList<TagWrapper>();
				/*
				TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
				String[] tagPaths = properties.get("jcr:content/cq:tags", new String[] { });

				for (String tagPath: tagPaths) {
					Tag tag = tagManager.resolve(tagPath);
					if (tag != null) {
						tags.add(new TagWrapper(tag));
					}
				}
				*/

			valid = true;
			path = resourceResolver.map(path);
		}
	}
    
    /**
	 * 
	 */
    private String getGroupTitle(Resource self) {
		if (self.getParent() != null) {
			Resource parent = self.getParent();
			if (parent != null) {
				ValueMap parentProperties = parent.adaptTo(ValueMap.class);
	    		if ((parentProperties != null) && ("dhl/components/pages/home").equals(parentProperties.get("jcr:content/sling:resourceType", ""))) {
	    			ValueMap selfProperties = self.adaptTo(ValueMap.class);
	
	    			if (selfProperties != null) {
		    			String gtitle = selfProperties.get("jcr:content/navTitle", "");
		    			if ((gtitle == null) || (gtitle.trim().length() == 0)) {
		    				gtitle = selfProperties.get("jcr:content/jcr:title", "");
		    			}
		    			
		    			return gtitle;
	    			}
	    		}
				return getGroupTitle(parent);
			}
		}
		return "";
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
		if (self.getParent() != null) {
			Resource parent = self.getParent();
			if (parent != null) {
				ValueMap parentProperties = parent.adaptTo(ValueMap.class);
	    		if ((parentProperties != null) && ("dhl/components/pages/home").equals(parentProperties.get("jcr:content/sling:resourceType", ""))) {
	    			return self.getPath();
	    		}
				return getGroupPath(parent);
			}
		}
		return "";
    }
}