package com.dhl.discover.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FAQItemTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCEPROVIDER_MOCK);

	FAQItem underTest;

	@BeforeEach
	void setUp() {
		context.addModelsForClasses(FAQItem.class);
	}

	@Test
	void modelTest(){
		Map<String, Object> properties = new HashMap<>();
		properties.put("title", "FAQ item title");
		properties.put("content", "FAQ item content");
		properties.put("index", 1);
		Resource resource = context.create().resource("/content/dhl/global/en-global/faq/faq-item", properties);

		underTest = resource.adaptTo(FAQItem.class);
		assert underTest != null;
		underTest.setIndex(2);
		assertNotNull(underTest);
		assertEquals("FAQ item title", underTest.getTitle());
		assertEquals("FAQ item content", underTest.getContent());
		assertEquals(2, underTest.getIndex());
	}

	@DisplayName("Title tests")
	@ParameterizedTest(name = "title: {0}")
	@ValueSource(strings = {"FAQ item title"})
	@NullAndEmptySource
	void titleTests(String title){
		Map<String, Object> properties = new HashMap<>();
		properties.put("title", title);
		properties.put("content", "FAQ item content");
		properties.put("index", 1);
		Resource resource = context.create().resource("/content/dhl/global/en-global/faq/faq-item", properties);

		underTest = resource.adaptTo(FAQItem.class);
		assert underTest != null;
		underTest.setIndex(2);
		assertNotNull(underTest);
		assertNotNull(underTest.getTitle());
	}

	@DisplayName("Content tests")
	@ParameterizedTest(name = "title: {0}")
	@ValueSource(strings = {"FAQ item title"})
	@NullAndEmptySource
	void contentTests(String content){
		Map<String, Object> properties = new HashMap<>();
		properties.put("content", content);
		properties.put("title", "FAQ item title");
		properties.put("index", 1);
		Resource resource = context.create().resource("/content/dhl/global/en-global/faq/faq-item", properties);

		underTest = resource.adaptTo(FAQItem.class);
		assert underTest != null;
		underTest.setIndex(2);
		assertNotNull(underTest);
		assertNotNull(underTest.getContent());
	}
}
