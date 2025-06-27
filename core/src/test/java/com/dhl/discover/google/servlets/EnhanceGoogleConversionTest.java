package com.dhl.discover.google.servlets;

import com.adobe.granite.crypto.CryptoSupport;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.google.services.GoogleAdsService;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

import static junitx.framework.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class EnhanceGoogleConversionTest {
    private AemContext context = new AemContext();
    private MockSlingHttpServletRequest request = context.request();
    private MockSlingHttpServletResponse response = context.response();

    @Mock
    private Resource resource;

    @Mock
    private Page page;

    @Mock
    private GoogleAdsService googleApiService;

    @Mock
    private CryptoSupport cryptoSupport;

    @InjectMocks
    private EnhanceGoogleConversion servlet;

    @Test
    void doPost_validRequest_successfulResponse() throws IOException, NoSuchAlgorithmException {
        String email = "test@example.com";
        String orderId = "testOrderId";
        String conversionActionId = "testConversionActionId";
        String developerToken = "testDeveloperToken";
        String customerId = "testCustomerId";

        request.setParameterMap(Map.of(
                "email", email,
                "orderId", orderId,
                "conversionActionId", conversionActionId
        ));
        request.setResource(resource);
        when(resource.adaptTo(Page.class)).thenReturn(page);
        when(cryptoSupport.isProtected(anyString())).thenReturn(false);

        JsonObject uploadResponse = new JsonObject();
        uploadResponse.add("results", new JsonObject());

        when(googleApiService.uploadEnhancedConversion(developerToken, customerId, orderId, email, conversionActionId))
                .thenReturn(uploadResponse);
        when(googleApiService.getGoogleAdsConfig(any(Page.class)))
                .thenReturn(new ValueMapDecorator(Map.of("developerToken", developerToken,
                        "customerId", customerId)));

        servlet.doPost(request, response);

        assertEquals("application/json", response.getContentType());
        assertEquals(HttpServletResponse.SC_ACCEPTED, response.getStatus());
        assertEquals(uploadResponse.toString(), response.getOutputAsString());
    }

    @Test
    void doPost_invalidRequest_errorResponse() throws IOException {
        String email = "";
        String orderId = "testOrderId";
        String conversionActionId = "testConversionActionId";
        String developerToken = "testDeveloperToken";
        String customerId = "testCustomerId";

        request.setParameterMap(Map.of(
                "email", email,
                "orderId", orderId,
                "conversionActionId", conversionActionId
        ));
        request.setResource(resource);
        when(resource.adaptTo(Page.class)).thenReturn(page);
        when(cryptoSupport.isProtected(anyString())).thenReturn(false);

        JsonObject uploadResponse = new JsonObject();
        uploadResponse.addProperty("status", HttpServletResponse.SC_BAD_REQUEST);
        uploadResponse.addProperty("message", "Parameter email must not be blank");

        when(googleApiService.getGoogleAdsConfig(any(Page.class)))
                .thenReturn(new ValueMapDecorator(Map.of("developerToken", developerToken,
                        "customerId", customerId)));

        servlet.doPost(request, response);

        assertEquals("application/json", response.getContentType());
        assertEquals(HttpServletResponse.SC_BAD_REQUEST, response.getStatus());
        assertEquals(uploadResponse.toString(), response.getOutputAsString());
    }

    @Test
    void doPost_invalidConfiguration_errorResponse() throws IOException {
        String email = "test@example.com";
        String orderId = "testOrderId";
        String conversionActionId = "testConversionActionId";
        String developerToken = "";
        String customerId = "testCustomerId";

        request.setParameterMap(Map.of(
                "email", email,
                "orderId", orderId,
                "conversionActionId", conversionActionId
        ));
        request.setResource(resource);
        when(resource.adaptTo(Page.class)).thenReturn(page);

        JsonObject uploadResponse = new JsonObject();
        uploadResponse.addProperty("status", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        uploadResponse.addProperty("message", "Internal Server Error");

        when(googleApiService.getGoogleAdsConfig(any(Page.class)))
                .thenReturn(new ValueMapDecorator(Map.of("developerToken", developerToken,
                        "customerId", customerId)));

        servlet.doPost(request, response);

        assertEquals("application/json", response.getContentType());
        assertEquals(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, response.getStatus());
        assertEquals(uploadResponse.toString(), response.getOutputAsString());
    }
}