package com.positive.dhl.core.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.Servlet;
import javax.sql.DataSource;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
import com.positive.dhl.core.exceptions.DiscoverUserNotFoundException;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.google.gson.JsonObject;

import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.positive.dhl.core.helpers.DatabaseHelpers;
import com.positive.dhl.core.models.Registration;
import com.positive.dhl.core.models.UserAccount;

/**
 * 
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Get Details Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
		"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/getdetails/index.json"
	}
)
public class GetDetailsServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(GetDetailsServlet.class);
	
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 *
	 */
    @Reference
    private transient DataSourcePool source;

    /**
	 * 
	 */
	public void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		String responseBody = "";
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");
		
		String username = request.getParameter("username");
		String token = request.getParameter("token");
		if ((username != null && username.length() > 0) && (token != null && token.length() > 0)) {
			try {
				if (this.source != null) {
					DataSource dataSource = (DataSource)this.source.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);
					if (dataSource != null) {
						UserAccount user;
			        	try (Connection connection = dataSource.getConnection()) {
							user = UserAccount.tokenValidate(connection, username, token);
						}

						if (user != null && user.isAuthenticated()) {
							try (Connection connection = dataSource.getConnection()) {
								Registration allDetails = UserAccount.getAllDetails(connection, user.getUsername());

								JsonObject responseJson = new JsonObject();
								responseJson.addProperty("status", "ok");
								responseJson.addProperty("username", user.getUsername());
								responseJson.addProperty("name", user.getName());
								responseJson.addProperty("token", user.getToken());
								responseJson.addProperty("refresh_token", user.getRefreshToken());
								responseJson.addProperty("ttl", user.getTimeToLive());
								responseJson.addProperty("full", user.getFullAccount());

								responseJson.addProperty("registration_firstname", allDetails.getFirstname());
								responseJson.addProperty("registration_lastname", allDetails.getLastname());
								responseJson.addProperty("registration_email", allDetails.getEmail());

								responseJson.addProperty("registration_position", allDetails.getPosition());
								responseJson.addProperty("registration_contact", allDetails.getContactNumber());
								responseJson.addProperty("registration_size", allDetails.getBusinessSize());
								responseJson.addProperty("registration_sector", allDetails.getBusinessSector());
								responseJson.addProperty("registration_cats", allDetails.getInterest_categories());

								responseJson.addProperty("registration_islinkedin", ((allDetails.isIslinkedin()) ? "true" : "false"));

								responseJson.addProperty("registration_tcagree", ((allDetails.isTcAgree()) ? "true" : "false"));

								responseBody = responseJson.toString();
							}

						} else {
							responseBody = "{ \"status\": \"ko\" }";
						}
					}
				}
				
			} catch (SQLException | DiscoverUserNotFoundException | DataSourceNotFoundException ex) {
				log.error("Error occurred while producing result JSON", ex);
				responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while producing result JSON: '" + ex.getMessage() + "'\" }";
				response.getWriter().write(responseBody);
				return;
			}
			
		} else {
			responseBody = "{ \"status\": \"ko\" }";
		}

		response.getWriter().write(responseBody);
	}
}