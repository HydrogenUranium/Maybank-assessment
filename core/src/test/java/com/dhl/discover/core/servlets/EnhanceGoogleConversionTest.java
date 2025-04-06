package com.dhl.discover.core.servlets;

import com.dhl.discover.core.helpers.GoogleApiHelper;
import com.google.gson.JsonObject;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.NoSuchAlgorithmException;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnhanceGoogleConversionTest {

    @Mock
    private SlingHttpServletRequest mockRequest;

    @Mock
    private SlingHttpServletResponse mockResponse;

    @Mock
    private PrintWriter mockWriter;

    private EnhanceGoogleConversion servlet;

    @Mock
    private EnhanceGoogleConversion.Configuration mockConfig;

    @BeforeEach
    void setUp() {
        servlet = new EnhanceGoogleConversion();
        when(mockConfig.clientId()).thenReturn("testClientId");
        when(mockConfig.clientSecret()).thenReturn("testClientSecret");
        when(mockConfig.customerId()).thenReturn("testCustomerId");
        when(mockConfig.developerToken()).thenReturn("testDeveloperToken");
        when(mockConfig.refreshToken()).thenReturn("testRefreshToken");
        servlet.init(mockConfig);
    }

    @Test
    void doPost_validRequest_successfulResponse() throws IOException, NoSuchAlgorithmException {
        String email = "test@example.com";
        String orderId = "testOrderId";
        String conversionActionId = "testConversionActionId";
        when(mockRequest.getParameter("Email")).thenReturn(email);
        when(mockRequest.getParameter("orderId")).thenReturn(orderId);
        when(mockRequest.getParameter("conversionActionId")).thenReturn(conversionActionId);
        when(mockResponse.getWriter()).thenReturn(mockWriter);

        try (MockedStatic<GoogleApiHelper> mockedHelper = mockStatic(GoogleApiHelper.class)) {


            JsonObject uploadResponse = new JsonObject();
            uploadResponse.add("results", new JsonObject());
            JsonObject tokenResponse = new JsonObject();
            tokenResponse.addProperty("access_token", "testAccessToken");
            tokenResponse.addProperty("expires_in", "3600");

            mockedHelper.when(() -> GoogleApiHelper.uploadEnhancedConversion(anyString(), anyString(), anyString(), anyString(), anyString(), anyString()))
                    .thenReturn(uploadResponse);
            mockedHelper.when(() -> GoogleApiHelper.requestAccessToken(anyString(), anyString(), anyString()))
                    .thenReturn(tokenResponse);

            servlet.doPost(mockRequest, mockResponse);

            verify(mockWriter).write(uploadResponse.toString());
            verify(mockResponse).setContentType("text/plain");
            verify(mockResponse).setStatus(HttpServletResponse.SC_ACCEPTED);

            mockedHelper.verify(() ->
                    GoogleApiHelper.uploadEnhancedConversion(
                            eq("testAccessToken"),
                            eq("testDeveloperToken"),
                            eq("testCustomerId"),
                            eq(orderId),
                            eq(email),
                            eq(conversionActionId)
                    )
            );

            mockedHelper.verify(() ->
                    GoogleApiHelper.requestAccessToken(
                            eq("testClientId"),
                            eq("testClientSecret"),
                            eq("testRefreshToken")
                    )
            );
        }
    }
}