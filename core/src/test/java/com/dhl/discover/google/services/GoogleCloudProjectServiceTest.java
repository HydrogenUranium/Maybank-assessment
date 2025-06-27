package com.dhl.discover.google.services;

import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.StringEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;

import static com.dhl.discover.junitUtils.AssertRequest.assertRequestAndMockResponse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GoogleCloudProjectServiceTest {

    @Mock
    private CloseableHttpResponse mockHttpResponse;

    @Mock
    private StatusLine mockStatusLine;

    @Mock
    private GoogleCloudProjectService.Configuration configuration;

    private final GoogleCloudProjectService googleCloudProjectService = new GoogleCloudProjectService();

    @BeforeEach
    void setUp() {
        when(configuration.clientId()).thenReturn("clientId");
        when(configuration.clientSecret()).thenReturn("clientSecret");
        when(configuration.refreshToken()).thenReturn("refreshToken");
        googleCloudProjectService.init(configuration);
    }

    @Test
    void testRequestAccessToken() throws IOException {
        String expectedUrl = "https://oauth2.googleapis.com/token";
        String expectedRequestBody =
                "client_id=clientId" +
                "&client_secret=clientSecret" +
                "&refresh_token=refreshToken" +
                "&grant_type=refresh_token";
        String responseBody = """
                {
                    "access_token":"testAccessToken",
                    "expires_in": 3600
                }
                """;

        when(mockHttpResponse.getEntity()).thenReturn(new StringEntity(responseBody));
        when(mockHttpResponse.getStatusLine()).thenReturn(mockStatusLine);
        when(mockStatusLine.getStatusCode()).thenReturn(200);

        String result = assertRequestAndMockResponse(expectedUrl, expectedRequestBody, mockHttpResponse,
                googleCloudProjectService::getAccessToken
        );

        assertNotNull(result);
    }

}