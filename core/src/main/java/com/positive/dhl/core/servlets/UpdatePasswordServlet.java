package com.positive.dhl.core.servlets;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
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

import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.components.DotmailerComponent;
import com.positive.dhl.core.helpers.DatabaseHelpers;
import com.positive.dhl.core.models.UserAccount;

/**
 * 
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Reset Password Servlet",
    	"sling.servlet.methods=" + HttpConstants.METHOD_POST,
    	"sling.servlet.paths="+ "/apps/dhl/discoverdhlapi/reset_password/index.json"
	}
)
public class UpdatePasswordServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(UpdatePasswordServlet.class);
	
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
	@Reference
	private transient DotmailerComponent dotmailerComponent;

    /**
	 * 
	 */
	public void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		String responseBody = "";
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");

		String username = request.getParameter("username");
		String token = request.getParameter("token");
		String password = request.getParameter("password");
		if ((username != null && username.length() > 0) && (token != null && token.length() > 0) && (password != null && password.length() > 0)) {
			try {
				if (this.source != null) {
					DataSource dataSource = (DataSource)this.source.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);
					if (dataSource != null) {
			        	try (Connection connection = dataSource.getConnection()) {
							boolean result = UserAccount.ResetPassword(connection, dotmailerComponent, username, token, password);
							
							if (result) {
								responseBody = "{ \"status\": \"ok\" }";
								
							} else {
								responseBody = "{ \"status\": \"ko\", \"error\": \"Your password could not be reset. Please request a new password reset token.\" }";
							}
			        	}
					}
				}

			} catch (SQLException | DataSourceNotFoundException | NoSuchAlgorithmException ex) {
				log.error("Error occurred while producing result JSON", ex);
				responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while producing result JSON: '" + ex.getMessage() + "'\" }";
				response.getWriter().write(responseBody);
				return;

			}

		} else {
			responseBody = "{ \"status\": \"ko\", \"error\": \"Username, token and/or new password not supplied\" }";
		}

		response.getWriter().write(responseBody);
	}
}