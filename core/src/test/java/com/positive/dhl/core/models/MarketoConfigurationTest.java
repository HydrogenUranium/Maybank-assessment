package com.positive.dhl.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.junit.jupiter.MockitoExtension;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class MarketoConfigurationTest {

	private final AemContext aemContext = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);
	MarketoConfiguration underTest;

	@BeforeEach
	void setup(){
		aemContext.addModelsForClasses(MarketoConfiguration.class);
	}

	@ParameterizedTest
	@ValueSource(strings = {"1799", "1800", ""})
	void getHiddenFormIdAsDivId(String formId) {
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("hiddenMarketoId", formId);
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		MockSlingHttpServletRequest request = aemContext.request();
		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String getFormIdAsFormId = underTest.getHiddenFormIdAsDivId();
		String assertedValue;

		if(formId.isBlank()){
			assertedValue = "mktoForm_1756";
		} else {
			assertedValue = MessageFormat.format("mktoForm_{0}", formId);
		}

		assertEquals(assertedValue, getFormIdAsFormId);
	}

	@ParameterizedTest
	@ValueSource(strings = {"1799", "1800", ""})
	void getFormIdAsDivId(String formId) {
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("marketoFormId", formId);
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		MockSlingHttpServletRequest request = aemContext.request();
		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String getFormIdAsFormId = underTest.getFormIdAsDivId();
		String assertedValue;

		if(formId.isBlank()){
			assertedValue = "mktoForm_1795";
		} else {
			assertedValue = MessageFormat.format("mktoForm_{0}", formId);
		}

		assertEquals(assertedValue, getFormIdAsFormId);
	}
}
