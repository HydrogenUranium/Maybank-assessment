package com.positive.dhl.core.services;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
import com.day.commons.datasource.poolservice.DataSourcePool;
import com.day.commons.datasource.poolservice.TypeNotAvailableException;
import com.positive.dhl.core.helpers.DatabaseHelpers;
import com.positive.dhl.core.models.Countries;
import com.positive.dhl.core.shipnow.models.ValidatedRequestEntry;
import com.positive.dhl.core.shipnow.models.ValidationType;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import static com.positive.dhl.core.constants.DiscoverConstants.DISCOVER_COUNTRIES_LOCATION;

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


	private static final String UPDATE_EXISTING_RECORD_QUERY = "UPDATE `shipnow_registrations` set `path` = ?, " +
			"`firstname` = ?, `lastname` = ?, `email` = ?, `company` = ?, `phone` = ?, `address` = ?, " +
			"`postcode` = ?, `city` = ?, `country` = ?, `countrycode` = ?, `currency` = ?, `source` " +
			"= ?, `lo` = ?, `synced` = 0 where `id` = ?";

	private static final String INSERT_NEW_RECORD_QUERY = "INSERT INTO `shipnow_registrations` " +
			"(`path`, `firstname`, `lastname`, `email`, `company`, `phone`, `address`, `postcode`, `city`, `country`," +
			" `countrycode`, `currency`, `source`, `lo`, `datecreated`, `synced`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), 0)";

	/**
	 *
	 */
	public ValidatedRequestEntry prepareFromRequest(SlingHttpServletRequest request) {

		ValidatedRequestEntry entry = new ValidatedRequestEntry();
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
		ResourceResolver resourceResolver = request.getResourceResolver();
		Resource countriesResource = resourceResolver.getResource(DISCOVER_COUNTRIES_LOCATION + "/" + countryCode);
		if(null != countriesResource){
			Countries countries = countriesResource.adaptTo(Countries.class);
			if(null != countries && null != countryCode && null != phone){
				return countries.getDialingCode(countryCode) + phone;
			}
		}
		return null;
	}


	/**
	 * Returns the value associated with servlet's request parameter identified by name.
	 * @param parameterName is a String representing the parameter name
	 * @param request is an instance of {@link SlingHttpServletRequest} that contains all in the provided input parameters
	 * @return a String representation of the value, if the parameter does not exist in the {@code SlingHttpServletRequest}, it returns {@code null}. If you need other
	 * object than String, you need to transform the value yourself
	 */
	private String getParameterValue(String parameterName, SlingHttpServletRequest request){
		RequestParameter requestParameter = request.getRequestParameter(parameterName);
		if(null != requestParameter){
			return requestParameter.getString();
		}
		return null;
	}


	
	/**
	 *
	 */
	public boolean register(DataSourcePool dataSourcePool, ValidatedRequestEntry entry) {
		boolean output = false;
		
		try {
			DataSource dataSource = dataSourcePool.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME,DataSource.class);
			
			int existingRecordId = findByEmail(dataSource, entry.get(EMAIL).toString());
			try (Connection connection = dataSource.getConnection()) {
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

			statement.setString(13, entry.get(SOURCE).toString());
			statement.setString(14, entry.get("lo").toString());
			return statement;
	}
	
	/**
	 *
	 */
	private int findByEmail(DataSource dataSource, String email) {
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
			LOGGER.error("An error occurred attempting findByEmail", ex);
		}
		return output;
	}
}