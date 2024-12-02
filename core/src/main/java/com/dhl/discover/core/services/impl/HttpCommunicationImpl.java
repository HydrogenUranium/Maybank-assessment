package com.dhl.discover.core.services.impl;

import com.dhl.discover.core.constants.DiscoverConstants;
import com.dhl.discover.core.exceptions.HttpRequestException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.dhl.discover.core.dto.general.HttpApiResponse;
import com.dhl.discover.core.services.HttpCommunication;
import com.dhl.discover.core.services.InitUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component(
		service = HttpCommunication.class
)
public class HttpCommunicationImpl implements HttpCommunication {

	@Reference
	InitUtil initUtil;

	@Override
	public <T> String sendPostMessage(String url, String authToken, T postBody, List<NameValuePair> queryParams, CloseableHttpClient client) throws HttpRequestException {
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
				if (isValidAuthToken(authToken)) {
					String formattedAuthToken = String.format("Bearer %s", sanitizeAuthToken(authToken));
					httpPost.addHeader("Authorization", formattedAuthToken);
				}

				httpPost.setURI(uri.build());

				// send request and return processed response
				try (CloseableHttpResponse response = initUtil.getHttpClient().execute(httpPost)) {
					return getRequestResponse(response);
				}

			} catch (IOException | URISyntaxException ioException) {
				String errorMessage = MessageFormat.format("Problem has occurred when trying to send POST request to {0}, details: {1}", url, ioException.getMessage());
				throw new HttpRequestException(errorMessage, ioException.getCause());
			}
		}
		String errorMessage = MessageFormat.format("Provided string {0} does not appear to represent a valid URL.", url);
		throw new HttpRequestException(errorMessage);
	}

	@Override
	public <T> HttpApiResponse sendPostMessage(String url, T postBody, CloseableHttpClient client) throws HttpRequestException {
		if(isValidUrl(url)){

			try {
				log.info("Post body: {}", postBody);
				var httpPost = new HttpPost(url);
				var uri = new URIBuilder(httpPost.getURI());

				// add post body (if not null)
				addPostBody(httpPost,postBody);

				httpPost.setURI(uri.build());

				addContentTypeHeaders(httpPost);

				// send request and return processed response
				try (CloseableHttpResponse response = client.execute(httpPost)) {
					if(null != response){
						int statusCode = response.getStatusLine().getStatusCode();
						return HttpApiResponse.builder()
								.httpStatus(statusCode)
								.jsonResponse(getRequestResponse(response))
								.build();
					}
					initUtil.resetClient();
					throw new IOException("Backend response can't be extracted. Something went wrong.");

				}

			} catch (IOException | URISyntaxException ioException) {
				String errorMessage = MessageFormat.format("Problem has occurred when trying to send POST request to {0}, details: {1}", url, ioException.getMessage());
				throw new HttpRequestException(errorMessage, ioException.getCause());
			}
		}
		String errorMessage = MessageFormat.format("Provided string {0} does not appear to represent a valid URL.", url);
		throw new HttpRequestException(errorMessage);
	}

	private void addContentTypeHeaders(HttpPost httpPost){
		httpPost.setHeader(HttpHeaders.CONTENT_TYPE, ContentType.APPLICATION_JSON.getMimeType());
	}

	@Override
	public String sendGetMessage(String url, String authToken) throws HttpRequestException {
		try {
			var httpGet = new HttpGet(url);
			var uri = new URIBuilder(httpGet.getURI());
			httpGet.setURI(uri.build());
			httpGet.setHeader(DiscoverConstants.CONTENT_TYPE, DiscoverConstants.APPLICATION_JSON);

			if (isValidAuthToken(authToken)) {
				String formattedAuthToken = String.format("Bearer %s", sanitizeAuthToken(authToken));
				httpGet.addHeader("Authorization", formattedAuthToken);
			}

			try (CloseableHttpResponse response = initUtil.getHttpClient().execute(httpGet)) {
				return getRequestResponse(response);
			}

		} catch (IOException | URISyntaxException e) {
			throw new HttpRequestException(e);
		}
	}

	@Override
	public String getRequestResponse(CloseableHttpResponse response) throws IOException, HttpRequestException {
		if (response == null) {
			initUtil.resetClient();
			throw new IOException("Backend response can't be extracted. Something went wrong.");
		}

		var httpEntity = response.getEntity();
		int statusCode = response.getStatusLine().getStatusCode();
		String statusMessage = response.getStatusLine().getReasonPhrase();

		try {
			if (statusCode == HttpStatus.SC_OK || statusCode == HttpStatus.SC_CREATED || statusCode == HttpStatus.SC_ACCEPTED) {
				var responseString = EntityUtils.toString(httpEntity);
				responseString = sanitizeResponse(responseString);
				EntityUtils.consumeQuietly(httpEntity);
				return responseString;
			}

			if (statusCode == HttpStatus.SC_BAD_REQUEST) {
				var responseString = EntityUtils.toString(httpEntity);
				responseString = sanitizeResponse(responseString);
				EntityUtils.consumeQuietly(httpEntity);
				return responseString;
			}
		} finally {
			EntityUtils.consumeQuietly(httpEntity);
		}

		String errorMessage = MessageFormat.format(
				"Backend returned status code ''{0}'' with error message ''{1}''",
				statusCode, statusMessage
		);
		throw new HttpRequestException(errorMessage);
	}

	@Override
	public boolean isValidUrl(String url) {
		try {
			var underTest = new URL(url);
			if(log.isDebugEnabled()){
				log.debug("Provided string appears to represent a valid URL ({})",underTest);
			}
			return true;
		} catch (MalformedURLException e) {
			log.error("Provided string {} does not appear to represent a valid URL: {}", url, e.getMessage());
			return false;
		}
	}

	@Override
	public boolean isValidAuthToken(String authToken) {
		return authToken != null && authToken.matches("^[A-Za-z0-9-_\\.:]+$");
	}

	@Override
	public List<NameValuePair> getQueryParams(String clientId, String secret) {
		List<NameValuePair> queryParams = new ArrayList<>();
		queryParams.add(new BasicNameValuePair("client_id", clientId));
		queryParams.add(new BasicNameValuePair("client_secret", secret));
		queryParams.add(new BasicNameValuePair("grant_type", "client_credentials"));
		return queryParams;
	}

	@Override
	public <T> void addPostBody(HttpPost httpPost, T postBody) throws JsonProcessingException, UnsupportedEncodingException {
		if(null != postBody){
			var requestPostEntity = getStringEntity(postBody);
			httpPost.setEntity(requestPostEntity);
		}
	}

	private <T> StringEntity getStringEntity(T postBody) throws JsonProcessingException {
		var bodyString = initUtil.getObjectMapper().writeValueAsString(postBody);
		return new StringEntity(bodyString, ContentType.APPLICATION_JSON);
	}

	@Override
	public URIBuilder addQueryParams(URIBuilder uriBuilder, List<NameValuePair> queryParams) {
		if(null != queryParams){
			for (NameValuePair nameValuePair : queryParams){
				uriBuilder.addParameter(nameValuePair.getName(), nameValuePair.getValue());
			}
		}
		return uriBuilder;
	}
	String sanitizeResponse(String input) {
		if (input == null) {
			return null;
		}
		return StringEscapeUtils.escapeHtml4(input);
	}

	String sanitizeAuthToken(String authToken) {
		if (authToken == null) {
			return "";
		}
		// Removes CRLF characters
		return authToken.replaceAll("[\r\n]", "").trim();
	}
}
