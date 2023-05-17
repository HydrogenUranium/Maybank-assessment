package com.positive.dhl.core.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.positive.dhl.core.config.MarketoSubmissionConfigReader;
import com.positive.dhl.core.dto.marketo.AuthenticationResponse;
import com.positive.dhl.core.dto.marketo.FormInputBase;
import com.positive.dhl.core.dto.marketo.FormSubmissionResponse;
import com.positive.dhl.core.dto.marketo.MarketoConnectionData;
import com.positive.dhl.core.dto.marketo.formdescription.FormDescriptionResponse;
import com.positive.dhl.core.dto.marketo.formdescription.Result;
import com.positive.dhl.core.dto.marketo.formfields.FormFieldsResponse;
import com.positive.dhl.core.exceptions.MarketoRequestException;
import com.positive.dhl.core.services.InitUtil;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.entity.EntityBuilder;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
class MarketoHttpCommunicationTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

	@Mock
	private MarketoSubmissionConfigReader marketoSubmissionConfigReader;

	@Mock
	private InitUtil initUtil;

	@Mock
	CloseableHttpClient client;

	@Mock
	CloseableHttpResponse response;

	@Mock
	FormDescriptionResponse formDescriptionResponse;

	@Mock
	FormFieldsResponse formFieldsResponse;

	@Mock
	List<String> formFieldsList;

	@Mock
	List<Result> resultList;

	@Mock
	Result result;

	@Mock
	StatusLine statusLine;

	@Mock
	ObjectMapper objectMapper;

	MarketoHttpCommunication underTest;

	@BeforeEach
	void setUp() {
		Map<String,Object> injectedServices = new HashMap<>();
		injectedServices.putIfAbsent("marketoSubmissionConfigReader", marketoSubmissionConfigReader);
		injectedServices.putIfAbsent("initUtil", initUtil);

		context.registerService(MarketoSubmissionConfigReader.class,marketoSubmissionConfigReader);
		context.registerService(InitUtil.class, initUtil);
		underTest = new MarketoHttpCommunication();

		context.registerInjectActivateService(underTest,injectedServices);
	}

	@Test
	void requestNewToken() throws IOException {
		this.commonStubbing();
		HttpEntity httpEntity = EntityBuilder.create().setText("mocked response").build();
		when(client.execute(any(HttpPost.class))).thenReturn(response);
		when(response.getEntity()).thenReturn(httpEntity);
		when(response.getStatusLine()).thenReturn(statusLine);
		when(statusLine.getStatusCode()).thenReturn(200);
		when(statusLine.getReasonPhrase()).thenReturn("dummy reason phrase");

		AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
				.accessToken("dummy-access-token-123").build();
		when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(authenticationResponse);
		String testToken = underTest.requestNewToken();
		assertEquals("dummy-access-token-123", testToken);
	}

	@Test
	void requestNewTokenInvalidToken() throws IOException {
		this.commonStubbing();
		HttpEntity httpEntity = EntityBuilder.create().setText("mocked response").build();
		when(client.execute(any(HttpPost.class))).thenReturn(response);
		when(response.getEntity()).thenReturn(httpEntity);
		when(response.getStatusLine()).thenReturn(statusLine);
		when(statusLine.getStatusCode()).thenReturn(200);
		when(statusLine.getReasonPhrase()).thenReturn("dummy reason phrase");

		when(objectMapper.readValue(anyString(), any(Class.class))).thenThrow(JsonProcessingException.class);
		String testToken = underTest.requestNewToken();
		assertNull( testToken);
	}

	@Test
	void requestNewTokenFailedHttpRequest() {
		MarketoConnectionData marketoConnectionData = mock(MarketoConnectionData.class);
		assertThrows(MarketoRequestException.class, () -> underTest.requestNewToken(marketoConnectionData));
	}

	@Test
	void requestNewTokenMissingConnectionDetails() {
		when(marketoSubmissionConfigReader.getMarketoHost()).thenReturn("https://marketo-host.com");
		when(marketoSubmissionConfigReader.getMarketoClientId()).thenReturn(null);
		when(marketoSubmissionConfigReader.getMarketoClientSecret()).thenReturn("marketo-client-secret");
		when(marketoSubmissionConfigReader.getMarketoAuthenticationAPIEndpoint()).thenReturn("marketo-authentication-endpoint");
		when(marketoSubmissionConfigReader.getMarketoFormSubmissionAPIEndpoint()).thenReturn("marketo-form-submission-endpoint");

		String testToken = underTest.requestNewToken();
		assertNull(testToken);
	}

	@Test
	void submitForm() throws IOException {
		HttpEntity httpEntity = EntityBuilder.create().setText("mocked response").build();
		this.commonStubbing();
		this.commonHttpStubbing(httpEntity,false,true);
		when(objectMapper.writeValueAsString(any(FormInputBase.class))).thenReturn("{'serialized json string'}");
		FormSubmissionResponse formSubmissionResponse = FormSubmissionResponse.builder().success(true).build();
		when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(formSubmissionResponse);
		FormSubmissionResponse response = underTest.submitForm(FormInputBase.builder().build(),"dummy");
		assertTrue(response.isSuccess());
	}

	@Test
	void submitFormBadResponse() throws IOException {
		HttpEntity httpEntity = EntityBuilder.create().setText("mocked response").build();
		this.commonStubbing();
		this.commonHttpStubbing(httpEntity,false ,true );
		when(objectMapper.writeValueAsString(any(FormInputBase.class))).thenReturn("{'serialized json string'}");
		when(objectMapper.readValue(anyString(), any(Class.class))).thenThrow(JsonProcessingException.class);
		FormSubmissionResponse response = underTest.submitForm(FormInputBase.builder().build(),"dummy");
		assertNotNull(response.getDhlErrorMessage());
	}

	@Test
	void sendPostMessageInvalidUrlNoBody() {
		String url = "dummy-wrong-url";
		assertThrows(MarketoRequestException.class, () -> underTest.sendPostMessage(url,"111", null, new ArrayList<>()));
	}

	@Test
	void testSendPostMessage() throws MarketoRequestException, IOException {
		String url = "https://market-host.com/dummy-endpoint";
		String authToken = "dummy-auth-token";
		FormInputBase postBody = mock(FormInputBase.class);

		when(initUtil.getHttpClient()).thenReturn(client);
		when(initUtil.getObjectMapper()).thenReturn(objectMapper);
		when(client.execute(any(HttpPost.class))).thenReturn(response);
		when(objectMapper.writeValueAsString(any())).thenReturn("request body");
		when(response.getEntity()).thenReturn(EntityBuilder.create().setText("mocked response").build());
		when(response.getStatusLine()).thenReturn(statusLine);
		when(statusLine.getStatusCode()).thenReturn(201);
		when(statusLine.getReasonPhrase()).thenReturn("dummy reason phrase");

		String response = underTest.sendPostMessage(url, authToken, postBody, null);
		assertEquals("mocked response", response);
	}

	public void commonStubbing(){
		when(initUtil.getHttpClient()).thenReturn(client);
		when(initUtil.getObjectMapper()).thenReturn(objectMapper);
		when(marketoSubmissionConfigReader.getMarketoHost()).thenReturn("https://marketo-host.com");
		when(marketoSubmissionConfigReader.getMarketoClientId()).thenReturn("marketo-client-id");
		when(marketoSubmissionConfigReader.getMarketoClientSecret()).thenReturn("marketo-client-secret");
		when(marketoSubmissionConfigReader.getMarketoAuthenticationAPIEndpoint()).thenReturn("marketo-authentication-endpoint");
		when(marketoSubmissionConfigReader.getMarketoFormSubmissionAPIEndpoint()).thenReturn("marketo-form-submission-endpoint");
		when(marketoSubmissionConfigReader.getMarketoFormDescriptionAPIEndpoint()).thenReturn("marketo-form-description-endpoint");
		when(marketoSubmissionConfigReader.getMarketoFormFieldsAPIEndpoint()).thenReturn("marketo-form-fields-endpoint");
	}

	public void commonHttpStubbing(HttpEntity httpEntity, boolean mockGet, boolean mockPost) throws IOException {
		if(mockGet){
			when(client.execute(any(HttpGet.class))).thenReturn(response);
		}

		if(mockPost){
			when(client.execute(any(HttpPost.class))).thenReturn(response);
		}

		when(response.getEntity()).thenReturn(httpEntity);
		when(response.getStatusLine()).thenReturn(statusLine);
		when(statusLine.getStatusCode()).thenReturn(200);
		when(statusLine.getReasonPhrase()).thenReturn("dummy reason phrase");
	}

	@Test
	void getAvailableFormFieldNames() throws IOException {
		HttpEntity httpEntity = EntityBuilder.create().setText("mocked response").build();
		this.commonStubbing();
		this.commonHttpStubbing(httpEntity,true ,false );
		String authToken = "dummy-auth-token";

		List<String> availableFormFieldNames = new ArrayList<>();
		availableFormFieldNames.add("dummy-field");

		when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(formDescriptionResponse);
		when(formDescriptionResponse.getResult()).thenReturn(resultList);
		when(resultList.get(anyInt())).thenReturn(result);
		when(result.getAvailableFormFields()).thenReturn(availableFormFieldNames);

		List<String> testResult = underTest.getAvailableFormFieldNames(authToken);
		assertEquals(1,testResult.size());
	}

	@Test
	void getFormFields() throws IOException {
		HttpEntity httpEntity = EntityBuilder.create().setText("mocked response").build();
		this.commonStubbing();
		this.commonHttpStubbing(httpEntity,true ,false );
		String authToken = "dummy-auth-token";

		when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(formFieldsResponse);
		when(formFieldsResponse.getFormFields()).thenReturn(formFieldsList);

		List<String> testResult = underTest.getFormFields(authToken,1111);
		assertNotNull(testResult);
	}

}
