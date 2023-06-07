package com.positive.dhl.core.services;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
import com.day.commons.datasource.poolservice.DataSourcePool;
import com.day.commons.datasource.poolservice.TypeNotAvailableException;
import com.positive.dhl.core.components.EnvironmentConfiguration;
import com.positive.dhl.core.constants.ValidationType;
import com.positive.dhl.core.helpers.DatabaseHelpers;
import com.positive.dhl.core.helpers.ValidatedRequestEntry;
import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


/**
 * OSGi service that contains methods to help with the data validation of form input
 */

@Component(
		service = ShipNowService.class
)
public class ShipNowService {
	private static final Logger LOGGER = LoggerFactory.getLogger(ShipNowService.class);

	private static final String EMAIL = "email";
	private static final String FIRSTNAME = "firstname";
	private static final String LASTNAME = "lastname";
	private static final String COMPANY = "company";
	private static final String PHONE = "phone";
	private static final String ADDRESS = "address";
	private static final String POSTCODE = "postcode";
	private static final String COUNTRY = "country";
	private static final String SOURCE = "source";
	private static final String DIALING_CODE = "dialing_code";
	private static final String HOME = "home";

	@Reference
	private EnvironmentConfiguration environmentConfiguration;

	private static final String UPDATE_EXISTING_RECORD_QUERY = "UPDATE `shipnow_registrations` set `path` = ?, " +
			"`firstname` = ?, `lastname` = ?, `email` = ?, `company` = ?, `phone` = ?, `address` = ?, " +
			"`postcode` = ?, `city` = ?, `country` = ?, `countrycode` = ?, `currency` = ?, `source` " +
			"= ?, `lo` = ?, `synced` = 0 where `id` = ?";

	private static final String INSERT_NEW_RECORD_QUERY = "INSERT INTO `shipnow_registrations` " +
			"(`path`, `firstname`, `lastname`, `email`, `company`, `phone`, `address`, `postcode`, `city`, `country`," +
			" `countrycode`, `currency`, `source`, `lo`, `datecreated`, `synced`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), 0)";

	/**
	 * Provides  the {@link ValidatedRequestEntry} object populated with information which fields are mandatory and optional including their validation rules
	 * @param request is an instance of {@link SlingHttpServletRequest} that contains all the input params and their values
	 * @return a fully formed instance of {@code ValidatedRequestEntry}
	 */
	public ValidatedRequestEntry prepareFromRequest(SlingHttpServletRequest request) {

		var entry = new ValidatedRequestEntry();
		entry.addRequiredField(HOME, getParameterValue(HOME,request), ValidationType.NOT_EMPTY);
		entry.addRequiredField(EMAIL, getParameterValue(EMAIL,request), ValidationType.EMAIL);
		entry.addRequiredField(FIRSTNAME, getParameterValue(FIRSTNAME,request),ValidationType.NOT_EMPTY);
		entry.addRequiredField(LASTNAME, getParameterValue(LASTNAME,request),ValidationType.NOT_EMPTY);
		entry.addRequiredField(COMPANY, getParameterValue(COMPANY,request),ValidationType.NOT_EMPTY);
		entry.addRequiredField(PHONE, getPhoneWithExtension(request), ValidationType.PHONE);
		entry.addRequiredField(ADDRESS, getParameterValue(ADDRESS,request),ValidationType.NOT_EMPTY);
		entry.addRequiredField(POSTCODE, getParameterValue(POSTCODE,request),ValidationType.NOT_EMPTY);
		entry.addRequiredField("city", getParameterValue("city",request),ValidationType.NOT_EMPTY);
		entry.addRequiredField(COUNTRY, getParameterValue(COUNTRY,request),ValidationType.NOT_EMPTY);
		entry.addOptionalField(SOURCE, getParameterValue(SOURCE,request));
		entry.addOptionalField("lo", request);

		return entry;
	}

