package com.dhl.discover.core.models;

import com.dhl.discover.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class MarketoConfigurationTest {

	private final AemContext aemContext = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

	@Mock
    PageUtilService pageUtilService;

	MarketoConfiguration underTest;

	@BeforeEach
	void setup(){
		aemContext.registerService(PageUtilService.class, pageUtilService);
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
			assertedValue = "mktoForm_";
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
			assertedValue = "mktoForm_";
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

		assertNull( result);
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = {""})
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

		if(formId == null){
			assertNull(result);
		} else {
			assertEquals("", result);
		}

	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = {""})
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
		if(munchkinId == null) {
			assertNull(result);
		} else {
			assertEquals("", result);
		}
	}

	@ParameterizedTest
	@NullSource
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

		assertNull(result);
	}

	@ParameterizedTest
	@NullSource
	@ValueSource(strings = {"1756", "\t", "\n", ""})
	void testNullOrEmptyDivs(String marketoFormId){
		MockSlingHttpServletRequest request = aemContext.request();
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("marketoFormId", marketoFormId);
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String result = underTest.getFormIdAsDivId();

		if(marketoFormId == null) {
			assertEquals("mktoForm_null", result);
		} else if (marketoFormId.equalsIgnoreCase("1756")) {
			assertEquals("mktoForm_1756", result);
		} else {
			assertEquals("mktoForm_", result.trim());
		}
	}

	@Test
	void testMarketoAttributedNotPresent(){
		MockSlingHttpServletRequest request = aemContext.request();
		Map<String,Object> pageProperties = new HashMap<>();
		pageProperties.put("sling:resourceType", "dhl/components/content/inlineshipnowmarketo/v2");
		pageProperties.put("marketoFormId", "1795");
		pageProperties.put("marketoMunchkinId", "903-EZK-832");
		pageProperties.put("marketoHostname", "https://express-resource.dhl.com");
		pageProperties.put("hiddenMarketoId", "1756");
		aemContext.create().resource("/content/dhl/page/jcr:content/marketocomponent", pageProperties);
		aemContext.currentResource("/content/dhl/page/jcr:content/marketocomponent");

		underTest = request.adaptTo(MarketoConfiguration.class);
		assert underTest != null;
		String hiddenMarketoId = underTest.getHiddenMarketoId();
		String marketoId = underTest.getMarketoFormId();
		String munchkinId = underTest.getMarketoMunchkinId();
		String marketoHostname = underTest.getMarketoHostname();
		String formIdAsDiv = underTest.getFormIdAsDivId();
		String hiddenFormIdAsDiv = underTest.getHiddenFormIdAsDivId();

		assertEquals("1756", hiddenMarketoId);
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
