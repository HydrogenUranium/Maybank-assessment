package com.positive.dhl.core.servlets;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.sql.DataSource;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
import com.positive.dhl.core.exceptions.DiscoverUserExistsException;
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

import com.positive.dhl.core.components.MailerComponent;
import com.positive.dhl.core.models.Registration;
import com.positive.dhl.core.models.UserAccount;
import com.positive.dhl.core.helpers.DatabaseHelpers;
import com.positive.dhl.core.helpers.ValidationHelper;

import static org.apache.sling.api.servlets.ServletResolverConstants.*;

/**
 *
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL register Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
		SLING_SERVLET_RESOURCE_TYPES + "=cq:Page",
		SLING_SERVLET_SELECTORS + "=register",
		SLING_SERVLET_EXTENSIONS + "=json"
	}
)
public class RegisterServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(RegisterServlet.class);
	
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
	private transient MailerComponent mailerComponent;

    /**
	 * 
	 */
	public void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		String responseBody = "";
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");
		
		try {
			if (this.source != null) {
				DataSource dataSource = (DataSource)this.source.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);
				if (dataSource != null) {
					boolean valid = true;
					String username = request.getParameter("username");
					if (username == null || username.trim().length() == 0 || (!ValidationHelper.isEmailAddressValid(username))) {
						valid = false;
						responseBody = "{ \"status\": \"ko\", \"error\": \"Email address not supplied\" }";
					} else {
						//check valid email
						try (Connection connection = dataSource.getConnection()) {
							if (UserAccount.accountExists(connection, username)) {
								valid = false;
								responseBody = "{ \"status\": \"ko\", \"error\": \"Email address already exists\" }";
							}
						}
					}

					String password = request.getParameter("password");
					/*
					if (password == null || password.trim().length() == 0) {
						valid = false;
						responseBody = "{ \"status\": \"ko\", \"error\": \"Password not supplied\" }";
					}
					*/

					String firstname = request.getParameter("firstname");
					if (firstname == null || firstname.trim().length() == 0) {
						valid = false;
						responseBody = "{ \"status\": \"ko\", \"error\": \"Firstname not supplied\" }";
					}

					String lastname = request.getParameter("lastname");
					if (lastname == null || lastname.trim().length() == 0) {
						valid = false;
						responseBody = "{ \"status\": \"ko\", \"error\": \"Lastname not supplied\" }";
					}

					String position = request.getParameter("position");
					String contact = request.getParameter("contact");
					String size = request.getParameter("size");
					String sector = request.getParameter("sector");
					String islinkedin = request.getParameter("islinkedin");
					boolean tcagree = ("true").equals(request.getParameter("tcagree"));

					if (valid) {
						boolean noPassword = ((password == null) || (password.trim().length() == 0));

						Registration registration = new Registration();
						registration.setEmail(username);
						registration.setPassword(noPassword ? "" : password);
						registration.setFirstname(firstname);
						registration.setLastname(lastname);
						registration.setPosition(position);
						registration.setContactNumber(contact);
						registration.setBusinessSize(size);
						registration.setBusinessSector(sector);
						registration.setIslinkedin(noPassword || islinkedin.equals("true"));
						registration.setTcAgree(tcagree);

						UserAccount user = null;
						try (Connection connection = dataSource.getConnection()) {
							user = UserAccount.Register(connection, registration);
						}

						if (user != null && user.isAuthenticated()) {
							JsonObject responseJson = new JsonObject();
							responseJson.addProperty("status", "ok");
							responseJson.addProperty("username", user.getUsername());
							responseJson.addProperty("name", user.getName());
							responseJson.addProperty("token", user.getToken());
							responseJson.addProperty("refresh_token", user.getRefreshToken());
							responseJson.addProperty("ttl", user.getTimeToLive());
							responseBody = responseJson.toString();

							mailerComponent.ExecuteWelcome(firstname, username);

						} else {
							responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while attempting to register\" }";
						}
					}
		        	
				} else {
					responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while attempting to register\" }";
				}
			} else {
				responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while attempting to register\" }";
			}

		} catch (SQLException | NoSuchAlgorithmException | DiscoverUserExistsException | DiscoverUserNotFoundException | DataSourceNotFoundException ex) {
			log.error("Error occurred while producing result JSON", ex);
			responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while attempting to register\" }";
		}

		response.getWriter().write(responseBody);
	}
}