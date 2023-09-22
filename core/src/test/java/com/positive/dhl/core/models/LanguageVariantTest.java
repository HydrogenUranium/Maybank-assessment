package com.positive.dhl.core.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LanguageVariantTest {

    @Test
    void test() {
        LanguageVariant languageVariant = new LanguageVariant(null, null,null,null,false,false,false);
        assertNull(languageVariant.getRegion());
        assertNull(languageVariant.getName());
        assertNull(languageVariant.getName());
        assertNull(languageVariant.getLink());
        assertNull(languageVariant.getAcceptLanguages());
        assertFalse(languageVariant.getDeflt());
        assertFalse(languageVariant.getCurrent());
        assertFalse(languageVariant.getExact());

        languageVariant.setRegion("region");
        languageVariant.setName("name");
        languageVariant.setHome("home");
        languageVariant.setLink("link");
        languageVariant.setAcceptLanguages("acceptLanguages");
        languageVariant.setDeflt(true);
        languageVariant.setCurrent(true);
        languageVariant.setExact(true);

        assertEquals("region", languageVariant.getRegion());
        assertEquals("name", languageVariant.getName());
        assertEquals("home", languageVariant.getHome());
        assertEquals("link", languageVariant.getLink());
        assertEquals("acceptLanguages", languageVariant.getAcceptLanguages());
        assertTrue(languageVariant.getDeflt());
        assertTrue(languageVariant.getCurrent());
        assertTrue(languageVariant.getExact());
    }
}