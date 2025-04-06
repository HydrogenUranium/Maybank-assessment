package com.dhl.discover.core.helpers;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.jetbrains.annotations.NotNull;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

@UtilityClass
@Slf4j
public class GoogleApiHelper {
    public static final String OAUTH2_TOKEN_URL = "https://oauth2.googleapis.com/token";
    public static final String API_VERSION_19 = "v19";
    public static final String GOOGLEADS_URL = "https://googleads.googleapis.com/";

    public static String normalizeAndHash(MessageDigest digest, String s, boolean trimIntermediateSpaces) {
        String normalized = s.toLowerCase();
        if (trimIntermediateSpaces) {
            normalized = normalized.replaceAll("\\s+", "");
        } else {
            normalized = normalized.trim();
        }

        byte[] hash = digest.digest(normalized.getBytes(StandardCharsets.UTF_8));
        var result = new StringBuilder();
        for (byte b : hash) {
            result.append(String.format("%02x", b));
        }

        return result.toString();
    }

    /**
     * Returns the result of normalizing and hashing an email address. For this use case, Google Ads
     * requires removal of any '.' characters preceding {@code gmail.com} or {@code googlemail.com}.
     *
     * @param digest the digest to use to hash the normalized string.
     * @param emailAddress the email address to normalize and hash.
     */
    public static String normalizeAndHashEmailAddress(MessageDigest digest, String emailAddress) {
        String normalizedEmail = emailAddress.toLowerCase();
        String[] emailParts = normalizedEmail.split("@");
        if (emailParts.length > 1 && emailParts[1].matches("^(gmail|googlemail)\\.com\\s*")) {
            emailParts[0] = emailParts[0].replace(".", "");
            normalizedEmail = String.format("%s@%s", emailParts[0], emailParts[1]);
        }
        return normalizeAndHash(digest, normalizedEmail, true);
    }

    public static String normalizeAndHashEmailAddress(String emailAddress) throws NoSuchAlgorithmException {
        var sha256Digest = MessageDigest.getInstance("SHA-256");
        return GoogleApiHelper.normalizeAndHashEmailAddress(sha256Digest, emailAddress);
    }

    public static JsonObject requestAccessToken(String clientId, String clientSecret, String refreshToken) throws IOException {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            var post = new HttpPost(OAUTH2_TOKEN_URL);

            List<NameValuePair> params = new ArrayList<>();
            params.add(new BasicNameValuePair("client_id", clientId));
            params.add(new BasicNameValuePair("client_secret", clientSecret));
            params.add(new BasicNameValuePair("refresh_token", refreshToken));
            params.add(new BasicNameValuePair("grant_type", "refresh_token"));

            post.setEntity(new UrlEncodedFormEntity(params));

            try (CloseableHttpResponse response = client.execute(post)) {
                var responseString = EntityUtils.toString(response.getEntity());
                int statusCode = response.getStatusLine().getStatusCode();

                if (statusCode == 200) {
                    return JsonParser.parseString(responseString).getAsJsonObject();
                } else {
                    throw new IOException("Failed to get access token (HTTP " + statusCode + "): " + responseString);
                }
            }
        }
    }

    public static JsonObject uploadEnhancedConversion(String accessToken, String developerToken, String customerId,
                                                      String orderId, String email, String conversionActionId)
            throws IOException, NoSuchAlgorithmException {

        String hashedEmail = normalizeAndHashEmailAddress(email);
        JsonObject payload = getConversionAdjustmentPayload(customerId, orderId, hashedEmail, conversionActionId);
        String url = GOOGLEADS_URL + API_VERSION_19 + "/customers/" + customerId + ":uploadConversionAdjustments?partialFailure=true";

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = createPostRequest(url, accessToken, developerToken, payload);
            return executeRequest(client, post);
        }
    }

    private static HttpPost createPostRequest(String url, String accessToken, String developerToken, JsonObject payload) {
        var post = new HttpPost(url);
        post.setHeader("Authorization", "Bearer " + accessToken);
        post.setHeader("Content-Type", "application/json");
        post.setHeader("developer-token", developerToken);
        post.setEntity(new StringEntity(payload.toString(), ContentType.APPLICATION_JSON));
        return post;
    }

    private static JsonObject executeRequest(CloseableHttpClient client, HttpPost post) throws IOException {
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

    private static @NotNull JsonObject getConversionAdjustmentPayload(String customerId, String orderId,
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
}
