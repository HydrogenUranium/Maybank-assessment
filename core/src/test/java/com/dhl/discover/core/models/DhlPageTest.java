package com.dhl.discover.core.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import com.day.cq.wcm.api.policies.ContentPolicy;
import com.day.cq.wcm.api.policies.ContentPolicyManager;
import com.dhl.discover.core.components.EnvironmentConfiguration;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.PageUtilService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import java.util.HashMap;
import java.util.Map;

import static com.dhl.discover.junitUtils.InjectorMock.mockInjectHomeProperty;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DhlPageTest {
    private final AemContext ctx = new AemContext();

	@Mock
	private EnvironmentConfiguration environmentConfiguration;

	@Mock
	private PageUtilService pageUtilService;

	@Mock
	private AssetUtilService assetUtilService;

	@Mock
	private ContentPolicy contentPolicy;

	@Mock
	private ContentPolicyManager contentPolicyManager;

	@BeforeEach
	void setUp() throws Exception {
		ctx.load().json("/com/dhl/discover/core/models/StandardAemPage.json", "/content/dhl");
		ctx.registerService(EnvironmentConfiguration.class, environmentConfiguration);
		ctx.registerService(PageUtilService.class, pageUtilService);
		ctx.registerService(AssetUtilService.class, assetUtilService);
		ctx.addModelsForClasses(DhlPage.class);
		mockInjectHomeProperty(ctx, Map.of(
				"gtmtrackingid", "gmt-tracking-id",
				"assetprefix", "/discover",
				"direction", "rtl",
				"robotsTags", "",
				"brandSlug", "",
				"isChatbotEnabledHomepage", "enabled",
				"chatbotId", ""
		));

		lenient().when(environmentConfiguration.getAkamaiHostname()).thenReturn("www.dhl.com");
		lenient().when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");
		lenient().when(assetUtilService.getPageImagePath(any(Resource.class))).thenReturn("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg");
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/standardpage");
		
		DhlPage dhlPage = ctx.request().adaptTo(DhlPage.class);

		assert dhlPage != null;
		assertEquals("https://www.dhl.com/content/dhl/standardpage", dhlPage.getFullUrl());
		assertEquals("/content/dhl/business/finding-new-customers/The-subscription-economy/The-Subscription-Economy", dhlPage.getAmparticlepath());
		assertEquals("", dhlPage.getFullarticlepath());
		assertEquals("gmt-tracking-id", dhlPage.getGtmtrackingid());
		assertEquals("/discover", dhlPage.getAssetprefix());
		assertEquals("rtl", dhlPage.getDirection());
		assertEquals("", dhlPage.getRobotsTags());
		assertEquals("https://www.dhl.com/discover/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/Header_AOB_Mobile_991x558.jpg", dhlPage.getOgtagimage());
		assertEquals("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg", dhlPage.getPageImage());
		assertEquals("", dhlPage.getSeoTitle());
		assertEquals("www.dhl.com",dhlPage.getAkamaiHostname());
		assertEquals(null,dhlPage.getAdobeDtmLink());
		assertEquals(null,dhlPage.getGtmDelayEnabled());
		assertEquals("enabled", dhlPage.getIsChatbotEnabledHomepage());
		assertEquals("", dhlPage.getChatbotId());
		assertEquals("inherit", dhlPage.getIsChatbotEnabledPage());
		assertEquals("disabled", dhlPage.getIsChatbotEnabledTemplate());
		assertEquals(false, dhlPage.getChatbotEnabled());

	}

	@Test
	void initialization_ShouldHaveNoIndex_WhenAncestorHaveInheritableNoIndex() {
		when(pageUtilService.hasInheritedNoIndex(any())).thenReturn(true);
		ctx.currentResource("/content/dhl/standardpage");

		DhlPage dhlPage = ctx.request().adaptTo(DhlPage.class);

		assertNotNull(dhlPage);
		assertEquals("noindex", dhlPage.getRobotsTags());
	}

	@Test
	void test_defaultOgtagimage() {
		when(pageUtilService.hasInheritedNoIndex(any())).thenReturn(true);
		ctx.currentResource("/content/dhl/standardpage/The-Subscription-Economy");

		DhlPage dhlPage = ctx.request().adaptTo(DhlPage.class);

		assertNotNull(dhlPage);
		assertEquals(
				"https://www.dhl.com/discover/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg",
				dhlPage.getOgtagimage());
	}
	@Test
	void test_defaultPageImage() {
		when(pageUtilService.hasInheritedNoIndex(any())).thenReturn(true);
		ctx.currentResource("/content/dhl/standardpage/The-Subscription-Economy");
		DhlPage basePrefix = ctx.request().adaptTo(DhlPage.class);

		assertNotNull(basePrefix);
		assertEquals(
				"https://www.dhl.com/discover/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg",
				basePrefix.getOgtagimage());
	}

	@Test
	void test_enabledChatbot() {
		ctx.load().json("/com/dhl/discover/core/models/ArticleTemplatePolicy.json", "/conf/dhl/settings/wcm/policies/dhl/components/pages/editable-article/policy");
		ValueMap policyProperties = ctx.currentResource("/conf/dhl/settings/wcm/policies/dhl/components/pages/editable-article/policy").getValueMap();
		lenient().when(contentPolicyManager.getPolicy(ctx.currentResource("/conf/dhl/settings/wcm/policies/dhl/components/pages/editable-article/policy"))).thenReturn(contentPolicy);
		lenient().when(contentPolicy.getProperties()).thenReturn(policyProperties);
		lenient().when(contentPolicyManager.getPolicy(any(Resource.class))).thenReturn(contentPolicy);

		ctx.registerAdapter(ResourceResolver.class, ContentPolicyManager.class, contentPolicyManager);

		ctx.currentResource("/content/dhl/standardpage");
		DhlPage dhlPage = ctx.request().adaptTo(DhlPage.class);

		assertNotNull(dhlPage);
		assertEquals("", dhlPage.getChatbotId());
		assertEquals("inherit",dhlPage.getIsChatbotEnabledPage());
		assertEquals("enabled",dhlPage.getIsChatbotEnabledTemplate());
		assertEquals("enabled",dhlPage.getIsChatbotEnabledHomepage());
		assertEquals(Boolean.TRUE, dhlPage.getChatbotEnabled());
	}

	@Test
	void test_disabledChatbotByTemplate() {
		ValueMap policyProperties = new ValueMapDecorator(new HashMap<>());
		policyProperties.put("isChatbotEnabledTemplate", "disabled");

		lenient().when(contentPolicy.getProperties()).thenReturn(policyProperties);
		lenient().when(contentPolicyManager.getPolicy(any(Resource.class))).thenReturn(contentPolicy);

		ctx.registerAdapter(ResourceResolver.class, ContentPolicyManager.class, contentPolicyManager);

		ctx.currentResource("/content/dhl/standardpage");
		DhlPage dhlPage = ctx.request().adaptTo(DhlPage.class);

		assertNotNull(dhlPage);
		assertEquals("", dhlPage.getChatbotId());
		assertEquals("inherit",dhlPage.getIsChatbotEnabledPage());
		assertEquals("disabled",dhlPage.getIsChatbotEnabledTemplate());
		assertEquals("enabled",dhlPage.getIsChatbotEnabledHomepage());
		assertEquals(Boolean.FALSE, dhlPage.getChatbotEnabled());
	}

}
