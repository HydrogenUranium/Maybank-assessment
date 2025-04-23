package com.dhl.discover.core.helpers;

import com.google.gson.JsonObject;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.StringEntity;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;

import static com.dhl.discover.junitUtils.AssertRequest.assertRequestAndMockResponse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GoogleApiHelperTest {

    @Mock
    private CloseableHttpResponse mockHttpResponse;

    @Mock
    private StatusLine mockStatusLine;

    @ParameterizedTest
    @CsvSource({
            "test@dhl.com, 0e0f35136bc2cf0ae7ea4d7a71d8d1d6d0b2c7cc58c24aab2f3eba4202b06075",
            "test@dhl.discover.com, 2ceb6f0cb92546784b8cb965a078fdf3335f2120f1b6b6f9ac7afbd0243fd228",
            "user@googlemail.com, b7821fcf987f87d1b1ebea1bdbe5b2cda97ce6b69c4b5fd2d987801948848b35"
    })
    void testGetGoogleApiKey(String email, String expectedHash) throws NoSuchAlgorithmException {
        String result = GoogleApiHelper.normalizeAndHashEmailAddress(email);
        assertEquals(expectedHash, result);
    }

    @Test
    void testUploadEnhancedConversion() throws IOException {
        String expectedUrl = "https://googleads.googleapis.com/v19/customers/testCustomerId:uploadConversionAdjustments?partialFailure=true";
        String expectedRequestBody = "{" +
                "\"conversionAdjustments\":[" +
                "{" +
                    "\"adjustmentType\":\"ENHANCEMENT\"," +
                    "\"orderId\":\"testOrderId\"," +
                    "\"conversionAction\":\"customers/testCustomerId/conversionActions/testConversionActionId\"," +
                    "\"userIdentifiers\":[" +
                "{" +
                    "\"hashedEmail\":\"973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b\"" +
                "}]}]}";
        String accessToken = "testAccessToken";
        String developerToken = "testDeveloperToken";
        String customerId = "testCustomerId";
        String orderId = "testOrderId";
        String email = "test@example.com";
        String conversionActionId = "testConversionActionId";

        String responseBody = "{\"results\":[]}";
        when(mockHttpResponse.getEntity()).thenReturn(new StringEntity(responseBody));
        when(mockHttpResponse.getStatusLine()).thenReturn(mockStatusLine);
        when(mockStatusLine.getStatusCode()).thenReturn(200);

        JsonObject result = assertRequestAndMockResponse(expectedUrl, expectedRequestBody, mockHttpResponse,
                () -> GoogleApiHelper.uploadEnhancedConversion(accessToken, developerToken, customerId, orderId, email, conversionActionId)
        );

        assertNotNull(result);
    }

    @Test
    void testRequestAccessToken() throws IOException {
        String expectedUrl = "https://oauth2.googleapis.com/token";
        String expectedRequestBody =
                "client_id=clientId" +
                "&client_secret=clientSecret" +
                "&refresh_token=refreshToken" +
                "&grant_type=refresh_token";
        String clientId = "clientId";
        String clientSecret = "clientSecret";
        String refreshToken = "refreshToken";
        String responseBody = "{\"results\":[]}";

        when(mockHttpResponse.getEntity()).thenReturn(new StringEntity(responseBody));
        when(mockHttpResponse.getStatusLine()).thenReturn(mockStatusLine);
        when(mockStatusLine.getStatusCode()).thenReturn(200);

        JsonObject result = assertRequestAndMockResponse(expectedUrl, expectedRequestBody, mockHttpResponse,
                () -> GoogleApiHelper.requestAccessToken(clientId, clientSecret, refreshToken)
        );

        assertNotNull(result);
    }

}