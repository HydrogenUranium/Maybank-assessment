package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import com.positive.dhl.core.components.GeneralSiteComponentConfig;
import com.positive.dhl.core.services.GeneralSiteConfigurationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DhlPageTest {
    private final AemContext ctx = new AemContext();

	@Mock
	private GeneralSiteConfigurationService mockGeneralSiteConfigurationService;

	@BeforeEach
	void setUp() throws Exception {
		ctx.load().json("/com/positive/dhl/core/models/StandardAemPage.json", "/content/dhl");
	    ctx.addModelsForClasses(DhlPage.class);
		ctx.registerService(GeneralSiteConfigurationService.class, mockGeneralSiteConfigurationService);
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/standardpage");
		
		DhlPage dhlPage = ctx.request().adaptTo(DhlPage.class);
		
		// assertTrue(tagList.getTags().size() == 0);
		assert dhlPage != null;
		assertEquals("https://www.dhl.com/standardpage", dhlPage.getFullUrl());
		assertEquals("/content/dhl/business/finding-new-customers/The-subscription-economy/The-Subscription-Economy", dhlPage.getAmparticlepath());
		assertEquals("", dhlPage.getFullarticlepath());
		
		dhlPage.setFullUrl("");
		assertEquals("", dhlPage.getFullUrl());
		
		dhlPage.setFullarticlepath("test");
		assertEquals("test", dhlPage.getFullarticlepath());
		
		dhlPage.setAmparticlepath("");
		assertEquals("", dhlPage.getAmparticlepath());
		
		assertEquals("localhost", dhlPage.getHostDetail());
	}

}
