package com.dhl.discover.core.services.impl;

import com.dhl.discover.core.exceptions.HttpRequestException;
import com.dhl.discover.core.services.HttpCommunication;
import com.dhl.discover.core.services.InitUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.dhl.discover.core.config.MarketoSubmissionConfigReader;
import com.dhl.discover.core.dto.marketo.AuthenticationResponse;
import com.dhl.discover.core.dto.marketo.FormInputBase;
import com.dhl.discover.core.dto.marketo.FormSubmissionResponse;
import com.dhl.discover.core.dto.marketo.MarketoConnectionData;
import com.dhl.discover.core.dto.marketo.formdescription.FormDescriptionResponse;
import com.dhl.discover.core.dto.marketo.formdescription.Result;
import com.dhl.discover.core.dto.marketo.formfields.FormFieldsResponse;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class MarketoCommunicationImplTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

	@Mock
	private MarketoSubmissionConfigReader marketoSubmissionConfigReader;

	@Mock
	private InitUtil initUtil;

	@Mock
	CloseableHttpClient client;

	@Mock
	FormDescriptionResponse formDescriptionResponse;

	@Mock
	FormFieldsResponse formFieldsResponse;

	@Mock
	List<String> formFieldsList;

	@Mock
	List<Result> resultList;

	@Mock
    HttpCommunication httpCommunication;

	@Mock
	Result result;

	@Mock
	ObjectMapper objectMapper;

	MarketoCommunicationImpl underTest;

	@BeforeEach
	void setUp() {
		Map<String,Object> injectedServices = new HashMap<>();
		injectedServices.putIfAbsent("marketoSubmissionConfigReader", marketoSubmissionConfigReader);
		injectedServices.putIfAbsent("initUtil", initUtil);
		injectedServices.putIfAbsent("httpCommunication", httpCommunication);

		context.registerService(MarketoSubmissionConfigReader.class,marketoSubmissionConfigReader);
		context.registerService(InitUtil.class, initUtil);
		context.registerService(HttpCommunication.class, httpCommunication);
		underTest = new MarketoCommunicationImpl();

		context.registerInjectActivateService(underTest,injectedServices);
	}

	@Test
	void requestNewToken() throws IOException, HttpRequestException {
		this.commonStubbing(true);

		AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
				.accessToken("dummy-access-token-123").build();
		when(httpCommunication.sendPostMessage(anyString(),anyString(),any(),anyList(),any(CloseableHttpClient.class))).thenReturn("sss");
		when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(authenticationResponse);
		String testToken = underTest.requestNewToken();
		assertEquals("dummy-access-token-123", testToken);
	}

	@Test
	void requestNewTokenNoConnData() {
		String testToken = underTest.requestNewToken();
		assertNull(testToken);
	}

	@Test
	void requestNewTokenInvalidToken() throws IOException, HttpRequestException {
		this.commonStubbing(true);

		when(httpCommunication.sendPostMessage(anyString(),anyString(),any(),anyList(), any(CloseableHttpClient.class))).thenReturn("dummy-response-text");
		when(objectMapper.readValue(anyString(), any(Class.class))).thenThrow(JsonProcessingException.class);
		String testToken = underTest.requestNewToken();
		assertNull( testToken);
	}

	@Test
	void requestNewTokenBadConnData() {
		Exception exception = assertThrows(HttpRequestException.class, () -> {

			underTest.requestNewToken(mock(MarketoConnectionData.class));
		});

		String expectedMessage = "Unsuccessful request to get the Marketo token - unable to get Marketo communication information (such as hostname / clientId / secretId)";
		String actualMessage = exception.getMessage();
		assertEquals(actualMessage, expectedMessage);
	}

	@Test
	void requestNewTokenFailedHttpRequest() {
		MarketoConnectionData marketoConnectionData = mock(MarketoConnectionData.class);
		assertThrows(HttpRequestException.class, () -> underTest.requestNewToken(marketoConnectionData));
	}

	@Test
	void submitForm() throws IOException, HttpRequestException {
		this.commonStubbing(true);

		when(httpCommunication.sendPostMessage(anyString(), anyString(), any(), eq(null), any(CloseableHttpClient.class))).thenReturn("mocked response");
		FormSubmissionResponse formSubmissionResponse = FormSubmissionResponse.builder().success(true).build();
		when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(formSubmissionResponse);
		FormSubmissionResponse response = underTest.submitForm(FormInputBase.builder().build(),"dummy");
		assertTrue(response.isSuccess());
	}

	@Test
	void submitFormBadResponse() throws IOException, HttpRequestException {
		this.commonStubbing(true);
		when(httpCommunication.sendPostMessage(anyString(), anyString(), any(), eq(null), any(CloseableHttpClient.class))).thenReturn("mocked response");
		when(objectMapper.readValue(anyString(), any(Class.class))).thenThrow(JsonProcessingException.class);
		FormSubmissionResponse response = underTest.submitForm(FormInputBase.builder().build(),"dummy");
		assertNotNull(response.getDhlErrorMessage());
	}


	public void commonStubbing(boolean needHttpClient){
		if(needHttpClient){
			when(initUtil.getHttpClient()).thenReturn(client);
		}
		lenient().when(initUtil.getObjectMapper()).thenReturn(objectMapper);
		lenient().when(marketoSubmissionConfigReader.getMarketoHost()).thenReturn("https://marketo-host.com");
		lenient().when(marketoSubmissionConfigReader.getMarketoClientId()).thenReturn("marketo-client-id");
		lenient().when(marketoSubmissionConfigReader.getMarketoClientSecret()).thenReturn("marketo-client-secret");
		lenient().when(marketoSubmissionConfigReader.getMarketoAuthenticationAPIEndpoint()).thenReturn("marketo-authentication-endpoint");
		lenient().when(marketoSubmissionConfigReader.getMarketoFormSubmissionAPIEndpoint()).thenReturn("marketo-form-submission-endpoint");
		lenient().when(marketoSubmissionConfigReader.getMarketoFormDescriptionAPIEndpoint()).thenReturn("marketo-form-description-endpoint");
		lenient().when(marketoSubmissionConfigReader.getMarketoFormFieldsAPIEndpoint()).thenReturn("marketo-form-fields-endpoint");
	}

	@Test
	void getAvailableFormFieldNames() throws IOException, HttpRequestException {
		this.commonStubbing(false);
		List<String> availableFormFieldNames = new ArrayList<>();
		availableFormFieldNames.add("dummy-field");
		String authToken = "dummy-auth-token";

		when(httpCommunication.sendGetMessage(anyString(),anyString())).thenReturn("any response");
		when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(formDescriptionResponse);
		when(formDescriptionResponse.getResult()).thenReturn(resultList);
		when(resultList.get(anyInt())).thenReturn(result);
		when(result.getAvailableFormFields()).thenReturn(availableFormFieldNames);

		List<String> testResult = underTest.getAvailableFormFieldNames(authToken);
		assertEquals(1,testResult.size());
	}

	@ParameterizedTest
	@ValueSource(strings = {"dummy-token"})
	@NullAndEmptySource
	void getAvailableFormFieldNamesNoConnData(String tokenValue){
		List<String> fieldNames = underTest.getAvailableFormFieldNames(tokenValue);
		assertTrue(fieldNames.isEmpty());
	}

	@Test
	void getFormFields() throws IOException, HttpRequestException {
		this.commonStubbing(false);
		String authToken = "dummy-auth-token";

		when(httpCommunication.sendGetMessage(anyString(),anyString())).thenReturn("any response");
		when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(formFieldsResponse);
		when(formFieldsResponse.getFormFields()).thenReturn(formFieldsList);

		List<String> testResult = underTest.getFormFields(authToken,1111);
		assertNotNull(testResult);
	}


	@Test
	void getAvailableFormFieldNames_ShouldHandleException_WhenJsonParsingFails() throws IOException, HttpRequestException {
		this.commonStubbing(false);
		String authToken = "valid-auth-token";

		when(httpCommunication.sendGetMessage(anyString(), anyString()))
				.thenReturn("invalid json response");
		when(objectMapper.readValue(anyString(), eq(FormDescriptionResponse.class)))
				.thenThrow(new JsonProcessingException("Invalid JSON") {});

		List<String> results = underTest.getAvailableFormFieldNames(authToken);

		assertTrue(results.isEmpty(), "Should return empty list when JSON parsing fails");
	}

	@Test
	void requestNewToken_ShouldHandleHttpRequestException() throws HttpRequestException {
		this.commonStubbing(true);
		MarketoConnectionData marketoConnectionData = MarketoConnectionData.builder()
				.clientId("client-id")
				.secretId("secret-id")
				.url("https://marketo-host.com")
				.authAPIPath("marketo-authentication-endpoint")
				.build();

		when(httpCommunication.sendPostMessage(
				anyString(),
				anyString(),
				isNull(),
				anyList(),
				any(CloseableHttpClient.class)
		)).thenThrow(new HttpRequestException("Connection failed"));

		Exception exception = assertThrows(HttpRequestException.class, () -> {
			underTest.requestNewToken(marketoConnectionData);
		});

		assertEquals(
				"Unsuccessful request to get the Marketo token - unable to get Marketo communication information (such as hostname / clientId / secretId)",
				exception.getMessage()
		);

		verify(httpCommunication).sendPostMessage(
				anyString(),
				anyString(),
				isNull(),
				anyList(),
				any(CloseableHttpClient.class)
		);
	}

	@Test
	void getFormFields_ShouldHandleExceptions() throws IOException, HttpRequestException {
		// Arrange
		this.commonStubbing(false);
		String authToken = "valid-auth-token";
		int formId = 12345;

		// Configure mocks to use doReturn/when style to avoid strict stubbing issues
		doReturn("invalid json response").when(httpCommunication).sendGetMessage(anyString(), anyString());
		// Use doThrow instead of when().thenThrow() to avoid strict stubbing problems
		doThrow(new JsonProcessingException("Invalid JSON") {}).when(objectMapper)
				.readValue(anyString(), eq(FormFieldsResponse.class));

		// Act
		List<String> results = underTest.getFormFields(authToken, formId);

		// Assert
		assertTrue(results.isEmpty(), "Should return empty list when JSON parsing fails");

		// Verify methods were called
		verify(httpCommunication).sendGetMessage(anyString(), anyString());
		verify(objectMapper).readValue(anyString(), eq(FormFieldsResponse.class));
	}



}
