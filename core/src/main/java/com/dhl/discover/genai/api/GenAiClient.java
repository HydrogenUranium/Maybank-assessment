package com.dhl.discover.genai.api;

import com.dhl.discover.genai.api.request.GenAiRequest;
import com.dhl.discover.genai.api.response.GenAiResponse;
import com.dhl.discover.genai.exception.AiException;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Client for interacting with a Generative AI API.
 * This client handles sending requests and receiving responses from the AI service.
 */
@Component(service = GenAiClient.class)
@Designate(ocd = GenAiClient.Configuration.class)
@Slf4j
public class GenAiClient {
    private String apiKey;
    private String endpointUrl;
    private String apiVersion;

    @Activate
    @Modified
    protected void init(final Configuration configuration) {
        this.apiKey = configuration.apiKey();
        this.endpointUrl = configuration.endpointUrl();
        this.apiVersion = configuration.apiVersion();
    }

    /**
     * Generates content using the Generative AI API.
     *
     * @param request the request containing parameters for content generation
     * @return the response from the AI service
     * @throws AiException if an error occurs during the request
     */
    public GenAiResponse generateContent(GenAiRequest request) throws AiException {
        try (CloseableHttpClient client = HttpClients.createSystem()) {
            var post = createPostRequest(request);

            try (CloseableHttpResponse response = client.execute(post)) {
                int status = response.getStatusLine().getStatusCode();
                var responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);

                validateContentType(response);

                if (status >= 200 && status < 300) {
                    return parseResponse(responseBody);
                } else {
                    log.error("API error: {}", status);
                    throw new AiException("API error, status: " + status);
                }
            }
        } catch (IOException e) {
            throw new AiException("Request failed: " + e.getMessage());
        }
    }

    private HttpPost createPostRequest(GenAiRequest request) {
        var post = new HttpPost(getUrlWithParameters());
        post.setHeader("api-key", apiKey);
        post.setHeader("Content-Type", "application/json");

        String json = request.toJson();
        post.setEntity(new StringEntity(json, StandardCharsets.UTF_8));
        return post;
    }

    private GenAiResponse parseResponse(String responseBody) {
        var jsonObject = JsonParser.parseString(responseBody).getAsJsonObject();
        log.debug("Parsed response JSON: {}", jsonObject);
        return new GenAiResponse(jsonObject);
    }

    private void validateContentType(CloseableHttpResponse response) throws AiException {
        var contentType = response.getEntity().getContentType();
        if (contentType != null && !contentType.getValue().contains("application/json")) {
            log.error("Unexpected content type: {}", contentType.getValue());
            throw new AiException("Unexpected content type: " + contentType.getValue());
        }
    }

    private String getUrlWithParameters() {
        return endpointUrl + "?api-version=" + apiVersion;
    }

    @ObjectClassDefinition(name="Generative AI Configuration")
    @interface Configuration {
        @AttributeDefinition(name="API Key")
        String apiKey();

        @AttributeDefinition(name="Endpoint URL")
        String endpointUrl();

        @AttributeDefinition(name="API version")
        String apiVersion();
    }
}
