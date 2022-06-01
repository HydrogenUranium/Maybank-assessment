package com.positive.dhl.core.shipnow.servlets;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.shipnow.models.ValidatedRequestEntry;
import com.positive.dhl.core.shipnow.services.CompetitionService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.servlets.HttpConstants;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;

/**
 * 
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Competition Entry Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
		"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/competition/index.json"
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
		return CompetitionService.PrepareFromRequest(request);
	}

	/**
	 *
	 */
	@Override
	protected Boolean saveResponse(ValidatedRequestEntry entry) {
		return CompetitionService.Register(dataSourcePool, entry);
	}
}