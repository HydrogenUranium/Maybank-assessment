package com.positive.dhl.core.servlets;

import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.helpers.ValidatedRequestEntry;
import com.positive.dhl.core.services.NewsletterSignupService;

/**
 * 
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Newsletter Signup Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
		"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/newsletter/index.json"
	}
)
public class NewsletterSignupServlet extends StandardFormInputServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 *
	 */
    @Reference
    private transient DataSourcePool dataSourcePool;

	/**
	 *
	 */
	@Override
	protected ValidatedRequestEntry getValidatedRequestEntry(SlingHttpServletRequest request) {
		return NewsletterSignupService.prepareFromRequest(request);
	}

	/**
	 *
	 */
	@Override
	protected Boolean saveResponse(ValidatedRequestEntry entry) {
		return NewsletterSignupService.register(dataSourcePool, entry);
	}

	/**
	 *
	 */
	@Override
	protected void addAdditionalHeaders(SlingHttpServletRequest request, SlingHttpServletResponse response) {
		// special AMP page parameter
		String ampParam = request.getParameter("__amp_source_origin");
		if ((ampParam == null) || (ampParam.trim().length() <= 0)) {
			ampParam = request.getScheme() + "://" + request.getServerName();
		}
		response.addHeader("AMP-Access-Control-Allow-Source-Origin", ampParam);
	}
}