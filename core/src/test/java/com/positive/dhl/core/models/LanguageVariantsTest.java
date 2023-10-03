package com.positive.dhl.core.models;

import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LanguageVariantsTest {
    public static final String TEST_RESOURCE_PATH = "/com/positive/dhl/core/models/newContentStructure.json";
    public static final String ROOT_TEST_PAGE_PATH = "/content";
    public static final String EN_US_CURRENT_RESOURCE_PATH = "/content/dhl/us/en-us/category-page/article-page";
    public static final String GLOBAL_CURRENT_RESOURCE_PATH = "/content/dhl/global/en-global";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @BeforeEach
    void setUp() throws Exception {
        context.load().json(TEST_RESOURCE_PATH, ROOT_TEST_PAGE_PATH);

        context.registerService(PageUtilService.class, new PageUtilService());
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
                "[{\"path\":\"/content/dhl/us/es-us/category-page/article-page\",\"languages\":\"es-US\"}," +
                "{\"path\":\"/content/dhl/us/en-us/category-page/article-page\",\"languages\":\"en-US\"}," +
                "{\"path\":\"/content/dhl/global/en-global/category-page/article-page\",\"languages\":\"*\"}]}";
        assertEquals(expectedVariantsJson, languageVariants.getAllLanguagesJSON());
        assertEquals(2, languageVariants.getAllLanguageVariants().size());
        assertEquals(1, languageVariants.getAllLanguageVariantsGrouped().size());
        assertEquals("us", languageVariants.getCurrentRegionCode());
        assertEquals("Global", languageVariants.getCountries().get("aa").getRegion());
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
                "{\"path\":\"/content/dhl/global/en-global\",\"languages\":\"*\"}]}";
        assertEquals(expectedVariantsJson, languageVariants.getAllLanguagesJSON());
        assertEquals(2, languageVariants.getAllLanguageVariants().size());
        assertEquals(1, languageVariants.getAllLanguageVariantsGrouped().size());
        assertEquals("global", languageVariants.getCurrentRegionCode());
        assertEquals("United States", languageVariants.getCountries().get("us").getRegion());

        LanguageVariant languageVariant = languageVariants.getLanguageVariants().get(0);
        assertEquals("EN", languageVariant.getName());
        assertEquals("/content/dhl/global/en-global", languageVariant.getHome());
        assertEquals("/content/dhl/global/en-global", languageVariant.getLink());
        assertEquals("*", languageVariant.getAcceptlanguages());
        assertTrue(languageVariant.isCurrent());
        assertTrue(languageVariant.isDeflt());
        assertTrue(languageVariant.isExact());
    }
}