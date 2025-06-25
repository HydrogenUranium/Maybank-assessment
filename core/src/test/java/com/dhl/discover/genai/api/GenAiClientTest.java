package com.dhl.discover.genai.api;

import com.dhl.discover.genai.api.request.GenAiRequest;
import com.dhl.discover.genai.api.response.GenAiResponse;
import com.dhl.discover.genai.exception.AiException;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.dhl.discover.junitUtils.AssertRequest.verifyPostRequest;
import static com.dhl.discover.junitUtils.AssertRequest.assertThrowsPostRequest;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GenAiClientTest {

    private GenAiClient genAiClient;

    @Mock
    private CloseableHttpResponse httpResponse;

    @Mock
    private StatusLine statusLine;

    @Mock
    private GenAiRequest genAiRequest;

    @Mock
    private GenAiClient.Configuration configuration;

    @BeforeEach
    void setUp() {
        when(configuration.apiKey()).thenReturn("apikey");
        when(configuration.endpointUrl()).thenReturn("https://api.example.com");
        when(configuration.apiVersion()).thenReturn("v1");

        lenient().when(httpResponse.getStatusLine()).thenReturn(statusLine);
        lenient().when(genAiRequest.toJson()).thenReturn("{\"content\": \"test\"}");

        genAiClient = new GenAiClient();
        genAiClient.init(configuration);
    }

    @Test
    void testGenerateContentSuccess() {
        String expectedUrl = "https://api.example.com?api-version=v1";
        String expectedRequestBody = "{\"content\": \"test\"}";

        String responseJson = """
                {
                  "choices": [
                    {
                      "message": {
                        "content": "Description of the image"
                      }
                    }
                  ],
                  "created": 1751375620,
                  "id": "chatcmpl-BoV5oQbYvmNfDzbdM6V44Q7QPLUpS",
                  "model": "gpt-4o-mini-2024-07-18",
                  "object": "chat.completion"
                }
                """;
        when(httpResponse.getEntity()).thenReturn(new StringEntity(responseJson, ContentType.APPLICATION_JSON));
        when(statusLine.getStatusCode()).thenReturn(200);

        GenAiResponse result = verifyPostRequest(expectedUrl, expectedRequestBody, httpResponse,
                () -> genAiClient.generateContent(genAiRequest));

        assertNotNull(result);
        assertEquals("Description of the image", result.getChoices().get(0).getText());
    }

    @Test
    void testGenerateContentApiError() {
        String errorJson = "{\"error\": {\"message\": \"Invalid request\"}}";

        when(statusLine.getStatusCode()).thenReturn(400);
        when(httpResponse.getEntity()).thenReturn(new StringEntity(errorJson, ContentType.APPLICATION_JSON));

        AiException exception = assertThrowsPostRequest(AiException.class, httpResponse, () -> genAiClient.generateContent(genAiRequest));

        assertEquals("API error, status: 400", exception.getMessage());
    }

    @Test
    void testGenerateContentInvalidContentType() throws Exception {
        String response = "Error";

        when(statusLine.getStatusCode()).thenReturn(200);
        when(httpResponse.getEntity()).thenReturn(new StringEntity(response));

        AiException exception = assertThrowsPostRequest(AiException.class, httpResponse, () -> genAiClient.generateContent(genAiRequest));

        assertEquals("Unexpected content type: text/plain; charset=ISO-8859-1", exception.getMessage());
    }

}