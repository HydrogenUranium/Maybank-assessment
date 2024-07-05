package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import com.positive.dhl.core.services.PageUtilService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.positive.dhl.core.components.EnvironmentConfiguration;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import java.util.Map;

import static com.positive.dhl.junitUtils.InjectorMock.mockInjectHomeProperty;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DhlPageTest {
    private final AemContext ctx = new AemContext();

	@Mock
	private EnvironmentConfiguration environmentConfiguration;

	@Mock
	private PageUtilService pageUtilService;

	@BeforeEach
	void setUp() throws Exception {
		ctx.load().json("/com/positive/dhl/core/models/StandardAemPage.json", "/content/dhl");
		ctx.registerService(EnvironmentConfiguration.class, environmentConfiguration);
		ctx.registerService(PageUtilService.class, pageUtilService);
	    ctx.addModelsForClasses(DhlPage.class);
		mockInjectHomeProperty(ctx, Map.of(
				"trackingid", "tracking-id",
				"gtmtrackingid", "gmt-tracking-id",
				"pathprefix", "/discover",
				"direction", "rtl"
		));

		when(environmentConfiguration.getAkamaiHostname()).thenReturn("www.dhl.com");
		lenient().when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/standardpage");
		
		DhlPage dhlPage = ctx.request().adaptTo(DhlPage.class);
		
		// assertTrue(tagList.getTags().size() == 0);
		assert dhlPage != null;
		assertEquals("https://www.dhl.com/content/dhl/standardpage", dhlPage.getFullUrl());
		assertEquals("/content/dhl/business/finding-new-customers/The-subscription-economy/The-Subscription-Economy", dhlPage.getAmparticlepath());
		assertEquals("", dhlPage.getFullarticlepath());
		assertEquals("gmt-tracking-id", dhlPage.getGtmtrackingid());
		assertEquals("tracking-id", dhlPage.getTrackingid());
		assertEquals("/discover", dhlPage.getPathprefix());
		assertEquals("rtl", dhlPage.getDirection());
		assertEquals("", dhlPage.getRobotsTags());
	}

	@Test
	void initialization_ShouldHaveNoIndex_WhenAncestorHaveInheritableNoIndex() {
		when(pageUtilService.hasInheritedNoIndex(any())).thenReturn(true);
		ctx.currentResource("/content/dhl/standardpage");

		DhlPage dhlPage = ctx.request().adaptTo(DhlPage.class);

		assertNotNull(dhlPage);
		assertEquals("noindex", dhlPage.getRobotsTags());
	}
}
