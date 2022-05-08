package com.positive.dhl.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;

import com.positive.dhl.core.components.GeneralSiteComponentConfig;

/**
 * 
 */
@Component(
	service = Servlet.class, 
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Robots File Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_GET,
		"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/robots.txt"
	}
)
@Designate(ocd = GeneralSiteComponentConfig.class)
public class RobotsServlet extends SlingAllMethodsServlet {
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
	private transient GeneralSiteComponentConfig config;

	/**
	 *
	 */
	@Activate
	public void activate(GeneralSiteComponentConfig config) {
		this.config = config;
	}

    /**
	 * 
	 */
	public void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		response.setContentType("application/text");
		response.setCharacterEncoding("utf-8");

		String responseBody = "";
		if ((this.config != null) && (("true").equals(this.config.RobotsDisallowAll()))) {
			responseBody = "User-agent: *\r\n"
					+ "Disallow: /";
			
		} else {
			responseBody = "User-agent: *\r\n" + 
				"Allow: /\r\n" + 
				"Disallow: /search-results\r\n" + 
				"Disallow: /your-account\r\n" + 
				"Disallow: /login\r\n" + 
				"Disallow: /discover/search-results\r\n" + 
				"Disallow: /discover/your-account\r\n" + 
				"Disallow: /discover/login\r\n" + 
				"User-agent: ltx71 - (http://ltx71.com/)\r\n" +
				"Disallow: /\r\n" +
				"\r\n" + 
				"Sitemap: https://dhl.com/discover/sitemap.xml" +
				"Sitemap: https://a193399.sitemaphosting2.com/4263660/sitemap_video.xml\r\n" +
				"Sitemap: https://a193399.sitemaphosting2.com/4263660/sitemap_images.xml\r\n" +
				"Sitemap: https://a193399.sitemaphosting2.com/4263660/sitemap.xml\r\n";
		}
		
		response.getWriter().write(responseBody);
	}
}