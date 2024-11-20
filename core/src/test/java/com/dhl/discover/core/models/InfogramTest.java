package com.dhl.discover.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class InfogramTest {
    AemContext context = new AemContext(ResourceResolverType.RESOURCEPROVIDER_MOCK);

    Infogram infogram;

    @BeforeEach
    void init() {
        context.addModelsForClasses(Infogram.class);
    }

    @Test
    void test() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("wordPressEmbedField", "[infogram id=\"5c329a67-1115-4278-a130-b8df9db7b8ed\" prefix=\"hsD\" format=\"interactive\" title=\"Timeline - Dark\"]");
        Resource resource = context.create().resource("/content/dhl/global/en-global/embed", properties);

        infogram = resource.adaptTo(Infogram.class);

        assertNotNull(infogram);
        assertTrue(infogram.isValid());
        assertEquals("Timeline - Dark", infogram.getTitle());
        assertEquals("5c329a67-1115-4278-a130-b8df9db7b8ed", infogram.getId());
        assertEquals("interactive", infogram.getFormat());
        assertEquals("hsD", infogram.getPrefix());
    }

}