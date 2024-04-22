package com.positive.dhl.core.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.positive.dhl.core.config.MarketoSubmissionConfigReader;
import com.positive.dhl.core.constants.DiscoverConstants;
import com.positive.dhl.core.dto.marketo.AuthenticationResponse;
import com.positive.dhl.core.dto.marketo.FormInputBase;
import com.positive.dhl.core.dto.marketo.FormSubmissionResponse;
import com.positive.dhl.core.dto.marketo.MarketoConnectionData;
import com.positive.dhl.core.dto.marketo.formdescription.FormDescriptionResponse;
import com.positive.dhl.core.dto.marketo.formfields.FormFieldsResponse;
import com.positive.dhl.core.exceptions.HttpRequestException;
import com.positive.dhl.core.services.HttpCommunication;
import com.positive.dhl.core.services.MarketoCommunication;
import com.positive.dhl.core.services.InitUtil;
import org.apache.http.NameValuePair;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

@Component(
		service = MarketoCommunication.class
)
public class MarketoCommunicationImpl implements MarketoCommunication {

	private static final Logger LOGGER = LoggerFactory.getLogger(MarketoCommunicationImpl.class);

	@Reference
	private MarketoSubmissionConfigReader marketoSubmissionConfigReader;

	@Reference
	private HttpCommunication httpCommunication;

	@Reference
	private InitUtil initUtil;

	@Override
	public String requestNewToken() {
		try {
			var marketoConnectionData = getMarketoConnectionData();
			if(null != marketoConnectionData){
				return requestNewToken(marketoConnectionData);
			}
		} catch (HttpRequestException e) {
			LOGGER.error("Unable to get Marketo authentication token, details (if available): {}", e.getMessage());
		}
			return null;
	}

	@Override
	public List<String> getAvailableFormFieldNames(String authToken) {
			var marketoConnectionData = getMarketoConnectionData();
			if(null != marketoConnectionData && null != authToken && !authToken.isBlank()){
				try {
					String hostname = marketoConnectionData.getUrl();
					String destination = MessageFormat.format(DiscoverConstants.DESTINATION_CONCATENATION, hostname, marketoConnectionData.getFormDescriptionAPIPath());
					String jsonResponse = httpCommunication.sendGetMessage(destination,authToken);
					FormDescriptionResponse formDescriptionResponse = initUtil.getObjectMapper().readValue(jsonResponse, FormDescriptionResponse.class);
					return formDescriptionResponse.getResult().get(0).getAvailableFormFields();
				} catch (HttpRequestException | JsonProcessingException e) {
					LOGGER.error("Unable to get available fields from Marketo backend. Form field names lookup is likely to be unsuccessful and Marketo form" +
							"submissions may be rejected due to invalid field name: {}", e.getMessage());
				}
			}
			LOGGER.warn("Unable to get the available form field names.");
		return new ArrayList<>();
	}

	@Override
	public List<String> getFormFields(String authToken, int formId) {
		var marketoConnectionData = getMarketoConnectionData();
		if(null != marketoConnectionData && null != authToken){
			try {
				String hostname = marketoConnectionData.getUrl();
				String path = MessageFormat.format(marketoConnectionData.getFormFieldsAPIPath(),Integer.toString(formId));
				String destination = MessageFormat.format(DiscoverConstants.DESTINATION_CONCATENATION, hostname, path);
				String jsonResponse = httpCommunication.sendGetMessage(destination,authToken);
				if (!jsonResponse.contains("result")) {
					LOGGER.error("The Marketo hidden form submission was failed (Possible reason - invalid Hidden ID)");
				}
				FormFieldsResponse formFieldsResponse = initUtil.getObjectMapper().readValue(jsonResponse,FormFieldsResponse.class);
				return formFieldsResponse.getFormFields();
			} catch (HttpRequestException | JsonProcessingException e) {
				LOGGER.error("Unable to get available form fields. Form field lookup is not going to be successful and Marketo may reject the form as it " +
						"might contain incompatible fields");
			}
		}
		LOGGER.warn("Unable to get fields present in form with ID {}", formId);
		return new ArrayList<>();
	}

