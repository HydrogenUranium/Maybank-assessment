package com.positive.dhl.core.shipnow.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.apache.sling.api.SlingHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.helpers.DatabaseHelpers;
import com.positive.dhl.core.helpers.ValidationHelper;
import com.positive.dhl.core.shipnow.models.ValidatedRequestEntry;
import com.positive.dhl.core.shipnow.models.ValidationType;

public class NewsletterSignupService {
	private static final Logger log = LoggerFactory.getLogger(NewsletterSignupService.class);

	/**
	 *
	 */
	public static ValidatedRequestEntry PrepareFromRequest(SlingHttpServletRequest request) {
		ValidatedRequestEntry entry = new ValidatedRequestEntry();
		entry.AddRequiredField("home", request, ValidationType.NotEmpty);
		entry.AddRequiredField("email", request, ValidationType.Email);
		
		return entry;
	}

	/**
	 *
	 */
	public static Boolean Register(DataSourcePool dataSourcePool, ValidatedRequestEntry entry) {
		boolean output = false;

		try {
			DataSource dataSource = (DataSource)dataSourcePool.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);

			try (Connection connection = dataSource.getConnection()) {
				try (PreparedStatement statement = connection.prepareStatement("INSERT INTO `newsletter_subscribers` (`path`, `email`) VALUES (?, ?)")) {
					statement.setString(1, entry.get("home").toString());
					statement.setString(2, entry.get("email").toString());
					statement.executeUpdate();
				}
			}
			output = true;
			
		} catch (DataSourceNotFoundException | SQLException ex) {
			log.error("An error occurred attempting Register", ex);
		}
		
		return output;
	}
}