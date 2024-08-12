package com.positive.dhl.core.models.multifields;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class TabTest {
    private static final String RESOURCE_PATH = "/content/dhl/home/jcr:content/tabs/tab";
    private final AemContext context = new AemContext();

    @BeforeEach
    public void setUp() {
        context.addModelsForClasses(Tab.class);
        context.load().json("/com/positive/dhl/core/models/multifields/Tab/content.json", RESOURCE_PATH);
    }

    @Test
    void test() {
        Tab tab = context.resourceResolver().getResource(RESOURCE_PATH).adaptTo(Tab.class);

        assertNotNull(tab);
        assertEquals("body", tab.getBody());
        assertEquals("DHL logistics", tab.getTitle());
        assertEquals("/image.png", tab.getImage());
        assertEquals("Image Alt Text", tab.getImageAltText());
    }

}