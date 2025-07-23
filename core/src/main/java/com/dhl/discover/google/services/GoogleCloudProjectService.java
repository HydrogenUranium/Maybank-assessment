package com.dhl.discover.google.services;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component(service = GoogleCloudProjectService.class, immediate = true)
@Designate(ocd = GoogleCloudProjectService.Configuration.class)
public class GoogleCloudProjectService {
    public static final String OAUTH2_TOKEN_URL = "https://oauth2.googleapis.com/token";

    private String clientId;
    private String clientSecret;
    private String refreshToken;
    private String accessToken;
    private long accessTokenExpiryTime;

    @Activate
    @Modified
    public void init(GoogleCloudProjectService.Configuration config) {
        this.clientId = config.clientId();
        this.clientSecret = config.clientSecret();
        this.refreshToken = config.refreshToken();
    }

    public String getAccessToken() throws IOException {
        if (accessToken == null || System.currentTimeMillis() > accessTokenExpiryTime - 60_000) {
            var tokenResponse = requestNewAccessToken(clientId, clientSecret, refreshToken);
            accessToken = tokenResponse.get("access_token").getAsString();
            var expiresIn = tokenResponse.get("expires_in").getAsInt();
            accessTokenExpiryTime = System.currentTimeMillis() + (expiresIn * 1000L);
        }
        return accessToken;
    }

    private JsonObject requestNewAccessToken(String clientId, String clientSecret, String refreshToken) throws IOException {
        try (CloseableHttpClient client = HttpClients.createSystem()) {
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

    @ObjectClassDefinition
    @interface Configuration {
        @AttributeDefinition(
                name = "Client ID",
                type = AttributeType.STRING
        )
        String clientId();

        @AttributeDefinition(
                name = "Client Secret",
                type = AttributeType.STRING
        )
        String clientSecret();

        @AttributeDefinition(
                name = "Refresh Token",
                type = AttributeType.STRING
        )
        String refreshToken();
    }
}
