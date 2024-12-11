package com.dhl.discover.core.servlets;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.BasicHttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import java.util.Map;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FetchYouTubeDataServletTest {

    AemContext context = new AemContext();

    @Mock
    FetchYouTubeDataServlet.Configuration configuration;

    @InjectMocks
    private FetchYouTubeDataServlet servlet;

    private MockSlingHttpServletRequest request;
    private MockSlingHttpServletResponse response;

    @Mock
    private CloseableHttpClient httpClient;

    @Mock
    private CloseableHttpResponse httpResponse;

    @Mock
    private HttpEntity entity;

    @BeforeEach
    void setUp() {
        request = context.request();
        response = context.response();
        servlet = spy(new FetchYouTubeDataServlet());
        String apiKey = "test-api-key";
        when(configuration.apiKey()).thenReturn(apiKey);
        servlet = new FetchYouTubeDataServlet();
        servlet.init(configuration);
    }

    @Test
    void testDoGet_missingApiKeyOrVideoId() throws IOException {
        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
    }

    @Test
    void testDoGet_validRequest() throws IOException {
        String videoId = "yaBMNgAcBWA";
        String apiResponse = "{\"kind\":\"youtube#videoListResponse\",\"items\":[]}";

        try (MockedStatic<HttpClients> mockedStatic = mockStatic(HttpClients.class)) {
            mockedStatic.when(HttpClients::createDefault).thenReturn(httpClient);
            request.setParameterMap(Map.of("videoId", videoId));

            when(httpClient.execute(any())).thenReturn(httpResponse);
            when(httpResponse.getEntity()).thenReturn(entity);
            when(entity.getContentType()).thenReturn(new BasicHeader("Content-Type", "application/json"));
            when(entity.getContent()).thenReturn(new ByteArrayInputStream(apiResponse.getBytes()));

            servlet.doGet(request, response);

            assertEquals("application/json", response.getContentType());
            assertEquals(200, response.getStatus());
            assertEquals("{\"kind\":\"youtube#videoListResponse\",\"items\":[]}", apiResponse);

        }
    }

    @Test
    void testDoGet_unsupportedContentType() throws IOException {
        String videoId = "yaBMNgAcBWA";
        request.setParameterMap(Map.of("videoId", videoId));

        BasicHttpEntity nonJsonEntity = new BasicHttpEntity();
        nonJsonEntity.setContent(new ByteArrayInputStream("Non-JSON response".getBytes(StandardCharsets.UTF_8)));
        nonJsonEntity.setContentType(new BasicHeader("Content-Type", "text/html"));

        CloseableHttpClient mockHttpClient = mock(CloseableHttpClient.class);
        CloseableHttpResponse mockHttpResponse = mock(CloseableHttpResponse.class);

        when(mockHttpClient.execute(any(HttpGet.class))).thenReturn(mockHttpResponse);
        when(mockHttpResponse.getEntity()).thenReturn(nonJsonEntity);

        try (MockedStatic<HttpClients> mockedStatic = mockStatic(HttpClients.class)) {
            mockedStatic.when(HttpClients::createDefault).thenReturn(mockHttpClient);

            servlet.doGet(request, response);
        }

        assertEquals(415, response.getStatus(), "Expected 415 UNSUPPORTED MEDIA TYPE");
    }

    @Test
    void testDoGet_itemsArrayProcessing() throws IOException {
        String videoId = "yaBMNgAcBWA";
        String apiResponse = "{\"kind\":\"youtube#videoListResponse\",\"items\":[{\"kind\":\"youtube#video\",\"etag\":\"etag1\",\"id\":\"videoId1\",\"snippet\":{\"title\":\"title1\",\"description\":\"description1\",\"publishedAt\":\"2021-01-01T00:00:00Z\",\"thumbnails\":{\"high\":{\"url\":\"http://example.com/high.jpg\"}}},\"contentDetails\":{\"duration\":\"PT10M\"},\"statistics\":{\"viewCount\":\"1000\"}}]}";

        try (MockedStatic<HttpClients> mockedStatic = mockStatic(HttpClients.class)) {
            mockedStatic.when(HttpClients::createDefault).thenReturn(httpClient);
            request.setParameterMap(Map.of("videoId", videoId));

            when(httpClient.execute(any())).thenReturn(httpResponse);
            when(httpResponse.getEntity()).thenReturn(entity);
            when(entity.getContentType()).thenReturn(new BasicHeader("Content-Type", "application/json"));
            when(entity.getContent()).thenReturn(new ByteArrayInputStream(apiResponse.getBytes()));

            servlet.doGet(request, response);

            assertEquals("application/json", response.getContentType());
            assertEquals(200, response.getStatus());
            assertEquals("{\"kind\":\"youtube#videoListResponse\",\"etag\":\"\",\"items\":[{\"kind\":\"youtube#video\",\"etag\":\"etag1\",\"id\":\"videoId1\",\"snippet\":{\"title\":\"title1\",\"description\":\"description1\",\"publishedAt\":\"2021-01-01T00:00:00Z\",\"thumbnails\":{\"high\":{\"url\":\"http://example.com/high.jpg\"}}},\"contentDetails\":{\"duration\":\"PT10M\"},\"statistics\":{\"viewCount\":\"1000\"}}],\"pageInfo\":{\"totalResults\":0,\"resultsPerPage\":0}}", response.getOutputAsString());
        }
    }






}
