package com.positive.dhl.core.services.impl;

import com.positive.dhl.core.dto.marketo.FormInputBase;
import com.positive.dhl.core.dto.marketo.FormInputData;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.xss.XSSAPI;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class InputParamHelperImplTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

	@Mock
	List<String> permittedFormFields;
	@Mock
	List<String> formFields;

	@Mock
	XSSAPI xssapi;

	MockSlingHttpServletRequest request;
	InputParamHelperImpl underTest;

	@BeforeEach
	void setUp(){
		Map<String,Object> injectedServices = new HashMap<>();
		injectedServices.put("xssapi", xssapi);
		context.registerService(XSSAPI.class,xssapi);

		request = context.request();
		underTest = new InputParamHelperImpl();
		context.registerInjectActivateService(underTest, injectedServices);
	}

	@Test
	void noParams(){
		FormInputBase form = underTest.buildForm(request, permittedFormFields,formFields );
		assertFalse(form.isOk());
	}

	@Test
	void formIdNotExtracted(){
		Map<String,Object> requestParamMap = new HashMap<>();
		requestParamMap.put("dummy-field", "dummy-field-value");
		requestParamMap.put("another-dummy-field", "another-dummy-field-value");
		request.setParameterMap(requestParamMap);
		FormInputBase formInputBase = underTest.buildForm(request, permittedFormFields,formFields );
		assertFalse(formInputBase.isOk());
		assertEquals(0, formInputBase.getFormId());
	}

	@Test
	void allFieldsOK(){
		Map<String,Object> requestParamMap = getParametersMap();
		request.setParameterMap(requestParamMap);
		List<String> availableFields = getAvailableFields();
		List<String> formFields = getFormFields();
		FormInputBase formInputBase = underTest.buildForm(request, availableFields, formFields);
		assertTrue(formInputBase.isOk());
		assertEquals(2, formInputBase.getFormInputData().get(0).getLeadFormFields().size());
	}

	@Test
	void ipV6(){
		request.setRemoteAddr("2601:243:ce7e:3c90:65a8:2864:2e12:348e");
		FormInputBase formInputBase = underTest.buildForm(request, permittedFormFields, formFields);
		assertEquals("127.0.0.1", formInputBase.getFormInputData().get(0).getVisitorData().get("leadClientIpAddress"));
	}

	@Test
	void ipV4(){
		request.setRemoteAddr("38.187.3.201");
		FormInputBase formInputBase = underTest.buildForm(request, permittedFormFields, formFields);
		assertEquals("38.187.3.201", formInputBase.getFormInputData().get(0).getVisitorData().get("leadClientIpAddress"));
	}

	@ParameterizedTest
	@ValueSource(strings = {"1234","1234 ", " 1234"})
	void getFormId(String testId){
		Map<String,Object> requestParamMap = new HashMap<>();
		requestParamMap.put("dummy-field", "dummy-field-value");
		requestParamMap.put("another-dummy-field", "another-dummy-field-value");
		requestParamMap.put("formId", testId);
		request.setParameterMap(requestParamMap);
		int formId = underTest.getFormId(request);
		assertEquals(1234, formId);
	}

	@Test
	void getFormIdNegative(){
		Map<String,Object> requestParamMap = new HashMap<>();
		requestParamMap.put("dummy-field", "dummy-field-value");
		requestParamMap.put("another-dummy-field", "another-dummy-field-value");
		request.setParameterMap(requestParamMap);
		int formId = underTest.getFormId(request);
		assertEquals(0, formId);
	}

	@Test
	void buildForm(){
		Map<String,Object> requestParamMap = getParametersMap();
		List<String> availableFields = getAvailableFields();
		List<String> formFields = getFormFields();

		request.setParameterMap(requestParamMap);
		FormInputBase form = underTest.buildForm(request,availableFields,formFields);
		List<FormInputData> formInputData = form.getFormInputData();
		assertEquals(2, formInputData.get(0).getLeadFormFields().size());
		assertTrue(form.isOk());
	}

	@ParameterizedTest(name = "{index} : Parameter name = ''{0}''")
	@ValueSource(strings = {"dummy-field", "dummy-fields", "nonsense"})
	@NullAndEmptySource
	void paramCheck(String param){
		Map<String,Object> requestParamMap = getParametersMap();
		requestParamMap.put("dummy-field", "dummy-field-value");
		request.setParameterMap(requestParamMap);

		String response = underTest.getRequestParameter(request, param);
		if(null != param && param.equals("dummy-field")){
			assertEquals("dummy-field-value", response);
		} else {
			assertNull(response);
		}

	}

	private List<String> getAvailableFields(){
		List<String> availableFields = new ArrayList<>();
		availableFields.add("email");
		availableFields.add("firstName");
		return availableFields;
	}

	private List<String> getFormFields(){
		List<String> formFields = new ArrayList<>();
		formFields.add("FirstName");
		formFields.add("Email");
		return formFields;
	}

	private Map<String,Object> getParametersMap(){
		Map<String,Object> requestParamMap = new HashMap<>();
		requestParamMap.put("Email", "dummy-field-value");
		requestParamMap.put("FirstName", "another-dummy-field-value");
		requestParamMap.put("LastName", "1234");
		requestParamMap.put("formId", 1234);
		return requestParamMap;
	}
}
