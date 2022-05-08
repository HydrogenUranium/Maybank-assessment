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
import com.positive.dhl.core.models.UserAccount;

/**
 * 
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Update Categories Servlet",
    	"sling.servlet.methods=" + HttpConstants.METHOD_POST,
    	"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/update_categories/index.json"
	}
)
public class UpdateCategoriesServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(UpdateCategoriesServlet.class);
	
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
		
		boolean valid = true;
		UserAccount user = null;
		String username = request.getParameter("username");
		String token = request.getParameter("token");

		String categories = request.getParameter("cats");

		try {
			if (this.source != null) {
				DataSource dataSource = (DataSource)this.source.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);
				if (dataSource != null) {
					try (Connection connection = dataSource.getConnection()) {
						//check token last to prevent logouts... "Token validate" generates new tokens every time...
						if (username == null || username.trim().length() == 0) {
							valid = false;
							responseBody = "{ \"status\": \"ko\", \"error\": \"Username not supplied\" }";

						} else {
							try {
								user = UserAccount.TokenValidate(connection, username, token);

							} catch (SQLException ex) {
								log.error("Error occurred while processing auth token", ex);
								responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while processing auth token: '" + ex.getMessage() + "'\" }";
								response.getWriter().write(responseBody);
								return;
							}

							if (!user.isAuthenticated()) {
								valid = false;
								responseBody = "{ \"status\": \"ko\", \"error\": \"Not allowed\" }";
							}
						}

						if (valid) {
							boolean result = UserAccount.UpdateCategories(connection, username, categories);
							connection.close();

							if (result) {
								JsonObject responseJson = new JsonObject();
								responseJson.addProperty("status", "ok");
								responseJson.addProperty("username", user.getUsername());
								responseJson.addProperty("name", user.getName());
								responseJson.addProperty("token", user.getToken());
								responseJson.addProperty("refresh_token", user.getRefreshToken());
								responseJson.addProperty("ttl", user.getTtl());
								responseBody = responseJson.toString();

							} else {
								responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while attempting to update details\" }";
							}
						}
					}
				}
			}

		} catch (DiscoverUserNotFoundException | DataSourceNotFoundException | SQLException ex) {
			log.error("Error occurred while producing result JSON", ex);
			responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while attempting to register\" }";
		}

		response.getWriter().write(responseBody);
	}
}