package com.dhl.discover.junitUtils;

import lombok.experimental.UtilityClass;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.mockito.MockedStatic;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * A utility class that provides helper methods for unit testing HTTP POST requests
 * made using Apache HttpClient.
 * <p>
 * It supports mocking of the {@link HttpClients#createSystem()} call and allows
 * assertions on the outgoing HTTP request and expected behavior (e.g., return value or exception).
 */
@UtilityClass
public class AssertRequest {

    /**
     * Mocks the default HttpClient and allows assertion on the outgoing {@link HttpPost} request.
     * Returns the result of executing the provided {@code methodToTest}.
     *
     * @param assertRequest     a consumer to inspect and assert the request
     * @param mockHttpResponse  the response to return from the mocked HttpClient
     * @param methodToTest      the method under test that performs the HTTP call
     * @param <T>               the return type of the method under test
     * @return the result of {@code methodToTest.get()}
     * @throws RuntimeException if any exception occurs during execution
     */
    public static <T> T verifyPostRequest(ThrowableConsumer<HttpPost> assertRequest,
                                          CloseableHttpResponse mockHttpResponse,
                                          ThrowableSupplier<T> methodToTest) {
        try (MockedStatic<HttpClients> mockedHttpClients = mockStatic(HttpClients.class);
             CloseableHttpClient mockHttpClient = mock(CloseableHttpClient.class)) {

            mockedHttpClients.when(HttpClients::createSystem).thenReturn(mockHttpClient);

            when(mockHttpClient.execute(any(HttpPost.class))).thenAnswer(invocation -> {
                HttpPost request = invocation.getArgument(0);
                if (assertRequest != null) {
                    assertRequest.accept(request);
                }

                return mockHttpResponse;
            });

            return methodToTest.get();
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Mocks the default HttpClient and asserts that the given method throws the expected exception type.
     *
     * @param expectedType      the expected exception class
     * @param mockHttpResponse  the response to return from the mocked HttpClient
     * @param methodToTest      the method under test that is expected to throw an exception
     * @param <T>               the return type of the method under test
     * @param <C>               the type of the expected exception
     * @return the exception thrown by {@code methodToTest}
     * @throws RuntimeException if any exception occurs during execution other than the expected
     */
    public static <T, C extends Throwable> C assertThrowsPostRequest(Class<C> expectedType,
                                                                     CloseableHttpResponse mockHttpResponse,
                                                                     ThrowableSupplier<T> methodToTest) {
        return verifyPostRequest(null, mockHttpResponse, () -> assertThrows(expectedType, methodToTest::get));
    }

    /**
     * Verifies that the method under test performs a POST request to the expected URL
     * with the expected request body, using the mocked HTTP response.
     *
     * @param expectedUrl         the expected URI of the HTTP request
     * @param expectedRequestBody the expected request body content
     * @param mockHttpResponse    the mocked HTTP response to return
     * @param methodToTest        the method under test that performs the HTTP call
     * @param <T>                 the return type of the method under test
     * @return the result of {@code methodToTest.get()}
     * @throws RuntimeException if any exception occurs during execution
     */
    public static <T> T verifyPostRequest(String expectedUrl,
                                          String expectedRequestBody,
                                          CloseableHttpResponse mockHttpResponse,
                                          ThrowableSupplier<T> methodToTest) {
        return verifyPostRequest(request -> {
            assertEquals(expectedUrl, request.getURI().toString());
            String requestBody = EntityUtils.toString(request.getEntity(), StandardCharsets.UTF_8);
            assertNotNull(requestBody);
            assertEquals(expectedRequestBody, requestBody);
        }, mockHttpResponse, methodToTest);
    }
}
