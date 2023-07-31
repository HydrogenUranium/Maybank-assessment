package com.positive.dhl.core.constants;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.constants.NameConstants;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;

import java.text.MessageFormat;
import java.util.*;

/**
 * Class holding immutable 'configuration' (and other) values
 */
public class DiscoverConstants {

	/**
	 * FORM START parameter (this parameter is used in {@link com.positive.dhl.core.filters.ForwardFilter} to determine whether
	 * the request is to be forwarded to the location present in the value (if it exists in the repository)
	 */
	public static final String FORM_START_PARAM = "formStart";
	public static final String DISCOVER_READ_SERVICE="discoverReader";
	public static final String DISCOVER_WRITE_SERVICE="discoverWriter";
	private static final String[] CATEGORIES_PROPERTY_NAMES = new String[] { "category0", "category1", "category2", "category3" };
	public static final String CATEGORY_PAGE_TEMPLATE = "dhl/components/pages/articlecategory";
	public static final String DHL_COMPONENT_PATH = "dhl/components/pages/";
	public static final String APPLICATION_JSON = "application/json";
	public static final String COOKIE_PARAM_NAME = "user_info_cookie";
	public static final String FORMID_PARAM_NAME = "formId";
	public static final String MARKETO_COOKIE_NAME = "_mkto_trk";
	public static final String USER_AGENT_HEADER = "user-agent";
	public static final String CONTENT_TYPE = "Content-type";
	public static final String DESTINATION_CONCATENATION = "{0}{1}";
	public static final String LEAD_CLIENT_IP_ADDRESS = "leadClientIpAddress";
	public static final String QUERY_STRING = "queryString";
	public static final String USER_AGENT_STRING = "userAgentString";
	public static final String PAGE_URL = "pageURL";
	public static final String DISCOVER_CONTEXT = "/discover";

	private static final Map<String,String> articlesQueryMap;

	private DiscoverConstants() {
		throw new IllegalStateException("Not meant to be instantiated");
	}

	public static List<String> getCategoriesPropertyNames(){
		List<String> categoryPropertyNamesList = Arrays.asList(CATEGORIES_PROPERTY_NAMES);
		return Collections.unmodifiableList(categoryPropertyNamesList);
	}

	/**
	 * Returns the category types available in the app
	 * @return a {@link List} of {@code String}s, each element in the list represents one category type
	 */
	public static List<String> getCategoryTypes(){

		return List.of("editable-article","article", "articlegated", "articlewithtrending", "animatedpage201901", "animatedpage20190225", "animatedpage20190523", "animatedpage20190624", "animatedpage20190724", "animatedpage20190805", "animatedpage20191021", "animatedpage20191025", "animatedpage20191101", "animatedpage20191122");
	}
	public static Map<String,String> getArticlesQueryMap(){
		return articlesQueryMap;
	}

	static {
		Map<String,String> map = new HashMap<>();
		map.put("type", NameConstants.NT_PAGE);
		map.put("property", JcrConstants.JCR_CONTENT + "/" + JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY);
		map.put("property.and","false");

		List<String> articleTypes = DiscoverConstants.getCategoryTypes();
		var counter = 1;
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
