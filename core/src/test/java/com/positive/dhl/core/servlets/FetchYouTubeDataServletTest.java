package com.positive.dhl.core.servlets;

import com.positive.dhl.core.helpers.JcrNodeHelper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.IOException;
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
    private StatusLine statusLine;

    @Mock
    private HttpEntity entity;

    @BeforeEach
    void setUp() {
        request = context.request();
        response = context.response();
        servlet = spy(new FetchYouTubeDataServlet());
    }

    @Test
    void testDoGet_missingApiKeyOrVideoId() throws IOException {
        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
    }

    @Test
    void testDoGet_validRequest() throws IOException {
        String apiKey = "test-api-key";
        String videoId = "test-video-id";
        String apiResponse = "{\"kind\":\"youtube#videoListResponse\",\"items\":[]}";

        try (MockedStatic<HttpClients> mockedStatic = mockStatic(HttpClients.class)) {
            mockedStatic.when(HttpClients::createDefault).thenReturn(httpClient);

            when(configuration.apiKey()).thenReturn(apiKey);
            servlet.init(configuration);
            request.setParameterMap(Map.of("videoId", videoId));

            when(httpClient.execute(any())).thenReturn(httpResponse);
            when(httpResponse.getStatusLine()).thenReturn(statusLine);
            when(statusLine.getStatusCode()).thenReturn(200);
            when(httpResponse.getEntity()).thenReturn(entity);
            when(entity.getContent()).thenReturn(new ByteArrayInputStream(apiResponse.getBytes()));
            when(httpResponse.getAllHeaders()).thenReturn(new Header[]{});

            servlet.doGet(request, response);

            assertEquals(200, response.getStatus());
            assertEquals(apiResponse, response.getOutputAsString());
        }
    }
}
