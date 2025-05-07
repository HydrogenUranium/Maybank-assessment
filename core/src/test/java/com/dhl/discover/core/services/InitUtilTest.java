package com.dhl.discover.core.services;

import com.akamai.edgegrid.signer.ClientCredential;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;

import static junit.framework.Assert.assertNotSame;
import static junit.framework.Assert.assertSame;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class InitUtilTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCEPROVIDER_MOCK);

	@Mock
	HttpClientBuilderFactory httpClientBuilderFactory;

	@Spy
	HttpClientBuilder httpClientBuilder;

	@Mock
	CloseableHttpClient client;

	@Mock
	ClientCredential clientCredential;

	InitUtil underTest;

	@BeforeEach
	void setUp(){
		Map<String,Object> injectedServices = new HashMap<>();
		injectedServices.putIfAbsent("httpClientBuilderFactory", httpClientBuilderFactory);
		context.registerService(HttpClientBuilderFactory.class, httpClientBuilderFactory);

		underTest = new InitUtil();
		context.registerInjectActivateService(underTest, injectedServices);
	}

	@Test
	void getHttpClient() {
		when(httpClientBuilderFactory.newBuilder()).thenReturn(httpClientBuilder);
		when(httpClientBuilder.setDefaultRequestConfig(any())).thenReturn(httpClientBuilder);
		when(httpClientBuilder.build()).thenReturn(client);

		CloseableHttpClient clientObj = underTest.getHttpClient();
		assertNotNull(clientObj);
		verify(httpClientBuilderFactory, times(1)).newBuilder();

		CloseableHttpClient existingClient = underTest.getHttpClient();
		assertNotNull(existingClient);
		verifyNoMoreInteractions(httpClientBuilderFactory);
	}

	@Test
	void getAkamaiClient() {
		when(httpClientBuilderFactory.newBuilder()).thenReturn(httpClientBuilder);
		when(httpClientBuilder.setDefaultRequestConfig(any())).thenReturn(httpClientBuilder);
		when(httpClientBuilder.build()).thenReturn(client);

		CloseableHttpClient clientObj = underTest.getAkamaiClient(clientCredential);
		assertNotNull(clientObj);
		verify(httpClientBuilderFactory, times(1)).newBuilder();

		CloseableHttpClient existingClient = underTest.getAkamaiClient(clientCredential);
		assertNotNull(existingClient);
		verifyNoMoreInteractions(httpClientBuilderFactory);
	}

	@Test
	void getObjectMapper() {
		ObjectMapper objectMapper = underTest.getObjectMapper();
		assertNotNull(objectMapper);

		// Ensure the same instance is returned
		ObjectMapper existingObjectMapper = underTest.getObjectMapper();
		assertNotNull(existingObjectMapper);
		assertSame(objectMapper, existingObjectMapper);
	}

	@Test
	void resetClient() {
		when(httpClientBuilderFactory.newBuilder()).thenReturn(httpClientBuilder);
		when(httpClientBuilder.setDefaultRequestConfig(any())).thenReturn(httpClientBuilder);

		// Initialize the client
		CloseableHttpClient initialClient = underTest.getHttpClient();
		assertNotNull(initialClient);

		// Reset the client
		underTest.resetClient();

		// Ensure a new client is created
		CloseableHttpClient newClient = underTest.getHttpClient();
		assertNotNull(newClient);
		assertNotSame(initialClient, newClient);
	}
}
