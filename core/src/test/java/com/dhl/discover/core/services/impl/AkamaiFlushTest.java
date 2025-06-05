package com.dhl.discover.core.services.impl;

import com.akamai.edgegrid.signer.ClientCredential;
import com.dhl.discover.core.components.EnvironmentConfiguration;
import com.dhl.discover.core.config.AkamaiFlushConfigReader;
import com.dhl.discover.core.constants.AkamaiInvalidationResult;
import com.dhl.discover.core.exceptions.HttpRequestException;
import com.dhl.discover.core.services.HttpCommunication;
import com.dhl.discover.core.services.InitUtil;
import com.dhl.discover.core.services.RepositoryChecks;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.dhl.discover.core.dto.akamai.FlushRequest;
import com.dhl.discover.core.dto.general.HttpApiResponse;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class AkamaiFlushTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

	@Mock
    EnvironmentConfiguration environmentConfiguration;

	@Mock
    AkamaiFlushConfigReader akamaiFlushConfigReader;

	@Mock
    ResourceResolverHelper resourceResolverHelper;

	@Mock
    RepositoryChecks repositoryChecks;

	@Mock
    HttpCommunication httpCommunication;

	@Mock
    InitUtil initUtil;

	@Mock
	CloseableHttpClient closeableHttpClient;

	AkamaiFlush underTest;

	@BeforeEach
	void setUp() {
		Map<String,Object> injectedServices = new HashMap<>();
		injectedServices.putIfAbsent("environmentConfiguration", environmentConfiguration);
		injectedServices.putIfAbsent("akamaiFlushConfigReader", akamaiFlushConfigReader);
		injectedServices.putIfAbsent("resourceResolverHelper", resourceResolverHelper);
		injectedServices.putIfAbsent("repositoryChecks", repositoryChecks);
		injectedServices.putIfAbsent("httpCommunication", httpCommunication);
		injectedServices.putIfAbsent("initUtil", initUtil);

		context.registerService(EnvironmentConfiguration.class, environmentConfiguration);
		context.registerService(AkamaiFlushConfigReader.class, akamaiFlushConfigReader);
		context.registerService(ResourceResolverHelper.class, resourceResolverHelper);
		context.registerService(RepositoryChecks.class, repositoryChecks);
		context.registerService(HttpCommunication.class, httpCommunication);
		context.registerService(InitUtil.class, initUtil);

		underTest = new AkamaiFlush();
		context.registerInjectActivateService(underTest,injectedServices);

	}

	@Test
	void invalidateAkamaiCache() throws HttpRequestException {
		List<String> allowedContentPaths = new ArrayList<>();
		allowedContentPaths.add("/content/dhl");
		List<String> allowedContentTypes = new ArrayList<>();
		allowedContentTypes.add("cq:Page");

		this.akamaiStubbing();

		when(resourceResolverHelper.getReadResourceResolver()).thenReturn(context.resourceResolver());
		when(akamaiFlushConfigReader.getAllowedContentPaths()).thenReturn(allowedContentPaths);
		when(akamaiFlushConfigReader.getAllowedContentTypes()).thenReturn(allowedContentTypes);
		when(environmentConfiguration.getAkamaiHostname()).thenReturn("uat1.dhl.dhl");
		lenient().when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");
		when(repositoryChecks.getResourceType(anyString(),any(ResourceResolver.class))).thenReturn("cq:Page");
		when(initUtil.getAkamaiClient(any(ClientCredential.class))).thenReturn(closeableHttpClient);
		when(initUtil.getObjectMapper()).thenReturn(new ObjectMapper());
		when(httpCommunication.sendPostMessage(anyString(), any(FlushRequest.class), any(CloseableHttpClient.class)))
				.thenReturn(HttpApiResponse.builder().httpStatus(201).jsonResponse("""
	{
	  "httpStatus": 201,
	  "estimatedSeconds": 5,
	  "purgeId": "edcp-NZbXzFpHBjcJeryhw6PVgG",
	  "supportId": "edcp-NZbXzFpHBjcJeryhw6PVgG",
	  "detail": "Request accepted"
	}
	""").build());

		AkamaiInvalidationResult akamaiInvalidationResult = underTest.invalidateAkamaiCache("/content/dhl/dummy-path", StringUtils.EMPTY);
		verify(httpCommunication, times(1)).sendPostMessage(anyString(),any(FlushRequest.class), any(CloseableHttpClient.class));
		assertEquals(AkamaiInvalidationResult.OK, akamaiInvalidationResult);
	}

	@Test
	void invalidateAkamaiCacheCommsError() throws HttpRequestException {



		List<String> allowedContentPaths = new ArrayList<>();
		allowedContentPaths.add("/content/dhl");
		List<String> allowedContentTypes = new ArrayList<>();
		allowedContentTypes.add("cq:Page");

		this.akamaiStubbing();

		when(resourceResolverHelper.getReadResourceResolver()).thenReturn(context.resourceResolver());
		when(akamaiFlushConfigReader.getAllowedContentPaths()).thenReturn(allowedContentPaths);
		when(akamaiFlushConfigReader.getAllowedContentTypes()).thenReturn(allowedContentTypes);
		when(environmentConfiguration.getAkamaiHostname()).thenReturn("uat1.dhl.dhl");
		lenient().when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");
		when(repositoryChecks.getResourceType(anyString(),any(ResourceResolver.class))).thenReturn("cq:Page");
		when(initUtil.getAkamaiClient(any(ClientCredential.class))).thenReturn(closeableHttpClient);
		when(httpCommunication.sendPostMessage(anyString(),any(FlushRequest.class), any(CloseableHttpClient.class)))
				.thenReturn(null);

		AkamaiInvalidationResult akamaiInvalidationResult = underTest.invalidateAkamaiCache("/content/dhl/dummy-path", StringUtils.EMPTY);
		verify(httpCommunication, times(1)).sendPostMessage(anyString(),any(FlushRequest.class), any(CloseableHttpClient.class));
		assertEquals(AkamaiInvalidationResult.REJECTED, akamaiInvalidationResult);
	}

	@Test
	void invalidateAkamaiCacheNegative() throws HttpRequestException {
		List<String> allowedContentPaths = new ArrayList<>();
		allowedContentPaths.add("/content/dhl");
		List<String> allowedContentTypes = new ArrayList<>();
		allowedContentTypes.add("cq:Page");

		this.akamaiStubbing();

		when(resourceResolverHelper.getReadResourceResolver()).thenReturn(context.resourceResolver());
		when(akamaiFlushConfigReader.getAllowedContentPaths()).thenReturn(allowedContentPaths);
		when(akamaiFlushConfigReader.getAllowedContentTypes()).thenReturn(allowedContentTypes);
		when(environmentConfiguration.getAkamaiHostname()).thenReturn("uat1.dhl.dhl");
		lenient().when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");
		when(repositoryChecks.getResourceType(anyString(),any(ResourceResolver.class))).thenReturn("cq:Page");
		when(initUtil.getAkamaiClient(any(ClientCredential.class))).thenReturn(closeableHttpClient);

		AkamaiInvalidationResult akamaiInvalidationResult = underTest.invalidateAkamaiCache("/content/dhl/dummy-path", StringUtils.EMPTY);
		verify(httpCommunication, times(1)).sendPostMessage(anyString(),any(FlushRequest.class), any(CloseableHttpClient.class));
		assertEquals(AkamaiInvalidationResult.REJECTED, akamaiInvalidationResult);
	}

	@Test
	void invalidateAkamaiCacheIncorrectContentType() {
		List<String> allowedContentPaths = new ArrayList<>();
		allowedContentPaths.add("/content/dhl");
		List<String> allowedContentTypes = new ArrayList<>();
		allowedContentTypes.add("nt:unstructured");

		when(resourceResolverHelper.getReadResourceResolver()).thenReturn(context.resourceResolver());
		when(akamaiFlushConfigReader.getAllowedContentPaths()).thenReturn(allowedContentPaths);
		when(akamaiFlushConfigReader.getAllowedContentTypes()).thenReturn(allowedContentTypes);
		when(repositoryChecks.getResourceType(anyString(),any(ResourceResolver.class))).thenReturn("cq:Page");

		AkamaiInvalidationResult akamaiInvalidationResult = underTest.invalidateAkamaiCache("/content/dhl/dummy-path", StringUtils.EMPTY);
		assertEquals(AkamaiInvalidationResult.SKIPPED, akamaiInvalidationResult);
	}

	@Test
	void invalidateAkamaiCacheIncorrectPath() {
		List<String> allowedContentPaths = new ArrayList<>();
		allowedContentPaths.add("/content/dhl");
		List<String> allowedContentTypes = new ArrayList<>();
		allowedContentTypes.add("cq:Page");

		when(resourceResolverHelper.getReadResourceResolver()).thenReturn(context.resourceResolver());
		when(akamaiFlushConfigReader.getAllowedContentPaths()).thenReturn(allowedContentPaths);
		when(akamaiFlushConfigReader.getAllowedContentTypes()).thenReturn(allowedContentTypes);
		when(repositoryChecks.getResourceType(anyString(),any(ResourceResolver.class))).thenReturn("cq:Page");

		AkamaiInvalidationResult akamaiInvalidationResult = underTest.invalidateAkamaiCache("/dummy-path", StringUtils.EMPTY);
		assertEquals(AkamaiInvalidationResult.SKIPPED, akamaiInvalidationResult);
	}

	@Test
	void invalidateAkamaiSitemapCache() throws HttpRequestException {
		List<String> allowedContentPaths = new ArrayList<>();
		allowedContentPaths.add("/content/dhl");
		List<String> allowedContentTypes = new ArrayList<>();
		allowedContentTypes.add("cq:Page");

		this.akamaiStubbing();

		when(resourceResolverHelper.getReadResourceResolver()).thenReturn(context.resourceResolver());
		when(akamaiFlushConfigReader.getAllowedContentPaths()).thenReturn(allowedContentPaths);
		when(akamaiFlushConfigReader.getAllowedContentTypes()).thenReturn(allowedContentTypes);
		when(environmentConfiguration.getAkamaiHostname()).thenReturn("uat1.dhl.dhl");
		lenient().when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");
		when(repositoryChecks.getResourceType(anyString(),any(ResourceResolver.class))).thenReturn("cq:Page");
		when(initUtil.getAkamaiClient(any(ClientCredential.class))).thenReturn(closeableHttpClient);
		when(initUtil.getObjectMapper()).thenReturn(new ObjectMapper());
		when(httpCommunication.sendPostMessage(anyString(), any(FlushRequest.class), any(CloseableHttpClient.class)))
				.thenReturn(HttpApiResponse.builder().httpStatus(201).jsonResponse("""
				{
  					"httpStatus": 201,
  					"estimatedSeconds": 5,
  					"purgeId": "edcp-NZbXzFpHBjcJeryhw6PVgG",
  					"supportId": "edcp-NZbXzFpHBjcJeryhw6PVgG",
  					"detail": "Request accepted"
}""").build());

		AkamaiInvalidationResult akamaiInvalidationSitemapResult = underTest.invalidateAkamaiCache("/content/dhl/dummy-path", "/sitemap.xml");
		verify(httpCommunication, times(1)).sendPostMessage(anyString(),any(FlushRequest.class), any(CloseableHttpClient.class));
		assertEquals(AkamaiInvalidationResult.OK, akamaiInvalidationSitemapResult);
	}

	private void akamaiStubbing(){
		when(akamaiFlushConfigReader.getAkamaiHost()).thenReturn("akamai-dummy-api-host");
		when(akamaiFlushConfigReader.getClientSecret()).thenReturn("dummy-client-secret");
		when(akamaiFlushConfigReader.getClientToken()).thenReturn("dummy-client-token");
		when(akamaiFlushConfigReader.getAccessToken()).thenReturn("dummy-access-token");
		when(akamaiFlushConfigReader.getApiPath()).thenReturn("/dummy/api/path");
	}

}
