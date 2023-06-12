package com.positive.dhl.core.servlets;

import com.positive.dhl.core.config.MarketoSubmissionConfigReader;
import com.positive.dhl.core.dto.marketo.FormInputBase;
import com.positive.dhl.core.dto.marketo.FormSubmissionResponse;
import com.positive.dhl.core.services.HttpCommunication;
import com.positive.dhl.core.services.InitUtil;
import com.positive.dhl.core.services.InputParamHelper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class MarketoSubmissionServletTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);
	MockSlingHttpServletRequest request;
	MockSlingHttpServletResponse response;
	@Mock
	InputParamHelper inputParamHelper;
	@Mock
	HttpCommunication httpCommunication;
	@Mock
	InitUtil initUtil;
	@Mock
	FormInputBase formInputBase;
	@Mock
	MarketoSubmissionConfigReader configReader;
	@InjectMocks
	MarketoSubmissionServlet underTest;

	@BeforeEach
	void setUp() {
		request = context.request();
		response = context.response();
		Map<String,Object> injectedServices = new HashMap<>();
		injectedServices.putIfAbsent("inputParamHelper", inputParamHelper);
		injectedServices.putIfAbsent("httpCommunication", httpCommunication);
		injectedServices.putIfAbsent("configReader", configReader);
		injectedServices.putIfAbsent("initUtil", initUtil);

		context.registerService(InputParamHelper.class, inputParamHelper);
		context.registerService(HttpCommunication.class, httpCommunication);
		context.registerService(InitUtil.class, initUtil);
		context.registerService(MarketoSubmissionConfigReader.class, configReader);

		underTest = new MarketoSubmissionServlet();
		context.registerInjectActivateService(underTest, injectedServices);
	}

	/**
	 * Tests the scenario where configuration disables the hidden form submissions
	 * @throws ServletException is thrown by servlet's doPost method
	 * @throws IOException is thrown by servlet's doPost method
	 */
	@Test
	void functionalityDisabled() throws ServletException, IOException {
		when(configReader.getMarketoHiddenFormSubmissionEnabled()).thenReturn(false);
		underTest.doPost(request, response);

		int status = response.getStatus();
		assertEquals(202, status);
	}

	/**
	 * Tests the scenario where configuration enables the functionality but one or more important config values are disabled
	 * @throws ServletException is thrown by servlet's doPost method
	 * @throws IOException is thrown by servlet's doPost method
	 */
	@Test
	void configNotOK() throws ServletException, IOException {
		when(configReader.getMarketoHiddenFormSubmissionEnabled()).thenReturn(true);
		when(configReader.getMarketoClientId()).thenReturn("");
		underTest.doPost(request, response);

		int status = response.getStatus();
		assertEquals(202, status);
	}

	@Test
	void happyScenario() throws ServletException, IOException {
		request.setHeader("User-agent", "whatever");
		FormSubmissionResponse formSubmissionResponse = FormSubmissionResponse.builder()
				.success(true)
				.requestId("dummy-request-id")
				.build();

		when(configReader.getMarketoHiddenFormSubmissionEnabled()).thenReturn(true);
		when(configReader.getMarketoHost()).thenReturn("dummy-host");
		when(configReader.getMarketoClientId()).thenReturn("dummy-client-id");
		when(configReader.getMarketoClientSecret()).thenReturn("dummy-secret-id");
		when(inputParamHelper.buildForm(any(SlingHttpServletRequest.class), anyList(), anyList())).thenReturn(formInputBase);
		when(formInputBase.isOk()).thenReturn(true);
		when(httpCommunication.requestNewToken()).thenReturn("dummy-token");
		when(httpCommunication.submitForm(any(FormInputBase.class), anyString())).thenReturn(formSubmissionResponse);

		underTest.doPost(request,response);
		String responseBody = context.response().getOutputAsString();
		assertEquals("ok".toLowerCase(), responseBody.toLowerCase());
	}

	@Test
	void tokenNotReceived() throws ServletException, IOException {
		request.setHeader("User-agent", "whatever");
		when(configReader.getMarketoHiddenFormSubmissionEnabled()).thenReturn(true);
		when(configReader.getMarketoHost()).thenReturn("dummy-host");
		when(configReader.getMarketoClientId()).thenReturn("dummy-client-id");
		when(configReader.getMarketoClientSecret()).thenReturn("dummy-secret-id");
		when(inputParamHelper.buildForm(any(SlingHttpServletRequest.class), anyList(), anyList())).thenReturn(mock(FormInputBase.class));

		underTest.doPost(request,response);
		verify(httpCommunication, times(0)).submitForm(any(FormInputBase.class),anyString());
	}
}
