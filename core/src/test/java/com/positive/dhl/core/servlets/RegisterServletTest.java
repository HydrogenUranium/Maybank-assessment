package com.positive.dhl.core.servlets;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.positive.dhl.core.components.DotmailerComponent;
import com.positive.dhl.core.helpers.ValidationHelper;
import com.positive.dhl.core.models.UserAccount;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
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
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class RegisterServletTest {
    private static final String USERNAME = "username";
    private static final String FIRSTNAME = "firstname";
    private static final String LASTNAME = "lastname";
    private static final String PASSWORD = "password";
    private static final String TC_AGREE = "tcagree";
    private static final String IS_LINKEDIN = "islinkedin";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();

    @Mock
    private DotmailerComponent dotmailerComponent;

    @Mock
    private DataSourcePool dataSourcePool;

    @Mock
    private DataSource dataSource;

    @Mock
    private Connection connection;

    @Mock
    private UserAccount userAccount;

    @InjectMocks
    private RegisterServlet servlet;

    @BeforeEach
    void initRequestParams() throws Exception {
        request.setParameterMap(Map.of(
                USERNAME, "test@dhl.com",
                PASSWORD, "password",
                FIRSTNAME, "Dmytro",
                LASTNAME, "Bratchun",
                TC_AGREE, "true",
                IS_LINKEDIN, "false"
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
    void doPost_ShouldReturnError_WhenDataSourceIsNull() throws Exception {
        when(dataSourcePool.getDataSource(any())).thenReturn(null);

        servlet.doPost(request, response);

        JsonNode json = getJsonResponse();
        assertEquals(2, json.size());
        assertEquals("ko", json.get("status").asText());
        assertEquals("Error occurred while attempting to register", json.get("error").asText());
    }

    @Test
    void doPost_ShouldReturnError_WhenEmailIsNotValid() throws Exception {
        try (MockedStatic<ValidationHelper> mockedStatic = mockStatic(ValidationHelper.class)) {
            mockedStatic.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(false);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Email address not supplied", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenUsernameIsNull() throws Exception {
        try (MockedStatic<ValidationHelper> mockedStatic = mockStatic(ValidationHelper.class)) {
            mockedStatic.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            setRequestParameter(USERNAME, null);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Email address not supplied", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenUsernameIsEmpty() throws Exception {
        try (MockedStatic<ValidationHelper> mockedStatic = mockStatic(ValidationHelper.class)) {
            mockedStatic.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            setRequestParameter(USERNAME, "");

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Email address not supplied", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenGetConnectionThrowException() throws Exception {
        try (MockedStatic<ValidationHelper> validationHelperMock = mockStatic(ValidationHelper.class);
             MockedStatic<UserAccount> userAccountMock = mockStatic(UserAccount.class)) {
            validationHelperMock.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            userAccountMock.when(() -> UserAccount.accountExists(any(), any())).thenReturn(true);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenThrow(new SQLException());

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Error occurred while attempting to register", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenFirstnameIsEmpty() throws Exception {
        try (MockedStatic<ValidationHelper> validationHelperMock = mockStatic(ValidationHelper.class);
             MockedStatic<UserAccount> userAccountMock = mockStatic(UserAccount.class)) {
            validationHelperMock.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            userAccountMock.when(() -> UserAccount.accountExists(any(), any())).thenReturn(true);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);
            setRequestParameter(FIRSTNAME, "");

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Firstname not supplied", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenFirstnameIsNull() throws Exception {
        try (MockedStatic<ValidationHelper> validationHelperMock = mockStatic(ValidationHelper.class);
             MockedStatic<UserAccount> userAccountMock = mockStatic(UserAccount.class)) {
            validationHelperMock.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            userAccountMock.when(() -> UserAccount.accountExists(any(), any())).thenReturn(true);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);
            setRequestParameter(FIRSTNAME, null);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Firstname not supplied", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenLastnameIsNull() throws Exception {
        try (MockedStatic<ValidationHelper> validationHelperMock = mockStatic(ValidationHelper.class);
             MockedStatic<UserAccount> userAccountMock = mockStatic(UserAccount.class)) {
            validationHelperMock.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            userAccountMock.when(() -> UserAccount.accountExists(any(), any())).thenReturn(true);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);
            setRequestParameter(LASTNAME, null);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Lastname not supplied", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenLastnameIsEmpty() throws Exception {
        try (MockedStatic<ValidationHelper> validationHelperMock = mockStatic(ValidationHelper.class);
             MockedStatic<UserAccount> userAccountMock = mockStatic(UserAccount.class)) {
            validationHelperMock.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            userAccountMock.when(() -> UserAccount.accountExists(any(), any())).thenReturn(true);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);
            setRequestParameter(LASTNAME, "");

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Lastname not supplied", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenAccountExists() throws Exception {
        try (MockedStatic<ValidationHelper> validationHelperMock = mockStatic(ValidationHelper.class);
             MockedStatic<UserAccount> userAccountMock = mockStatic(UserAccount.class)) {
            validationHelperMock.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            userAccountMock.when(() -> UserAccount.accountExists(any(), any())).thenReturn(true);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Email address already exists", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenUserIsNull() throws Exception {
        try (MockedStatic<ValidationHelper> validationHelperMock = mockStatic(ValidationHelper.class);
             MockedStatic<UserAccount> userAccountMock = mockStatic(UserAccount.class)) {
            validationHelperMock.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            userAccountMock.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
            userAccountMock.when(() -> UserAccount.Register(any(), any())).thenReturn(null);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Error occurred while attempting to register", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldReturnError_WhenUserIsNotAuthenticated() throws Exception {
        try (MockedStatic<ValidationHelper> validationHelperMock = mockStatic(ValidationHelper.class);
             MockedStatic<UserAccount> userAccountMock = mockStatic(UserAccount.class)) {
            validationHelperMock.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            userAccountMock.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
            userAccountMock.when(() -> UserAccount.Register(any(), any())).thenReturn(userAccount);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);
            when(userAccount.isAuthenticated()).thenReturn(false);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(2, json.size());
            assertEquals("ko", json.get("status").asText());
            assertEquals("Error occurred while attempting to register", json.get("error").asText());
        }
    }

    @Test
    void doPost_ShouldRegisterAndSendWelcomeEmail_WhenConditionsAreTrue() throws Exception {
        try (MockedStatic<ValidationHelper> validationHelperMock = mockStatic(ValidationHelper.class);
             MockedStatic<UserAccount> userAccountMock = mockStatic(UserAccount.class)) {
            validationHelperMock.when(() -> ValidationHelper.isEmailAddressValid(any())).thenReturn(true);
            userAccountMock.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
            userAccountMock.when(() -> UserAccount.Register(any(), any())).thenReturn(userAccount);
            when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
            when(dataSource.getConnection()).thenReturn(connection);
            when(userAccount.isAuthenticated()).thenReturn(true);
            when(userAccount.isAuthenticated()).thenReturn(true);
            when(userAccount.getUsername()).thenReturn("test@dhl.com");
            when(userAccount.getName()).thenReturn("Dmytro");
            when(userAccount.getToken()).thenReturn("token");
            when(userAccount.getRefreshToken()).thenReturn("refresh-token");
            when(userAccount.getTimeToLive()).thenReturn(60_000);

            servlet.doPost(request, response);

            JsonNode json = getJsonResponse();
            assertEquals(6, json.size());
            assertEquals("ok", json.get("status").asText());
            assertEquals("test@dhl.com", json.get("username").asText());
            assertEquals("Dmytro", json.get("name").asText());
            assertEquals("token", json.get("token").asText());
            assertEquals("refresh-token", json.get("refresh_token").asText());
            assertEquals(60_000, json.get("ttl").asInt());
            verify(dotmailerComponent, times(1)).ExecuteWelcome("Dmytro", "test@dhl.com");
        }
    }
}