	@Override
	public String requestNewToken(MarketoConnectionData marketoConnectionData) throws HttpRequestException {
		String clientId = marketoConnectionData.getClientId();
		String secretId = marketoConnectionData.getSecretId();
		String hostname = marketoConnectionData.getUrl();

		if(null != hostname && null != clientId && null != secretId){
			String destination = MessageFormat.format("{0}{1}", hostname, marketoConnectionData.getAuthAPIPath());
			List<NameValuePair> queryParams = getQueryParams(clientId, secretId);
			try {
				CloseableHttpClient client = initUtil.getHttpClient();
				String jsonResponse = httpCommunication.sendPostMessage(destination, "", null, queryParams, client);
				AuthenticationResponse authenticationResponse = initUtil.getObjectMapper().readValue(jsonResponse, AuthenticationResponse.class);
				if(null != authenticationResponse){
					return authenticationResponse.getAccessToken();
				}
			} catch (HttpRequestException e) {
				LOGGER.error("Form submission error has occurred. Unable to get authentication token from Marketo backend. Details (if available): {}", e.getMessage());
			} catch (JsonProcessingException e) {
				LOGGER.error("Unable to parse the message received from authentication backend ({}). Underlying error was: {}",hostname, e.getMessage());
			}
		}
		throw new HttpRequestException("Unsuccessful request to get the Marketo token - unable to get Marketo communication information (such as hostname / clientId / secretId)");
	}

	@Override
	public FormSubmissionResponse submitForm(FormInputBase form, String authenticationToken) {
		var marketoConnectionData = getMarketoConnectionData();
		if(null != marketoConnectionData){
			String hostname = marketoConnectionData.getUrl();
			String apiPath = marketoConnectionData.getFormSubmissionAPIPath();
			String destination = MessageFormat.format("{0}{1}", hostname, apiPath);
			try {
				CloseableHttpClient client = initUtil.getHttpClient();
				String jsonResponse = httpCommunication.sendPostMessage(destination,authenticationToken, form, null, client);
				return initUtil.getObjectMapper().readValue(jsonResponse, FormSubmissionResponse.class);
			} catch (HttpRequestException | JsonProcessingException e) {
				String errorMessage = MessageFormat.format("Error has occurred, details: {0}", e.getMessage());
				LOGGER.error(errorMessage);
			}
		}
		return FormSubmissionResponse.builder()
				.dhlErrorMessage("Unable to get connection details - most likely environmental configuration problem.")
				.build();
	}


	/**
	 * Collects various configuration parameters from the OSGi configuration and provides them as {@link MarketoConnectionData} object
	 * @return fully formed {@code MarketoConnectionData} object that contains information required for successful Marketo communication
	 */
	private MarketoConnectionData getMarketoConnectionData(){
		String hostname = marketoSubmissionConfigReader.getMarketoHost();
		String clientId = marketoSubmissionConfigReader.getMarketoClientId();
		String secretId = marketoSubmissionConfigReader.getMarketoClientSecret();
		String formSubmissionAPIPath = marketoSubmissionConfigReader.getMarketoFormSubmissionAPIEndpoint();
		String authAPIPath = marketoSubmissionConfigReader.getMarketoAuthenticationAPIEndpoint();
		String formDescriptionAPIPath = marketoSubmissionConfigReader.getMarketoFormDescriptionAPIEndpoint();
		String formFieldsAPIPath = marketoSubmissionConfigReader.getMarketoFormFieldsAPIEndpoint();
		if(null != hostname && null != clientId && null != secretId && formSubmissionAPIPath != null && authAPIPath != null){
			return MarketoConnectionData.builder()
					.clientId(clientId)
					.secretId(secretId)
					.url(hostname)
					.formSubmissionAPIPath(formSubmissionAPIPath)
					.authAPIPath(authAPIPath)
					.formDescriptionAPIPath(formDescriptionAPIPath)
					.formFieldsAPIPath(formFieldsAPIPath)
					.build();
		}
		return null;
	}

	/**
	 * Builds a list of query parameters whose members are to be added to the request
	 * @param clientId is a clientId, one of the values Marketo needs to authenticate the request
	 * @param secret is a secret, one of the values Marketo needs to authenticate the request
	 * @return a {@link List} of {@link NameValuePair}s, each item in the list represents one pair
	 * of query parameter & its value
	 */
	private List<NameValuePair> getQueryParams(String clientId, String secret){
		List<NameValuePair> queryParams = new ArrayList<>();
		queryParams.add(new BasicNameValuePair("client_id", clientId));
		queryParams.add(new BasicNameValuePair("client_secret", secret));
		queryParams.add(new BasicNameValuePair("grant_type", "client_credentials"));
		return queryParams;
	}
}
