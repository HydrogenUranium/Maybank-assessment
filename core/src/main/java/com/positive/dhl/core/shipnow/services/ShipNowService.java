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

public class ShipNowService {
	private static final Logger log = LoggerFactory.getLogger(ShipNowService.class);
	
	/**
	 *
	 */
	public static ValidatedRequestEntry PrepareFromRequest(SlingHttpServletRequest request) {
		ValidatedRequestEntry entry = new ValidatedRequestEntry();
		entry.AddRequiredField("home", request, ValidationType.NotEmpty);
		entry.AddRequiredField("email", request, ValidationType.Email);
		entry.AddRequiredField("firstname", request);
		entry.AddRequiredField("lastname", request);
		entry.AddRequiredField("company", request);
		entry.AddRequiredField("phone", request);
		entry.AddRequiredField("address", request);
		entry.AddRequiredField("postcode", request);
		entry.AddRequiredField("city", request);
		entry.AddRequiredField("country", request);
		entry.AddOptionalField("source", request);
		entry.AddOptionalField("lo", request);
		
		return entry;
	}
	
	/**
	 *
	 */
	public static Boolean Register(DataSourcePool dataSourcePool, ValidatedRequestEntry entry) {
		boolean output = false;
		
		try {
			DataSource dataSource = (DataSource)dataSourcePool.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);
			
			int existingRecordId = findByEmail(dataSource, entry.get("email").toString());
			try (Connection connection = dataSource.getConnection()) {
				if (existingRecordId != 0) {
					try (PreparedStatement statement = connection.prepareStatement("UPDATE `shipnow_registrations` set `path` = ?, `firstname` = ?, `lastname` = ?, `email` = ?, `company` = ?, `phone` = ?, `address` = ?, `postcode` = ?, `city` = ?, `country` = ?, `countrycode` = ?, `currency` = ?, `source` = ?, `lo` = ?, `synced` = 0 where `id` = ?")) {
						statement.setString(1, entry.get("home").toString());
						statement.setString(2, entry.get("firstname").toString());
						statement.setString(3, entry.get("lastname").toString());
						statement.setString(4, entry.get("email").toString());

						statement.setString(5, entry.get("company").toString());
						statement.setString(6, entry.get("phone").toString());
						statement.setString(7, entry.get("address").toString());
						statement.setString(8, entry.get("postcode").toString());
						statement.setString(9, entry.get("city").toString());

						String[] countryData = entry.get("country").toString().split("\\|");
						statement.setString(10, ((countryData.length >= 1) ? countryData[0] : ""));
						statement.setString(11, ((countryData.length >= 2) ? countryData[1] : ""));
						statement.setString(12, ((countryData.length >= 3) ? countryData[2] : ""));

						statement.setString(13, entry.get("source").toString());
						statement.setString(14, entry.get("lo").toString());

						statement.setInt(15, existingRecordId);

						statement.executeUpdate();
					}

				} else {
					try (PreparedStatement statement = connection.prepareStatement("INSERT INTO `shipnow_registrations` (`path`, `firstname`, `lastname`, `email`, `company`, `phone`, `address`, `postcode`, `city`, `country`, `countrycode`, `currency`, `source`, `lo`, `datecreated`, `synced`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), 0)")) {
						statement.setString(1, entry.get("home").toString());
						statement.setString(2, entry.get("firstname").toString());
						statement.setString(3, entry.get("lastname").toString());
						statement.setString(4, entry.get("email").toString());

						statement.setString(5, entry.get("company").toString());
						statement.setString(6, entry.get("phone").toString());
						statement.setString(7, entry.get("address").toString());
						statement.setString(8, entry.get("postcode").toString());
						statement.setString(9, entry.get("city").toString());

						String[] countryData = entry.get("country").toString().split("\\|");
						statement.setString(10, ((countryData.length >= 1) ? countryData[0] : ""));
						statement.setString(11, ((countryData.length >= 2) ? countryData[1] : ""));
						statement.setString(12, ((countryData.length >= 3) ? countryData[2] : ""));

						statement.setString(13, entry.get("source").toString());
						statement.setString(14, entry.get("lo").toString());

						statement.executeUpdate();
					}
				}

				output = true;
				
			}
		} catch (DataSourceNotFoundException | SQLException ex) {
			log.error("An error occurred attempting Register", ex);
		}
		
		return output;
	}
	
	/**
	 *
	 */
	private static int findByEmail(DataSource dataSource, String email) {
		int output = 0;

		try {
			try (Connection connection = dataSource.getConnection()) {
				try (PreparedStatement statement = connection.prepareStatement("SELECT `id` from `shipnow_registrations` where `email` = ?")) {
					statement.setString(1, email);

					try (ResultSet results = statement.executeQuery()) {
						while (results.next()) {
							output = results.getInt("id");
						}
					}
				}
			}

		} catch (SQLException ex) {
			log.error("An error occurred attempting findByEmail", ex);
		}
		
		return output;
	}
}