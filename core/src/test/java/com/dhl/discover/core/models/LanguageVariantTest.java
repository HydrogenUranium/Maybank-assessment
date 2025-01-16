package com.dhl.discover.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class LanguageVariantTest {

    private final AemContext context = new AemContext();

    private LanguageVariant languageVariant;

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(LanguageVariant.class);
        context.build()
                .resource("/content/language", "name", "English", "jcr:title", "English Title", "home", "/home", "link", "/link", "langCode", "en", "deflt", true, "current", true, "exact", true)
                .commit();

        languageVariant = context.resourceResolver().getResource("/content/language").adaptTo(LanguageVariant.class);
    }

    @Test
    void testLanguageVariant() {
        assertNotNull(languageVariant);
        assertEquals("English", languageVariant.getName());
        assertEquals("en", languageVariant.getLangCode());
        assertEquals("English Title", languageVariant.getTitle());
        assertEquals("/home", languageVariant.getHome());
        assertEquals("/link", languageVariant.getLink());
        assertTrue(languageVariant.isDeflt());
        assertTrue(languageVariant.isCurrent());
        assertTrue(languageVariant.isExact());
    }
}