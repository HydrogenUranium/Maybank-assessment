package com.positive.dhl.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
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

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = {"  ", "\t", "\n"})
	void testNullEmptyMunchkinId(String munchkinId){
		MockSlingHttpServletRequest request = aemContext.request();
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("munchkinId", munchkinId);
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String result = underTest.getMarketoMunchkinId();

		assertEquals("903-EZK-832", result);
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = {"  ", "\t", "\n", ""})
	void testNullEmptyFormId(String formId){
		MockSlingHttpServletRequest request = aemContext.request();
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("marketoFormId", formId);
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String result = underTest.getMarketoFormId();

		assertEquals("1795", result);
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = {"  ", "\t", "\n"})
	void testNullEmptyHiddenMunchkinId(String munchkinId){
		MockSlingHttpServletRequest request = aemContext.request();
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("hiddenMarketoMunchkinId", munchkinId);
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String result = underTest.getHiddenMarketoMunchkinId();

		assertEquals("078-ERT-522", result);
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = {"  ", "\t", "\n", ""})
	void testNullEmptyHiddenFormId(String formId){
		MockSlingHttpServletRequest request = aemContext.request();
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("hiddenMarketoId", formId);
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String result = underTest.getHiddenMarketoId();

		assertEquals("1756", result);
	}

	@Test
	void testMarketoAttributedNotPresent(){
		MockSlingHttpServletRequest request = aemContext.request();
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String hiddenMarketoId = underTest.getHiddenMarketoId();
		String hiddenMunchkinId = underTest.getHiddenMarketoMunchkinId();
		String marketoId = underTest.getMarketoFormId();
		String munchkinId = underTest.getMarketoMunchkinId();
		String marketoHostname = underTest.getMarketoHostname();
		String formIdAsDiv = underTest.getFormIdAsDivId();
		String hiddenFormIdAsDiv = underTest.getHiddenFormIdAsDivId();

		assertEquals("1756", hiddenMarketoId);
		assertEquals("078-ERT-522", hiddenMunchkinId);
		assertEquals("1795", marketoId);
		assertEquals("903-EZK-832", munchkinId);
		assertEquals("https://express-resource.dhl.com",marketoHostname);
		assertEquals("mktoForm_1795", formIdAsDiv);
		assertEquals("mktoForm_1756", hiddenFormIdAsDiv);
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = {"  ", "\t", "\n", ""})
	void testNullEmptyMarketoHostname(String formId){
		MockSlingHttpServletRequest request = aemContext.request();
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("formHost", formId);
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String result = underTest.getMarketoHostname();

		assertEquals("https://express-resource.dhl.com", result);
	}
}
