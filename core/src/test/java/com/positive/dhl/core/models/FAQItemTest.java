package com.positive.dhl.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
		Resource resource = context.create().resource("/content/dhl/global/en-global/faq/faq-item", properties);

		underTest = resource.adaptTo(FAQItem.class);
		assertNotNull(underTest);
		assertEquals("FAQ item title", underTest.title);
		assertEquals("FAQ item content", underTest.content);
	}
}
