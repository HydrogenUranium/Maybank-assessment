package com.positive.dhl.core.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.Servlet;
import javax.sql.DataSource;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
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

import static org.apache.sling.api.servlets.ServletResolverConstants.*;

/**
 * 
 */
@Component(
	service = Servlet.class,
	property = {
		Constants.SERVICE_DESCRIPTION + "=DHL Request Password Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,
		SLING_SERVLET_RESOURCE_TYPES + "=cq:Page",
		SLING_SERVLET_SELECTORS + "=requestpassword",
		SLING_SERVLET_EXTENSIONS + "=json"
	}
)
public class RequestPasswordServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(RequestPasswordServlet.class);
	
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

		String page = request.getParameter("page");
		String username = request.getParameter("username");
		if (username != null && username.length() > 0) {
			try {
				if (this.source != null) {
					DataSource dataSource = (DataSource)this.source.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);
					if (dataSource != null) {
						boolean result = false;
			        	try (Connection connection = dataSource.getConnection()) {
							result = UserAccount.requestPassword(connection, dotmailerComponent, page, username);
						}
						
						if (result) {
							responseBody = "{ \"status\": \"ok\" }";

						} else {
							responseBody = "{ \"status\": \"ko\", \"error\": \"Username not found\" }";
						}
					}
				}
				
			} catch (SQLException | DataSourceNotFoundException ex) {
				log.error("Error occurred while producing result JSON", ex);
				responseBody = "{ \"status\": \"ko\", \"error\": \"Error occurred while producing result JSON: '" + ex.getMessage() + "'\" }";
				response.getWriter().write(responseBody);
				return;
			}
			
		} else {
			responseBody = "{ \"status\": \"ko\", \"error\": \"Username not supplied\" }";
		}

		response.getWriter().write(responseBody);
	}
}