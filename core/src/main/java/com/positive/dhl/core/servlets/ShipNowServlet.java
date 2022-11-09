package com.positive.dhl.core.servlets;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.components.DotmailerComponent;
import com.positive.dhl.core.helpers.ValidatedRequestEntry;
import com.positive.dhl.core.services.ShipNowService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.servlets.HttpConstants;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import java.io.IOException;

/**
 * Servlet to serve the ShipNow forms
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Ship Now Servlet",
    	"sling.servlet.methods=" + HttpConstants.METHOD_POST,
			"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/shipnow/index.json"

	}
)
public class ShipNowServlet extends StandardFormInputServlet {
	private static final Logger log = LoggerFactory.getLogger(ShipNowServlet.class);
	
	private static final long serialVersionUID = 1L;
  @Reference
  private transient DataSourcePool dataSourcePool;
	@Reference
	private transient DotmailerComponent dotmailerComponent;
	@Reference
	private transient ShipNowService shipNowService;
	@Override
	protected ValidatedRequestEntry getValidatedRequestEntry(SlingHttpServletRequest request) {
		return shipNowService.prepareFromRequest(request);
	}

	@Override
	protected Boolean saveResponse(ValidatedRequestEntry entry) {
		return shipNowService.register(dataSourcePool, entry);
	}

	@Override
	protected void performActionAfterSave(ValidatedRequestEntry entry) {
		try {
			dotmailerComponent.ExecuteShipNowWelcome(entry.get("firstname").toString(), entry.get("email").toString());

		} catch (IOException ex) {
			log.error("Exception occurred calling dot-mailer service", ex);
		}
	}
}