package com.positive.dhl.core.constants;

import com.day.cq.commons.jcr.JcrConstants;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;

import java.text.MessageFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Class holding immutable 'configuration' (and other) values
 */
public class DiscoverConstants {

	public static final String DISCOVER_READ_SERVICE="discoverReader";
	public static final String DISCOVER_WRITE_SERVICE="discoverWriter";
	private static final String[] CATEGORIES_PROPERTY_NAMES = new String[] { "category0", "category1", "category2", "category3" };
	public static final String CATEGORY_PAGE_TEMPLATE = "dhl/components/pages/articlecategory";
	public static final String DHL_COMPONENT_PATH = "dhl/components/pages/";

	private static final Map<String,String> articlesQueryMap;

	private DiscoverConstants() {
		throw new IllegalStateException("Not meant to be instantiated");
	}

	public static List<String> getCategoriesPropertyNames(){
		return Arrays.stream(CATEGORIES_PROPERTY_NAMES).collect(Collectors.toUnmodifiableList());
	}

	public static List<String> getCategoryTypes(){

		return List.of(
				"article",
				"articlegated",
				"articlewithtrending",
				"animatedpage201901",
				"animatedpage20190225",
				"animatedpage20190523",
				"animatedpage20190624",
				"animatedpage20190724",
				"animatedpage20190805",
				"animatedpage20191021",
				"animatedpage20191025",
				"animatedpage20191101",
				"animatedpage20191122");
	}
	public static Map<String,String> getArticlesQueryMap(){
		return articlesQueryMap;
	}

	static {
		Map<String,String> map = new HashMap<>();
		map.put("type", "cq:Page");
		map.put("property", JcrConstants.JCR_CONTENT + "/" + JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY);
		map.put("property.and","false");

		List<String> articleTypes = DiscoverConstants.getCategoryTypes();
		int counter = 1;
		for (String articleType : articleTypes){
			String predicate = MessageFormat.format("property.{0}_value",counter);
			map.put(predicate,DHL_COMPONENT_PATH + articleType);
			counter++;
		}
		map.put("orderby", "@" + JcrConstants.JCR_CONTENT + "/custompublishdate");
		map.put("orderby.sort", "desc");
		map.put("p.limit", "50");
		articlesQueryMap = map;
	}

}
