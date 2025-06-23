package com.dhl.discover.google.services;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.StringEntity;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;

import static com.dhl.discover.junitUtils.AssertRequest.assertRequestAndMockResponse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class GoogleAdsServiceTest {

    AemContext context = new AemContext();

    @Mock
    private CloseableHttpResponse mockHttpResponse;

    @Mock
    private StatusLine mockStatusLine;

    @Mock
    private GoogleCloudProjectService googleCloudProjectService;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @InjectMocks
    private GoogleAdsService service;

    @BeforeEach
    void setUp() {
        context.load().json("/com/dhl/discover/google/services/GoogleAdsApiService/content.json", "/content");
        context.load().json("/com/dhl/discover/google/services/GoogleAdsApiService/conf.json", "/conf/global/settings/cloudconfigs/config");
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
        String developerToken = "testDeveloperToken";
        String customerId = "testCustomerId";
        String orderId = "testOrderId";
        String email = "test@example.com";
        String conversionActionId = "testConversionActionId";

        String responseBody = "{\"results\":[]}";
        when(mockHttpResponse.getEntity()).thenReturn(new StringEntity(responseBody));
        when(mockHttpResponse.getStatusLine()).thenReturn(mockStatusLine);
        when(mockStatusLine.getStatusCode()).thenReturn(200);
        when(googleCloudProjectService.getAccessToken()).thenReturn("testAccessToken");

        JsonObject result = assertRequestAndMockResponse(expectedUrl, expectedRequestBody, mockHttpResponse,
                () -> service.uploadEnhancedConversion(developerToken, customerId, orderId, email, conversionActionId)
        );

        assertNotNull(result);
    }

    @Test
    void testGetGoogleAdsConfig() {
        Page page = context.resourceResolver().getResource("/content/dhl/global/en-global/category-page").adaptTo(Page.class);
        Page homePage = context.resourceResolver().getResource("/content/dhl/global/en-global").adaptTo(Page.class);
        when(pageUtilService.getHomePage(any(Page.class))).thenReturn(homePage);
        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(context.resourceResolver());

        ValueMap config = service.getGoogleAdsConfig(page);

        assertNotNull(config);
        assertEquals("developerToken", config.get("developerToken", String.class));
        assertEquals("customerId", config.get("customerId", String.class));
    }

}