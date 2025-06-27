package com.dhl.discover.google.services;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.google.helpers.GoogleApiHelper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.jetbrains.annotations.NotNull;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Slf4j
@Component(service = GoogleAdsService.class, immediate = true)
public class GoogleAdsService {
    public static final String API_VERSION_19 = "v19";
    public static final String GOOGLEADS_URL = "https://googleads.googleapis.com/";

    @Reference
    private GoogleCloudProjectService googleCloudProjectService;

    @Reference
    private PageUtilService pageUtilService;

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    public JsonObject uploadEnhancedConversion(String developerToken, String customerId, String orderId, String email, String conversionActionId)
            throws IOException, NoSuchAlgorithmException {

        String accessToken = googleCloudProjectService.getAccessToken();
        String hashedEmail = GoogleApiHelper.normalizeAndHashEmailAddress(email);

        JsonObject payload = buildConversionAdjustmentPayload(customerId, orderId, hashedEmail, conversionActionId);
        String url = GOOGLEADS_URL + API_VERSION_19 + "/customers/" + customerId + ":uploadConversionAdjustments?partialFailure=true";

        try (CloseableHttpClient client = HttpClients.createSystem()) {
            HttpPost post = createPostRequest(url, accessToken, developerToken, payload);
            return executeRequest(client, post);
        }
    }

    private HttpPost createPostRequest(String url, String accessToken, String developerToken, JsonObject payload) {
        var post = new HttpPost(url);
        post.setHeader("Authorization", "Bearer " + accessToken);
        post.setHeader("Content-Type", "application/json");
        post.setHeader("developer-token", developerToken);
        post.setEntity(new StringEntity(payload.toString(), ContentType.APPLICATION_JSON));
        return post;
    }

    private JsonObject executeRequest(CloseableHttpClient client, HttpPost post) throws IOException {
        try (CloseableHttpResponse response = client.execute(post)) {
            var responseBody = EntityUtils.toString(response.getEntity());
            int statusCode = response.getStatusLine().getStatusCode();

            if (statusCode == 200) {
                var responseObject = JsonParser.parseString(responseBody).getAsJsonObject();
                if (responseObject.has("partialFailureError")) {
                    log.error("Partial failure: {}", responseObject.get("partialFailureError").toString());
                }
                return JsonParser.parseString(responseBody).getAsJsonObject();
            } else {
                throw new IOException("Failed to adjust conversion (HTTP " + statusCode + "): " + responseBody);
            }
        }
    }

    private @NotNull JsonObject buildConversionAdjustmentPayload(String customerId, String orderId,
                                                                 String hashedEmail, String conversionActionId) {
        var userIdentifier = new JsonObject();
        userIdentifier.addProperty("hashedEmail", hashedEmail);
        var userIdentifiers = new JsonArray();
        userIdentifiers.add(userIdentifier);

        var adjustment = new JsonObject();
        adjustment.addProperty("adjustmentType", "ENHANCEMENT");
        adjustment.addProperty("orderId", orderId);
        adjustment.addProperty("conversionAction", "customers/" + customerId + "/conversionActions/" + conversionActionId);
        adjustment.add("userIdentifiers", userIdentifiers);

        var adjustments = new JsonArray();
        adjustments.add(adjustment);

        var payload = new JsonObject();
        payload.add("conversionAdjustments", adjustments);
        return payload;
    }

    public ValueMap getGoogleAdsConfig(Page page) {
        var resolver = resourceResolverHelper.getReadResourceResolver();
        return Optional.ofNullable(page)
                .map(pageUtilService::getHomePage)
                .map(Page::getContentResource)
                .map(Resource::getValueMap)
                .map(valueMap -> valueMap.get("googleAdsConfig", ""))
                .filter(StringUtils::isNotBlank)
                .map(configPath -> resolver.getResource(configPath + "/jcr:content"))
                .map(Resource::getValueMap)
                .orElse(ValueMap.EMPTY);
    }
}
