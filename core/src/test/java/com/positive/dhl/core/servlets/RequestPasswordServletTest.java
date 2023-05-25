package com.positive.dhl.core.servlets;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.positive.dhl.core.models.UserAccount;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class RequestPasswordServletTest {
    private static final String USERNAME = "username";
    private static final String PAGE = "page";

    private final AemContext aemContext = new AemContext();

    private final MockSlingHttpServletRequest request = aemContext.request();
    private final MockSlingHttpServletResponse response = aemContext.response();

    @Mock
    private DataSourcePool dataSourcePool;

    @Mock
    private DataSource dataSource;

    @Mock
    private Connection connection;

    @InjectMocks
    private RequestPasswordServlet servlet;

    @BeforeEach
    public void initRequestParams() {
        request.setParameterMap(Map.of(
                USERNAME, "user",
                PAGE, "page"
        ));
    }

    private JsonNode getJsonResponse() throws JsonProcessingException {
        return new ObjectMapper().readTree(response.getOutputAsString());
    }

    private void setRequestParameter(String key, String value) {
        Map<String, Object> newParams = new HashMap<>(request.getParameterMap());
        newParams.put(key, value);
        request.setParameterMap(newParams);
    }

    @Test
    void doPost_ShouldReturnError_WhenUsernameIsNull() throws IOException {
        setRequestParameter(USERNAME, null);

        servlet.doPost(request, response);

        JsonNode json = getJsonResponse();
        assertEquals(2, json.size());
        assertEquals("ko", json.get("status").asText());
        assertEquals("Username not supplied", json.get("error").asText());
    }

    @Test
    void doPost_ShouldReturnError_WhenUsernameIsEmpty() throws IOException {
        setRequestParameter(USERNAME, "");

        servlet.doPost(request, response);

        JsonNode json = getJsonResponse();
        assertEquals(2, json.size());
        assertEquals("ko", json.get("status").asText());
        assertEquals("Username not supplied", json.get("error").asText());
    }

    @Test
    void doPost_ShouldReturnEmpty_WhenDataSourceIsNull() throws Exception {
        servlet.doPost(request, response);

        assertEquals("", response.getOutputAsString());
    }

    @Test
    void doPost_ShouldReturnError_WhenConnectionThrowError() throws Exception {
        when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
        when(dataSource.getConnection()).thenThrow(new SQLException("error"));

        servlet.doPost(request, response);

        JsonNode json = getJsonResponse();
        assertEquals(2, json.size());
        assertEquals("ko", json.get("status").asText());
        assertEquals("Error occurred while producing result JSON: 'error'", json.get("error").asText());
    }

    @Test
    void doPost_ShouldReturnError_WhenRequestPasswordReturnFalse() throws Exception {
        try (MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
            mockedStatic.when(() -> UserAccount.requestPassword(any(), any(), any(), any())).thenReturn(false);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Username not found", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnSuccess_WhenConditionsAreCorrect() throws Exception {
        try (MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
            mockedStatic.when(() -> UserAccount.requestPassword(any(), any(), any(), any())).thenReturn(true);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(1, json.size());
            assertEquals("ok", json.get("status").asText());
        }
    }
}