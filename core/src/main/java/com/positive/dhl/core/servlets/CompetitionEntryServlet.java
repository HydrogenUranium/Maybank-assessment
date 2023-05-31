package com.positive.dhl.core.servlets;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.helpers.ValidatedRequestEntry;
import com.positive.dhl.core.services.CompetitionService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.servlets.HttpConstants;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;

import static org.apache.sling.api.servlets.ServletResolverConstants.*;

/**
 * 
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Competition Entry Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
			SLING_SERVLET_RESOURCE_TYPES + "=cq:Page",
			SLING_SERVLET_EXTENSIONS + "=json",
			SLING_SERVLET_SELECTORS + "=competition"
	}
)
public class CompetitionEntryServlet extends StandardFormInputServlet {
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
		return CompetitionService.prepareFromRequest(request);
	}

	/**
	 *
	 */
	@Override
	protected Boolean saveResponse(ValidatedRequestEntry entry) {
		return CompetitionService.register(dataSourcePool, entry);
	}
}