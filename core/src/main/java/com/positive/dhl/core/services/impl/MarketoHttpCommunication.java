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
import com.positive.dhl.core.exceptions.MarketoRequestException;
import com.positive.dhl.core.services.HttpCommunication;
import com.positive.dhl.core.services.InitUtil;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

@Component(
		service = HttpCommunication.class
)
public class MarketoHttpCommunication implements HttpCommunication {

	private static final Logger LOGGER = LoggerFactory.getLogger(MarketoHttpCommunication.class);

	@Reference
	private MarketoSubmissionConfigReader marketoSubmissionConfigReader;

	@Reference
	private InitUtil initUtil;

	@Override
	public String requestNewToken() {
		try {
			var marketoConnectionData = getMarketoConnectionData();
			if(null != marketoConnectionData){
				return requestNewToken(marketoConnectionData);
			}
		} catch (MarketoRequestException e) {
			LOGGER.error("Unable to get Marketo authentication token, details (if available): {}", e.getMessage());
		}
			return null;
	}

	@Override
	public List<String> getAvailableFormFieldNames(String authToken) {
			var marketoConnectionData = getMarketoConnectionData();
			if(null != marketoConnectionData && null != authToken){
				try {
					String hostname = marketoConnectionData.getUrl();
					String destination = MessageFormat.format(DiscoverConstants.DESTINATION_CONCATENATION, hostname, marketoConnectionData.getFormDescriptionAPIPath());
					String jsonResponse = sendGetMessage(destination,authToken);
					FormDescriptionResponse formDescriptionResponse = initUtil.getObjectMapper().readValue(jsonResponse, FormDescriptionResponse.class);
					return formDescriptionResponse.getResult().get(0).getAvailableFormFields();
				} catch (MarketoRequestException | JsonProcessingException e) {
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
				String jsonResponse = sendGetMessage(destination,authToken);
				FormFieldsResponse formFieldsResponse = initUtil.getObjectMapper().readValue(jsonResponse,FormFieldsResponse.class);
				return formFieldsResponse.getFormFields();
			} catch (MarketoRequestException | JsonProcessingException e) {
				LOGGER.error("Unable to get available form fields. Form field lookup is not going to be successful and Marketo may reject the form as it " +
						"might contain incompatible fields");
			}
		}
		LOGGER.warn("Unable to get fields present in form with ID {}", formId);
		return new ArrayList<>();
	}

	@Override
	public String sendGetMessage(String url, String authToken) throws MarketoRequestException {
		try {
			var httpGet = new HttpGet(url);
			var uri = new URIBuilder(httpGet.getURI());
			httpGet.setURI(uri.build());
			httpGet.setHeader(DiscoverConstants.CONTENT_TYPE, DiscoverConstants.APPLICATION_JSON);

			if(null != authToken && !authToken.isEmpty()){
				httpGet.setHeader("Authorization", "Bearer " + authToken);
			}

			try (CloseableHttpResponse response = initUtil.getHttpClient().execute(httpGet)) {
				return getRequestResponse(response);
			}

		} catch (IOException | URISyntaxException e) {
			throw new MarketoRequestException(e);
		}
	}

	@Override
	public String requestNewToken(MarketoConnectionData marketoConnectionData) throws MarketoRequestException {
		String clientId = marketoConnectionData.getClientId();
		String secretId = marketoConnectionData.getSecretId();
		String hostname = marketoConnectionData.getUrl();
		String destination = MessageFormat.format("{0}{1}", hostname, marketoConnectionData.getAuthAPIPath());
		List<NameValuePair> queryParams = getQueryParams(clientId, secretId);
		try {
			String jsonResponse = sendPostMessage(destination, "", null, queryParams);
			AuthenticationResponse authenticationResponse = initUtil.getObjectMapper().readValue(jsonResponse, AuthenticationResponse.class);
			if(null != authenticationResponse){
				return authenticationResponse.getAccessToken();
			}
		} catch (MarketoRequestException e) {
			LOGGER.error("Form submission error has occurred. Unable to get authentication token from Marketo backend. Details (if available): {}", e.getMessage());
		} catch (JsonProcessingException e) {
			LOGGER.error("Unable to parse the message received from authentication backend ({}). Underlying error was: {}",hostname, e.getMessage());
		}
		throw new MarketoRequestException("Unsuccessful request to get the Marketo token - either " +
				"http communication broke down or we failed to parse the response from Marketo backend");
	}

