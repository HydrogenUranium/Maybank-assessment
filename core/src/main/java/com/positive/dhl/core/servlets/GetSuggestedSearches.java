package com.positive.dhl.core.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.positive.dhl.core.models.SessionHelper;

/**
 * 
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Search Suggestions Servlet",
    	"sling.servlet.methods=" + HttpConstants.METHOD_GET,
    	"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/searchsuggest/index.json"
	}
)
public class GetSuggestedSearches extends SlingAllMethodsServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

    /**
	 * 
	 */
	@Reference
	private transient ResourceResolverFactory resourceResolverFactory;

	/**
	 * 
	 */
	public void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		String responseBody = "";
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");

		Map<String, Object> param = new HashMap<String, Object>();
		param.put(ResourceResolverFactory.SUBSERVICE, SessionHelper.DATAWRITE_SERVICENAME);
		try (ResourceResolver resolver = resourceResolverFactory.getServiceResourceResolver(param)) {
			TagManager tagManager = resolver.adaptTo(TagManager.class);

			List<String> tagList = new ArrayList<String>();
	        if (tagManager != null) {
		        Tag dhl = tagManager.resolve("dhlsuggested:");
		        if (null != dhl) {
		            Iterator<Tag> tags = dhl.listChildren();
		            while (tags.hasNext()) {
		                Tag tag = tags.next();
		                tagList.add(tag.getTitle());
		            }
		            tagList.sort(String::compareTo);
		            
					JsonObject responseJson = new JsonObject();
					responseJson.addProperty("status", "ok");
					
					JsonArray results = new JsonArray();
					for (int i = 0; i < tagList.size(); i++) {
						if (i >= 5) {
							break;
						}
						results.add(new JsonPrimitive(tagList.get(i)));
					}
					responseJson.add("results", results);
					
					responseBody = responseJson.toString();
					
		        } else {
					responseBody = "{ \"results\": [], \"status\": \"ko\", \"error\": \"No tag group found\" }";
		        }

	        } else {
	        	responseBody = "{ \"results\": [], \"status\": \"ko\", \"error\": \"TagManager is null\" }";
	        }

		} catch (LoginException ex) {
			responseBody = "{ \"status\": \"ko\" \"error\": \"" + ex.getMessage() + "\" }";
		}

		response.getWriter().write(responseBody);
	}
}