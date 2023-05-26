package com.positive.dhl.core.servlets;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
import com.day.commons.datasource.poolservice.DataSourcePool;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.positive.dhl.core.models.Registration;
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
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class UpdateDetailsServletTest {
	private static final String USERNAME = "username";
	private static final String NEW_USERNAME = "newusername";
	private static final String TOKEN = "token";
	private static final String FIRSTNAME = "firstname";
	private static final String LASTNAME = "lastname";
	private static final String PASSWORD = "password";
	private static final String NEW_PASSWORD = "newpassword";

	private final AemContext aemContext = new AemContext();

	private final MockSlingHttpServletRequest request = aemContext.request();
	private final MockSlingHttpServletResponse response = aemContext.response();

	@Mock
	private DataSourcePool dataSourcePool;

	@Mock
	private DataSource dataSource;

	@Mock
	private Connection connection;

	@Mock
	private UserAccount userAccount;

	@Mock
	private Registration allDetails;

	@InjectMocks
	private UpdateDetailsServlet servlet;

	@BeforeEach
	public void initRequestParams() {
		request.setParameterMap(Map.of(
				USERNAME, "test@dhl.com",
				NEW_USERNAME, "new_test@dhl.com",
				TOKEN, "token",
				FIRSTNAME, "Dmytro",
				LASTNAME, "Bratchun",
				PASSWORD, "password",
				NEW_PASSWORD, "new*password"
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
		servlet.doPost(request, response);

		JsonNode json = getJsonResponse();
		assertEquals(2, json.size());
		assertEquals("ko", json.get("status").asText());
		assertEquals("Error occurred while attempting to register", json.get("error").asText());
	}

	@Test
	void doPost_ShouldReturnError_WhenDataSourceThrowException() throws Exception {
		when(dataSourcePool.getDataSource(any())).thenThrow(new DataSourceNotFoundException("dhl", 1));

		servlet.doPost(request, response);

		JsonNode json = getJsonResponse();
		assertEquals(2, json.size());
		assertEquals("ko", json.get("status").asText());
		assertEquals("Error occurred while attempting to register", json.get("error").asText());
	}

	@Test
	void doPost_ShouldReturnError_WhenNewUsernameExists() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(true);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("A user already exists with the specified new email address.", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenFirstnameIsNull() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
			setRequestParameter(FIRSTNAME, null);

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Firstname not supplied", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenFirstnameIsEmpty() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
			setRequestParameter(FIRSTNAME, "");

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Firstname not supplied", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenLastnameIsNull() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
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
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
			setRequestParameter(LASTNAME, "");

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Lastname not supplied", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenPasswordIsNotCorrect() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			mockedStatic.when(() -> UserAccount.checkPassword(any(), any(), any())).thenReturn(false);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Password incorrect", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenPasswordIsNullAndLinkedinIsFalse() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			when(allDetails.isIslinkedin()).thenReturn(false);
			when(allDetails.isFullAccount()).thenReturn(true);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
			setRequestParameter(PASSWORD, null);

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Password not supplied", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenPasswordIsEmptyAndLinkedinIsFalse() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			when(allDetails.isIslinkedin()).thenReturn(false);
			when(allDetails.isFullAccount()).thenReturn(true);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
			setRequestParameter(PASSWORD, "");

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Password not supplied", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenNewPasswordIsNullAndAccountIsNotFull() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			when(allDetails.isFullAccount()).thenReturn(false);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
			setRequestParameter(NEW_PASSWORD, null);

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Password not supplied", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenNewPasswordIsEmptyAndAccountIsNotFull() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			when(allDetails.isFullAccount()).thenReturn(false);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
			setRequestParameter(NEW_PASSWORD, "");

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Password not supplied", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenUsernameIsEmpty() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			mockedStatic.when(() -> UserAccount.checkPassword(any(), any(), any())).thenReturn(true);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
			setRequestParameter(USERNAME, "");

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Username not supplied", json.get("error").asText());
		}
	}

	// TODO: Should be fixed in the future (NullPointerException)
	@Test
	void doPost_ShouldThrowNullPointerException_WhenUsernameIsNull() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			mockedStatic.when(() -> UserAccount.checkPassword(any(), any(), any())).thenReturn(true);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
			setRequestParameter(USERNAME, null);

			assertThrows(NullPointerException.class, () -> {
				servlet.doPost(request, response);
			});
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenUserAccountIsNull() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			mockedStatic.when(() -> UserAccount.checkPassword(any(), any(), any())).thenReturn(true);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Not allowed", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenUserAccountIsNotAuthenticated() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			mockedStatic.when(() -> UserAccount.checkPassword(any(), any(), any())).thenReturn(true);
			mockedStatic.when(() -> UserAccount.tokenValidate(any(), any(), any())).thenReturn(userAccount);
			when(userAccount.isAuthenticated()).thenReturn(false);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Not allowed", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnError_WhenUpdateDetailsReturnFalse() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			mockedStatic.when(() -> UserAccount.checkPassword(any(), any(), any())).thenReturn(true);
			mockedStatic.when(() -> UserAccount.tokenValidate(any(), any(), any())).thenReturn(userAccount);
			mockedStatic.when(() -> UserAccount.updateDetails(any(), any())).thenReturn(false);
			when(dataSource.getConnection()).thenReturn(connection);
			when(userAccount.isAuthenticated()).thenReturn(true);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);

			servlet.doPost(request, response);

			JsonNode json = getJsonResponse();
			assertEquals(2, json.size());
			assertEquals("ko", json.get("status").asText());
			assertEquals("Error occurred while attempting to update details", json.get("error").asText());
		}
	}

	@Test
	void doPost_ShouldReturnData_WhenConditionsAreCorrect() throws Exception {
		try(MockedStatic<UserAccount> mockedStatic = mockStatic(UserAccount.class)) {
			mockedStatic.when(() -> UserAccount.accountExists(any(), any())).thenReturn(false);
			mockedStatic.when(() -> UserAccount.getAllDetails(any(), any())).thenReturn(allDetails);
			mockedStatic.when(() -> UserAccount.checkPassword(any(), any(), any())).thenReturn(true);
			mockedStatic.when(() -> UserAccount.tokenValidate(any(), any(), any())).thenReturn(userAccount);
			mockedStatic.when(() -> UserAccount.updateDetails(any(), any())).thenReturn(true);
			when(dataSource.getConnection()).thenReturn(connection);
			when(userAccount.isAuthenticated()).thenReturn(true);
			when(dataSourcePool.getDataSource(any())).thenReturn(dataSource);
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
		}
	}
}