package com.positive.dhl.core.servlets;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
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
		Constants.SERVICE_DESCRIPTION + "=DHL Update Details Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
		"sling.servlet.paths=" + "/apps/dhl/discoverdhlapi/update_details/index.json"
	}
)
public class UpdateDetailsServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(UpdateDetailsServlet.class);
	
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
	public void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		String responseBody = "";
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");

		boolean valid = true;
		UserAccount user = null;
		String username = request.getParameter("username");
		String token = request.getParameter("token");

		try {
			if (this.source != null) {
				DataSource dataSource = (DataSource)this.source.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);
				if (dataSource != null) {
					String newusername = request.getParameter("newusername");
					if (newusername != null && (newusername.trim().length() > 0) && (!username.equals(newusername))) {
						try (Connection connection = dataSource.getConnection()) {
							boolean userExists = UserAccount.AccountExists(connection, newusername);
							if (userExists) {
								responseBody = "{ \"status\": \"ko\", \"error\": \"A user already exists with the specified new email address.\" }";
								response.getWriter().write(responseBody);
								return;
							}
						}
						
					} else {
						newusername = username;
					}
					
					String firstname = request.getParameter("firstname");
					if (firstname == null || firstname.trim().length() == 0) {
						responseBody = "{ \"status\": \"ko\", \"error\": \"Firstname not supplied\" }";
						response.getWriter().write(responseBody);
						return;
					}
					
					String lastname = request.getParameter("lastname");
					if (lastname == null || lastname.trim().length() == 0) {
						responseBody = "{ \"status\": \"ko\", \"error\": \"Lastname not supplied\" }";
						response.getWriter().write(responseBody);
						return;
					}

					String password = request.getParameter("password");
					String newpassword = request.getParameter("newpassword");
					try (Connection connection = dataSource.getConnection()) {
						Registration allDetails = UserAccount.GetAllDetails(connection, username);

						if (newpassword != null && newpassword.trim().length() > 0) {
							if (password != null && password.trim().length() > 0) {
								if (!UserAccount.CheckPassword(allDetails.getPassword(), allDetails.getSalt(), password.trim())) {
									responseBody = "{ \"status\": \"ko\", \"error\": \"Password incorrect\" }";
									response.getWriter().write(responseBody);
									return;
								}

							} else {
								if ((!allDetails.isIslinkedin()) && allDetails.isFullAccount()) {
									responseBody = "{ \"status\": \"ko\", \"error\": \"Password not supplied\" }";
									response.getWriter().write(responseBody);
									return;
								}
							}
						} else {
							if (!allDetails.isFullAccount()) {
								responseBody = "{ \"status\": \"ko\", \"error\": \"Password not supplied\" }";
								response.getWriter().write(responseBody);
								return;
							}
						}
					}
					
					String position = request.getParameter("position");
					String contact = request.getParameter("contact");
					String size = request.getParameter("size");
					String sector = request.getParameter("sector");
					String interest_categories = request.getParameter("cats");
					boolean tcagree = ("true").equals(request.getParameter("tcagree"));

					//check token last to prevent logouts... "Token validate" generates new tokens every time...
					if (username == null || username.trim().length() == 0) {
						valid = false;
						responseBody = "{ \"status\": \"ko\", \"error\": \"Username not supplied\" }";
						
					} else {
						try (Connection connection = dataSource.getConnection()) {
							user = UserAccount.TokenValidate(connection, username, token);
						}
						
						if (user == null || !user.isAuthenticated()) {
							valid = false;
							responseBody = "{ \"status\": \"ko\", \"error\": \"Not allowed\" }";
						}
					}
					
					if (valid) {
						Registration registration = new Registration();
						registration.setEmail(username);
						registration.setNewemail(newusername);
						
						if (newpassword != null && newpassword.trim().length() > 0) {
							registration.setNewpassword(newpassword);
						}
						
						registration.setFirstname(firstname);
						registration.setLastname(lastname);
						registration.setPosition(position);
						registration.setContactNumber(contact);
						registration.setBusinessSize(size);
						registration.setBusinessSector(sector);
						
						registration.setInterest_categories(interest_categories);
						
						registration.setTcAgree(tcagree);
						
						boolean result = false;
						try (Connection connection = dataSource.getConnection()) {
							result = UserAccount.UpdateDetails(connection, registration);
						}

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
				} else {
					responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while attempting to register\" }";
				}
			} else {
				responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while attempting to register\" }";
			}

		} catch (SQLException | NoSuchAlgorithmException | DataSourceNotFoundException | DiscoverUserNotFoundException ex) {
			log.error("Error occurred while producing result JSON", ex);
			responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while attempting to register\" }";
		}

		response.getWriter().write(responseBody);
	}
}