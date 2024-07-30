package com.positive.dhl.core.models;

import com.positive.dhl.core.models.multifields.Tab;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class TabsTest {
    private static final String RESOURCE_PATH = "/content/dhl/home/jcr:content/component";
    private final AemContext context = new AemContext();

    @BeforeEach
    public void setUp() {
        context.addModelsForClasses(Tab.class);
        context.addModelsForClasses(Tabs.class);
        context.load().json("/com/positive/dhl/core/models/Tabs/content.json", RESOURCE_PATH);
    }

    @Test
    void test() {
        Tabs tabs = context.resourceResolver().getResource(RESOURCE_PATH).adaptTo(Tabs.class);

        assertNotNull(tabs);
        assertEquals(2, tabs.getTabList().size());
        assertEquals("h3", tabs.getTitleElement());
    }
}