	@Override
	public FormSubmissionResponse submitForm(FormInputBase form, String authenticationToken) {
		var marketoConnectionData = getMarketoConnectionData();
		if(null != marketoConnectionData){
			String hostname = marketoConnectionData.getUrl();
			String apiPath = marketoConnectionData.getFormSubmissionAPIPath();
			String destination = MessageFormat.format("{0}{1}", hostname, apiPath);
			try {
				String jsonResponse = sendPostMessage(destination,authenticationToken, form, null);
				return initUtil.getObjectMapper().readValue(jsonResponse, FormSubmissionResponse.class);
			} catch (MarketoRequestException | JsonProcessingException e) {
				String errorMessage = MessageFormat.format("Error has occurred, details: {0}", e.getMessage());
				LOGGER.error(errorMessage);
			}
		}
		return FormSubmissionResponse.builder()
				.dhlErrorMessage("Unable to get connection details - most likely environmental configuration problem.")
				.build();
	}

	private <T> void addPostBody(HttpPost httpPost, T postBody) throws JsonProcessingException, UnsupportedEncodingException {
		if(null != postBody){
			var bodyString = initUtil.getObjectMapper().writeValueAsString(postBody);
			var body = new StringEntity(bodyString);
			httpPost.setEntity(body);
			if(LOGGER.isDebugEnabled()){
				LOGGER.debug("Form submission json object: {}", bodyString);
			}
		}
	}

	private void addQueryParams(URIBuilder uriBuilder, List<NameValuePair> queryParams){
		if(null != queryParams){
			for (NameValuePair nameValuePair : queryParams){
				uriBuilder.addParameter(nameValuePair.getName(), nameValuePair.getValue());
			}
		}
	}

	@Override
	public <T> String sendPostMessage(String url, String authToken, T postBody, List<NameValuePair> queryParams) throws MarketoRequestException {
		if(isValidUrl(url)){
			try {
				var httpPost = new HttpPost(url);
				var uri = new URIBuilder(httpPost.getURI());

				// add post body (if not null)
				addPostBody(httpPost,postBody);

				// add query params (if not null)
				addQueryParams(uri,queryParams);

				// add content type & authorization header (if not null)
				httpPost.setHeader("Content-type", DiscoverConstants.APPLICATION_JSON);
				if(null != authToken && !authToken.isEmpty()){
					httpPost.setHeader("Authorization", "Bearer " + authToken);
				}

				httpPost.setURI(uri.build());

				// send request and return processed response
				try (CloseableHttpResponse response = initUtil.getHttpClient().execute(httpPost)) {
					return getRequestResponse(response);
				}

			} catch (IOException | URISyntaxException ioException) {
				String errorMessage = MessageFormat.format("Problem has occurred when trying to send POST request to {0}, details: {1}", url, ioException.getMessage());
				throw new MarketoRequestException(errorMessage, ioException.getCause());
			}
		}
		String errorMessage = MessageFormat.format("Provided string {0} does not appear to represent a valid URL.", url);
		throw new MarketoRequestException(errorMessage);
	}


	/**
	 * Extracts the response text from the provided {@link CloseableHttpResponse}, if successful. If not, returns
	 * an exception
	 * @param response is an instance of {@code CloseableHttpResponse} that represents what the backend has returned
	 * @return a String representing the text provided by the backend
	 * @throws IOException is thrown in case there was a communication error with the backend
	 * @throws MarketoRequestException is thrown in case response code from backend did not indicate success
	 */
	private String getRequestResponse(CloseableHttpResponse response) throws IOException, MarketoRequestException {
		if(null == response){
			initUtil.resetClient();
			throw new IOException("Akamai response can't be extracted. Something went wrong.");
		}

		var httpEntity = response.getEntity();
		int statusCode = response.getStatusLine().getStatusCode();
		String statusMessage = response.getStatusLine().getReasonPhrase();

		if (statusCode == HttpStatus.SC_OK || statusCode == HttpStatus.SC_CREATED || statusCode == HttpStatus.SC_ACCEPTED) {
			var responseString = EntityUtils.toString(httpEntity);
			EntityUtils.consumeQuietly(httpEntity);
			return responseString;
		}

		EntityUtils.consumeQuietly(httpEntity);

		String errorMessage = MessageFormat.format("Marketo returned status code {0} with error message {1}", statusMessage, statusCode);
		throw new MarketoRequestException(errorMessage);
	}

	/**
	 * Provides indication if provided string can be used as http backend (but it does not check whether such backend exists or works)
	 * @param url is a String representing the url we want to check
	 * @return boolean {@code true} if provided String is indeed valid URL or {@code false} if not
	 */
	private boolean isValidUrl(String url){
		try {
			var underTest = new URL(url);
			if(LOGGER.isDebugEnabled()){
			    LOGGER.debug("Provided string appears to represent a valid URL ({})",underTest);
			}
			return true;
		} catch (MalformedURLException e) {
			LOGGER.error("Provided string {} does not appear to represent a valid URL: {}", url, e.getMessage());
			return false;
		}
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
