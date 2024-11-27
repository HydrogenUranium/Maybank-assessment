package com.dhl.discover.core.models;
import com.dhl.discover.core.services.PageUtilService;
import com.google.common.collect.Maps;
import com.dhl.discover.core.services.LaunchService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.Map;

import static com.dhl.discover.junitUtils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LanguageVariantsTest {
    public static final String ROOT_TEST_PAGE_PATH = "/content";
    public static final String EN_US_CURRENT_RESOURCE_PATH = "/content/dhl/us/en-us/category-page/article-page";
    public static final String GLOBAL_CURRENT_RESOURCE_PATH = "/content/dhl/global/en-global";

    private final AemContext context = new AemContext();

    @BeforeEach
    void setUp() {
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, ROOT_TEST_PAGE_PATH);

        var launchService = context.registerService(LaunchService.class, new LaunchService());
        context.registerInjectActivateService(new PageUtilService(), "launchService", launchService);

        context.addModelsForClasses(LanguageVariants.class);
    }

    @Test
    void test_EnUsArticlePage() {
        context.currentResource(EN_US_CURRENT_RESOURCE_PATH);

        MockSlingHttpServletRequest request = context.request();
        LanguageVariants languageVariants = request.adaptTo(LanguageVariants.class);
        assertNotNull(languageVariants);

        assertTrue(languageVariants.hasMultipleLanguageVariants());
        assertEquals("United States", languageVariants.getCurrentRegion());
        assertEquals("en-US", languageVariants.getCurrentLanguage());
        assertEquals(2, languageVariants.getLanguageVariants().size());
        String expectedVariantsJson = "{\"variants\":" +
                "[{\"path\":\"/content/dhl/us/es-us\",\"languages\":\"es-US\"}," +
                "{\"path\":\"/content/dhl/us/en-us\",\"languages\":\"en-US\"}," +
                "{\"path\":\"/content/dhl/global/en-global\",\"languages\":\"en\"}]}";
        assertEquals(expectedVariantsJson, languageVariants.getAllLanguagesJSON());
        assertEquals(2, languageVariants.getAllLanguageVariants().size());
        assertEquals(1, languageVariants.getAllLanguageVariantsGrouped().size());
        assertEquals("us", languageVariants.getCurrentRegionCode());
        assertEquals("Global", languageVariants.getCountries().get("aa").getRegion());
        assertTrue(Maps.difference(
                Map.of("tw","Taiwan","hk","Hong Kong","mo", "Macau"),
                languageVariants.getSpecificCountries())
                .areEqual());
    }

    @Test
    void test_GlobalHomePage() {
        context.currentResource(GLOBAL_CURRENT_RESOURCE_PATH);

        MockSlingHttpServletRequest request = context.request();
        LanguageVariants languageVariants = request.adaptTo(LanguageVariants.class);
        assertNotNull(languageVariants);

        assertTrue(languageVariants.hasMultipleLanguageVariants());
        assertEquals("Global", languageVariants.getCurrentRegion());
        assertEquals("en", languageVariants.getCurrentLanguage());
        assertEquals(1, languageVariants.getLanguageVariants().size());
        String expectedVariantsJson = "{\"variants\":" +
                "[{\"path\":\"/content/dhl/us/en-us\",\"languages\":\"en-US\"}," +
                "{\"path\":\"/content/dhl/us/es-us\",\"languages\":\"es-US\"}," +
                "{\"path\":\"/content/dhl/global/en-global\",\"languages\":\"en\"}]}";
        assertEquals(expectedVariantsJson, languageVariants.getAllLanguagesJSON());
        assertEquals(2, languageVariants.getAllLanguageVariants().size());
        assertEquals(1, languageVariants.getAllLanguageVariantsGrouped().size());
        assertEquals("global", languageVariants.getCurrentRegionCode());
        assertEquals("United States", languageVariants.getCountries().get("us").getRegion());

        LanguageVariant languageVariant = languageVariants.getLanguageVariants().get(0);
        assertEquals("EN", languageVariant.getName());
        assertEquals("/content/dhl/global/en-global", languageVariant.getHome());
        assertEquals("/content/dhl/global/en-global", languageVariant.getLink());
        assertEquals("en", languageVariant.getAcceptlanguages());
        assertEquals("EN Global", languageVariant.getTitle());
        assertTrue(languageVariant.isCurrent());
        assertTrue(languageVariant.isDeflt());
        assertTrue(languageVariant.isExact());
    }

    @Test
    void test_constructor() {
        LanguageVariant variant = new LanguageVariant("name", "title", "/home", "link", "EN", false, false, false);
        variant.setRegion("global");

        assertEquals("name", variant.getName());
        assertEquals("title", variant.getTitle());
        assertEquals("global", variant.getRegion());
        assertEquals("EN", variant.getAcceptlanguages());
        assertEquals("/home", variant.getHome());
        assertEquals("link", variant.getLink());
        assertFalse(variant.isExact());
        assertFalse(variant.isDeflt());
        assertFalse(variant.isCurrent());
    }
}