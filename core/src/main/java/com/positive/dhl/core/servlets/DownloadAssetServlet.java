package com.positive.dhl.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;

import org.apache.commons.codec.binary.Base64;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;

import static org.apache.sling.api.servlets.ServletResolverConstants.*;

/**
 *
 */
@Component(
	service = Servlet.class, 
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Download Asset Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
		SLING_SERVLET_RESOURCE_TYPES + "=cq:Page",
		SLING_SERVLET_EXTENSIONS + "=json",
		SLING_SERVLET_SELECTORS + "=downloadasset"
	}
)
public class DownloadAssetServlet extends SlingAllMethodsServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 *
	 */
	public void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		String responseBody = "";
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");
		
		String assetinfo = request.getParameter("assetinfo");
		if (assetinfo != null && assetinfo.length() > 0) {

			Base64 base64 = new Base64(true);
			byte[] decodedBytes = base64.decode(assetinfo.getBytes());

			responseBody = "{ \"status\": \"ok\", \"href\": \"" + new String(decodedBytes) + "\" }";
			
		} else {
			responseBody = "{ \"status\": \"ko\" }";
		}

		response.getWriter().write(responseBody);
	}
}