package com.dhl.discover.core.models.multifields;

import com.dhl.discover.core.models.common.Tab;
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
        context.load().json("/com/dhl/discover/core/models/multifields/Tab/content.json", RESOURCE_PATH);
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