	private String getPhoneWithExtension(SlingHttpServletRequest request){
		String countryCode = getParameterValue(DIALING_CODE,request);
		String phone = getParameterValue(PHONE,request);


		if(countryCode == null && null != phone){
			LOGGER.warn("International country dialing code is missing...defaulting to 'phone' without country code");
			return phone;
		}

		return "+" + countryCode + phone;

	}


	/**
	 * Returns the value associated with servlet's request parameter identified by name.
	 * @param parameterName is a String representing the parameter name
	 * @param request is an instance of {@link SlingHttpServletRequest} that contains all in the provided input parameters

	 * @return a String representation of the value, if the parameter does not exist in the {@code SlingHttpServletRequest},
	 * it returns {@code null}. If you need other

	 * object than String, you need to transform the value yourself
	 */
	private String getParameterValue(String parameterName, SlingHttpServletRequest request){
		var requestParameter = request.getRequestParameter(parameterName);
		if(null != requestParameter){
			return requestParameter.getString();
		}
		return null;
	}



	/**
	 * Saves the 'entry' into the database
	 * @param dataSourcePool is an instance of {@link DataSourcePool} provided as OSGi service
	 * @param entry is an instance of {@link ValidatedRequestEntry}
	 * @return boolean {@code true} if save was successful or {@code false} if not
	 */
	public boolean register(DataSourcePool dataSourcePool, ValidatedRequestEntry entry) {
		var output = false;


		try {
			DataSource dataSource = dataSourcePool.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME,DataSource.class);

			int existingRecordId = findByEmail(dataSource, entry.get(EMAIL).toString());
			try (var connection = dataSource.getConnection()) {
				if (existingRecordId != 0) {
					try (PreparedStatement statement = connection.prepareStatement(UPDATE_EXISTING_RECORD_QUERY);
					     PreparedStatement updatedStatement = prepareStatement(entry, statement)) {

						updatedStatement.setInt(15, existingRecordId);
						updatedStatement.executeUpdate();
					}

				} else {
					try (
							PreparedStatement statement = connection.prepareStatement(INSERT_NEW_RECORD_QUERY);
							PreparedStatement updatedStatement  = prepareStatement(entry, statement)) {
						updatedStatement.executeUpdate();
					}
				}
				output = true;
			}
		} catch (DataSourceNotFoundException | TypeNotAvailableException| SQLException ex) {
			LOGGER.error("An error occurred attempting to register", ex);
		}

		return output;
	}

	private PreparedStatement prepareStatement(ValidatedRequestEntry entry, PreparedStatement statement) throws SQLException {
			String phoneNumber;
			if(entry.containsKey(DIALING_CODE)){
				phoneNumber = entry.get(DIALING_CODE) + (String) entry.get(PHONE);
			} else {
				phoneNumber = entry.get(PHONE).toString();
			}

			statement.setString(1, entry.get("home").toString());
			statement.setString(2, entry.get(FIRSTNAME).toString());
			statement.setString(3, entry.get(LASTNAME).toString());
			statement.setString(4, entry.get(EMAIL).toString());

			statement.setString(5, entry.get(COMPANY).toString());
			statement.setString(6, phoneNumber);
			statement.setString(7, entry.get(ADDRESS).toString());
			statement.setString(8, entry.get(POSTCODE).toString());
			statement.setString(9, entry.get("city").toString());

			String[] countryData = entry.get(COUNTRY).toString().split("\\|");
			statement.setString(10, ((countryData.length >= 1) ? countryData[0] : ""));
			statement.setString(11, ((countryData.length >= 2) ? countryData[1] : ""));
			statement.setString(12, ((countryData.length >= 3) ? countryData[2] : ""));

			String source = entry.containsKey(SOURCE) ? entry.get(SOURCE).toString() : "Discover";
			statement.setString(13, source);
			String lo = entry.containsKey("lo") ? entry.get("lo").toString() : "Discover";
			statement.setString(14,lo);

			return statement;
	}

	/**
	 *
	 */
	private int findByEmail(DataSource dataSource, String email) {
		var output = 0;

		try {
			try (var connection = dataSource.getConnection()) {
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
			LOGGER.error("An error occurred attempting findByEmail", ex);
		}
		return output;
	}
}
