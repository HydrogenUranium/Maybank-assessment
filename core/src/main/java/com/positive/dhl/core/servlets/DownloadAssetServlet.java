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

/**
 *
 */
@Component(
	service = Servlet.class, 
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Download Asset Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
		"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/download_asset/index.json"
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
		var responseBody = "";
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");
		
		String assetinfo = request.getParameter("assetinfo");
		if (assetinfo != null && assetinfo.length() > 0) {

			var base64 = new Base64(true);
			byte[] decodedBytes = base64.decode(assetinfo.getBytes());

			responseBody = "{ \"status\": \"ok\", \"href\": \"" + new String(decodedBytes) + "\" }";
			
		} else {
			responseBody = "{ \"status\": \"ko\" }";
		}

		response.getWriter().write(responseBody);
	}
}