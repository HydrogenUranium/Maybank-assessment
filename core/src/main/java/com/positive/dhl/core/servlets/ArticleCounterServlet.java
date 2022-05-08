package com.positive.dhl.core.servlets;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
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

import com.positive.dhl.core.models.SessionHelper;

/**
 * 
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Counter Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
		"sling.servlet.paths=" + "/apps/dhl/discoverdhlapi/counter/index.json"
	}
)
public class ArticleCounterServlet extends SlingAllMethodsServlet {
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
	public void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		String responseBody = "";
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");
		
		String path = request.getParameter("p");
		
		Map<String, Object> param = new HashMap<String, Object>();
		param.put(ResourceResolverFactory.SUBSERVICE, SessionHelper.DATAWRITE_SERVICENAME);
		try (ResourceResolver resolver = resourceResolverFactory.getServiceResourceResolver(param)) {
			Session session = resolver.adaptTo(Session.class);
			
			if (session != null) {
				Node node = session.getNode(path + "/jcr:content");
				if (node != null) {
					long c = 0;
					if (node.hasProperty("counter")) {
						c = node.getProperty("counter").getLong();
					}
					node.setProperty("counter", c + 1);
				}
	
				session.save();
				session.logout();
				
				responseBody = "{ \"status\": \"ok\" }";
				
			} else {
				responseBody = "{ \"status\": \"ko\", \"error\": \"Session is null\" }";
			}
			
		} catch (RepositoryException | LoginException ex) {
			responseBody = "{ \"status\": \"ko\" \"error\": \"" + ex.getMessage() + "\" }";
			
		}

		response.getWriter().write(responseBody);	
	}
}