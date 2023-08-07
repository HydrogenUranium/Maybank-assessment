package com.positive.dhl.core.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.positive.dhl.core.dto.marketo.FormInputData;
import com.positive.dhl.core.exceptions.HttpRequestException;
import com.positive.dhl.core.services.InitUtil;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.http.*;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HttpCommunicationImplTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCEPROVIDER_MOCK);

	@Mock
	InitUtil initUtil;

	@Mock
	FormInputData formInputData;

	@Mock
	CloseableHttpClient client;

	@Mock
	CloseableHttpResponse closeableHttpResponse;

	@Mock
	ObjectMapper objectMapper;

	@Mock
	HttpEntity httpEntity;

	@Mock
	StatusLine statusLine;

	HttpCommunicationImpl underTest;

	@BeforeEach
	void setUp() {
		Map<String,Object> injectedServices = new HashMap<>();
		injectedServices.putIfAbsent("initUtil", initUtil);

		context.registerService(InitUtil.class, initUtil);
		underTest = new HttpCommunicationImpl();

		context.registerInjectActivateService(underTest, injectedServices);
	}


	@ParameterizedTest
	@ValueSource(strings = {"invalid-url-string", "https://valid-url.dhl.com"})
	void invalidUrl(String url){
		boolean isUrlValid = underTest.isValidUrl(url);
		if (url.contains("invalid")){
			assertFalse(isUrlValid);
		} else {
			assertTrue(isUrlValid);
		}
	}

	@ParameterizedTest
	@NullSource
	@ValueSource(strings = {"authorization-token", ""})
	void postWithAuthToken(String authTokenInput) throws HttpRequestException, IOException {
		ArgumentCaptor<HttpPost> postArgumentCaptor = ArgumentCaptor.forClass(HttpPost.class);
		String postRequestBody = "aka json";

		String url = "https://valid-backend-url.dhl.com";
		List<NameValuePair> queryParams = new ArrayList<>();
		queryParams.add(new BasicNameValuePair("client_id", "dummyValue"));

		when(initUtil.getObjectMapper()).thenReturn(objectMapper);
		when(initUtil.getHttpClient()).thenReturn(client);
		when(objectMapper.writeValueAsString(any())).thenReturn(postRequestBody);
		when(client.execute(any(HttpPost.class))).thenReturn(closeableHttpResponse);
		when(closeableHttpResponse.getEntity()).thenReturn(httpEntity);
		when(closeableHttpResponse.getStatusLine()).thenReturn(statusLine);
		when(statusLine.getStatusCode()).thenReturn(200);
		when(statusLine.getReasonPhrase()).thenReturn("dummy-reason-phrase");

		underTest.sendPostMessage(url,authTokenInput,formInputData,queryParams,client);
		verify(client).execute(postArgumentCaptor.capture());
		verify(client,times(1)).execute(any(HttpPost.class));
		HttpPost actual = postArgumentCaptor.getValue();

		// post request body validation
		HttpEntity postEntity = actual.getEntity();
		String postBody = new String(postEntity.getContent().readAllBytes(), StandardCharsets.UTF_8);
		assertEquals(postBody, postRequestBody);

		// post request query params validation
		String requestQueryParameters = actual.getURI().getQuery();
		assertEquals("client_id=dummyValue", requestQueryParameters);

		// http headers validation
		if(null == authTokenInput){
			assertFalse(checkHeaderValue(actual.getAllHeaders(), HttpHeaders.AUTHORIZATION, "Bearer authorization-token"));
		} else if(authTokenInput.isBlank()){
			assertFalse(checkHeaderValue(actual.getAllHeaders(), HttpHeaders.AUTHORIZATION, "Bearer authorization-token"));
		} else {
			assertTrue(checkHeaderValue(actual.getAllHeaders(), HttpHeaders.AUTHORIZATION, "Bearer authorization-token"));
		}
		assertTrue(checkContentType(actual.getAllHeaders(), ContentType.APPLICATION_JSON.getMimeType()));
	}

	@Test
	void postException() throws IOException {
		String postRequestBody = "aka json";

		String url = "https://valid-backend-url.dhl.com";
		List<NameValuePair> queryParams = new ArrayList<>();
		queryParams.add(new BasicNameValuePair("client_id", "dummyValue"));

		when(initUtil.getObjectMapper()).thenReturn(objectMapper);
		when(initUtil.getHttpClient()).thenReturn(client);
		when(objectMapper.writeValueAsString(any())).thenReturn(postRequestBody);
		when(client.execute(any(HttpPost.class))).thenThrow(new IOException("dummy io exception"));
		assertThrows(HttpRequestException.class, () -> underTest.sendPostMessage(url,"authTokenInput",formInputData,queryParams,client));
	}

	@Test
	void postWithoutToken() throws HttpRequestException, IOException {
		ArgumentCaptor<HttpPost> postArgumentCaptor = ArgumentCaptor.forClass(HttpPost.class);
		String postRequestBody = "aka json";

		String url = "https://valid-backend-url.dhl.com";

		when(initUtil.getObjectMapper()).thenReturn(objectMapper);
		when(objectMapper.writeValueAsString(any())).thenReturn(postRequestBody);
		when(client.execute(any(HttpPost.class))).thenReturn(closeableHttpResponse);
		when(closeableHttpResponse.getEntity()).thenReturn(httpEntity);
		when(closeableHttpResponse.getStatusLine()).thenReturn(statusLine);
		when(statusLine.getStatusCode()).thenReturn(200);
		when(statusLine.getReasonPhrase()).thenReturn("dummy-reason-phrase");

		underTest.sendPostMessage(url,formInputData, client);
		verify(client).execute(postArgumentCaptor.capture());
		verify(client,times(1)).execute(any(HttpPost.class));
		HttpPost actual = postArgumentCaptor.getValue();

		// post request body validation
		HttpEntity postEntity = actual.getEntity();
		String postBody = new String(postEntity.getContent().readAllBytes(), StandardCharsets.UTF_8);
		assertEquals(postBody, postRequestBody);

		// request headers validation
		assertTrue(checkContentType(actual.getAllHeaders(), ContentType.APPLICATION_JSON.getMimeType()));
	}

	@Test
	void testGetRequestResponseException() {
		assertThrows(IOException.class, () -> underTest.getRequestResponse(null));
		verify(initUtil,times(1)).resetClient();
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = {"authorization-token", ""})
	void getRequest(String authTokenInput) throws HttpRequestException, IOException {
		ArgumentCaptor<HttpGet> httpGetArgumentCaptor = ArgumentCaptor.forClass(HttpGet.class);

		String url = "https://valid-backend-url.dhl.com";

		when(initUtil.getHttpClient()).thenReturn(client);
		when(client.execute(any(HttpGet.class))).thenReturn(closeableHttpResponse);
		when(closeableHttpResponse.getEntity()).thenReturn(httpEntity);
		when(closeableHttpResponse.getStatusLine()).thenReturn(statusLine);
		when(statusLine.getStatusCode()).thenReturn(200);
		when(statusLine.getReasonPhrase()).thenReturn("dummy-reason-phrase");

		underTest.sendGetMessage(url,authTokenInput);
		verify(client).execute(httpGetArgumentCaptor.capture());
		verify(client,times(1)).execute(any(HttpGet.class));
		HttpGet actual = httpGetArgumentCaptor.getValue();

		// http headers validation
		if(null == authTokenInput){
			assertFalse(checkHeaderValue(actual.getAllHeaders(), HttpHeaders.AUTHORIZATION, "Bearer authorization-token" ));
		} else if(authTokenInput.isBlank()){
			assertFalse(checkHeaderValue(actual.getAllHeaders(), HttpHeaders.AUTHORIZATION, "Bearer authorization-token"));
		} else {
			assertTrue(checkHeaderValue(actual.getAllHeaders(), HttpHeaders.AUTHORIZATION, "Bearer authorization-token"));
		}
		assertTrue(checkContentType(actual.getAllHeaders(), ContentType.APPLICATION_JSON.getMimeType()));
	}



	/**
	 * Validates HTTP Header value provided as array of {@link Header} objects. Validation is case-insensitive
	 * @param headers is an array of {@code Header}s
	 * @param headerName is the name of the header whose value we want to validate
	 * @param expectedValue is the String representing the expected value
	 * @return boolean {@code true} if the expected value matches the value in the actual header or {@code false} if not
	 */
	private boolean checkHeaderValue(Header[] headers, String headerName, String expectedValue){
		for (Header header : headers){
			if(header.getName().equalsIgnoreCase(headerName) && header.getValue().equalsIgnoreCase(expectedValue)){
				return true;
			}
		}
		return false;
	}

	/**
	 * Validates the ContentType ({@link HttpHeaders#CONTENT_TYPE}) header's value that it matches the expected one
	 * @param headers is an array of {@link Header} objects where we look for the header's value
	 * @param expectedValue is a String representing the value we want to validate
	 * @return boolean {@code true} if the expected value matches the value in the actual header or {@code false} if not
	 */
	private boolean checkContentType(Header[] headers, String expectedValue){
		return checkHeaderValue(headers, HttpHeaders.CONTENT_TYPE, expectedValue);
	}
}
