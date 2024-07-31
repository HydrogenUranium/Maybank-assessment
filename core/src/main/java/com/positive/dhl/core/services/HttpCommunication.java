/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.positive.dhl.core.dto.general.HttpApiResponse;
import com.positive.dhl.core.exceptions.HttpRequestException;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

public interface HttpCommunication {

	/**
	 * Sends a http POST message to URL and returns a {@code String} representing the response provided by the URL
	 *
	 * @param url         is a String representing the server where we want to send the message
	 * @param authToken   is a String representing the authorization token (if provided as {@code null}, it is omitted from the request)
	 * @param postBody    is the PUT request body we're going to send
	 * @param queryParams is a {@code List} of {@link NameValuePair}s that contains the query param name & value
	 * @param client      is an instance of {@link CloseableHttpClient} that is leveraged to send teh actual http request
	 * @return a String representing the response provided by the server
	 * @throws HttpRequestException is thrown in case we detect any issue with either sending the request or if the status
	 *                              returned by the server does not match success (200) or created (201)
	 */
	<T> String sendPostMessage(String url, String authToken, T postBody, List<NameValuePair> queryParams, CloseableHttpClient client) throws HttpRequestException;

	/**
	 * Very basic implementation of HTTP POST request that offers neither token-based-authentication, nor query parameters. If you need to use
	 * any of those parameters, then {@link HttpCommunication#sendPostMessage(String, String, Object, List, CloseableHttpClient)} can be better used
	 *
	 * @param url      is a String representing the server where we want to send the post message
	 * @param postBody is the POST request body we're going to send
	 * @param client   is an instance of {@link CloseableHttpClient} that is leveraged to send the actual http request
	 * @return a new instance of {@link HttpApiResponse} object that contains both returned data and status code
	 * @throws HttpRequestException is thrown in case we detect any issue with either sending the request or if the status
	 *                              *                              returned by the server does not match success (200) or created (201)
	 */
	<T> HttpApiResponse sendPostMessage(String url, T postBody, CloseableHttpClient client) throws HttpRequestException;

	/**
	 * Sends a GET message and returns the @{code String} representing the response provided by the 'url'
	 *
	 * @param url       is a String representing the server where we want to send the message
	 * @param authToken is a String representing teh authorization token
	 * @return String representing the response provided by the server
	 * @throws HttpRequestException is thrown in case we detect issue with either request transmission or if status is different
	 *                                 than 200
	 */
	String sendGetMessage(String url, String authToken) throws HttpRequestException;

	/**
	 * Extracts the response text from the provided {@link CloseableHttpResponse}, if successful. If not, returns
	 * an exception
	 * @param response is an instance of {@code CloseableHttpResponse} that represents what the backend has returned
	 * @return a String representing the text provided by the backend
	 * @throws IOException is thrown in case there was a communication error with the backend
	 * @throws HttpRequestException is thrown in case response code from backend did not indicate success
	 */
	String getRequestResponse(CloseableHttpResponse response) throws IOException, HttpRequestException;

	/**
	 * Provides indication if provided string can be used as http backend (but it does not check whether such backend exists or works)
	 * @param url is a String representing the url we want to check
	 * @return boolean {@code true} if provided String is indeed valid URL or {@code false} if not
	 */
	boolean isValidUrl(String url);

	boolean isValidAuthToken(String token);

	/**
	 * Builds a list of query parameters whose members are to be added to the request
	 * @param clientId is a clientId, one of the values Marketo needs to authenticate the request
	 * @param secret is a secret, one of the values Marketo needs to authenticate the request
	 * @return a {@link List} of {@link NameValuePair}s, each item in the list represents one pair
	 * of query parameter & its value
	 */
	List<NameValuePair> getQueryParams(String clientId, String secret);

	/**
	 * Adds a post body to HTTP POST message (identified by {@link HttpPost} object).
	 * @param httpPost is an instance of {@code HttpPost} that we add the body to
	 * @param postBody is a generic object representing the post request body
	 * @throws JsonProcessingException is thrown in case we're unable to transform the 'post body' object to json string
	 * @throws UnsupportedEncodingException is thrown in case encoding is incorrect
	 */
	<T> void addPostBody(HttpPost httpPost, T postBody) throws JsonProcessingException, UnsupportedEncodingException;

	/**
	 * Adds query parameters to provide {@link URIBuilder} instance
	 * @param uriBuilder is an instance of {@link URIBuilder} we want to enhance
	 * @param queryParams is a {@link List} of {@link NameValuePair} we use to build the query params
	 * @return enhanced instance of {@code URIBuilder}
	 */
	URIBuilder addQueryParams(URIBuilder uriBuilder, List<NameValuePair> queryParams);
}
