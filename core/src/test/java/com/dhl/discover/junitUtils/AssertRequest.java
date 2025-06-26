package com.dhl.discover.junitUtils;

import lombok.experimental.UtilityClass;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.mockito.MockedStatic;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@UtilityClass
public class AssertRequest {

    public static <T> T assertRequestAndMockResponse(ThrowableConsumer<HttpPost> assertRequest, HttpResponse mockHttpResponse, ThrowableSupplier<T> methodToTest) {
        try (MockedStatic<HttpClients> mockedHttpClients = mockStatic(HttpClients.class);
             CloseableHttpClient mockHttpClient = mock(CloseableHttpClient.class)) {

            mockedHttpClients.when(HttpClients::createSystem).thenReturn(mockHttpClient);

            when(mockHttpClient.execute(any(HttpPost.class))).thenAnswer(invocation -> {
                HttpPost request = invocation.getArgument(0);
                assertRequest.accept(request);

                return mockHttpResponse;
            });

            return methodToTest.get();
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> T assertRequestBodyAndMockResponse(String expectedRequestBody, HttpResponse mockHttpResponse, ThrowableSupplier<T> methodToTest) {
        return assertRequestAndMockResponse(request -> {
                String requestBody = EntityUtils.toString(request.getEntity(), StandardCharsets.UTF_8);
                assertNotNull(requestBody);
                assertEquals(expectedRequestBody, requestBody);
        }, mockHttpResponse, methodToTest);
    }

    public static <T> T assertRequestAndMockResponse(String expectedUrl, String expectedRequestBody,
                                                     HttpResponse mockHttpResponse,
                                                     ThrowableSupplier<T> methodToTest) {
        return assertRequestAndMockResponse(request -> {
            assertEquals(expectedUrl, request.getURI().toString());
            String requestBody = EntityUtils.toString(request.getEntity(), StandardCharsets.UTF_8);
            assertNotNull(requestBody);
            assertEquals(expectedRequestBody, requestBody);
        }, mockHttpResponse, methodToTest);
    }
}
