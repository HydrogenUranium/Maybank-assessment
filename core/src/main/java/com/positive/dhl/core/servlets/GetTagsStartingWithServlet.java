package com.positive.dhl.core.servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.TagUtilService;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Tags Servlet",
    	"sling.servlet.methods=" + HttpConstants.METHOD_GET,
    	"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/tags/index.json"
	}
)
public class GetTagsStartingWithServlet extends SlingAllMethodsServlet {

	@Reference
	private PageUtilService pageUtilService;

	@Reference
	private TagUtilService tagUtilService;

	@Override
	public void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");

		String body = processRequest(request);

		response.getWriter().write(body);
	}

	private String processRequest(SlingHttpServletRequest request) {
		String startsWith = request.getParameter("s");
		String homePagePath = request.getParameter("homepagepath");

		if (StringUtils.isBlank(startsWith)) {
			return "{ \"results\": [], \"status\": \"ko\", \"error\": \"Invalid parameter\" }";
		}

		startsWith = startsWith.trim().toLowerCase();

		try (var resolver = request.getResourceResolver()) {
			var locale = pageUtilService.getLocale(resolver.getResource(homePagePath));
			List<String> tagList = tagUtilService
					.getTagsByLocalizedPrefix(resolver, startsWith, "dhl:", locale)
					.stream().map(tag -> tag.getTitle(locale))
					.sorted(String::compareTo)
					.collect(Collectors.toList());

			var responseJson = new JsonObject();
			responseJson.addProperty("status", "ok");
			responseJson.addProperty("term", startsWith);

			var results = new JsonArray();
			for (String s : tagList) {
				results.add(new JsonPrimitive(s));
			}
			responseJson.add("results", results);

			return responseJson.toString();
		}
	}
}