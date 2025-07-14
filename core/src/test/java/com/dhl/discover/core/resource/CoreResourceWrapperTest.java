package com.dhl.discover.core.resource;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class CoreResourceWrapperTest {

    private final AemContext context = new AemContext();

    @Test
    void testGetResourceTypeWithAemContext() {
        Resource originalResource = context.create().resource("/content/test-resource",
                "jcr:primaryType", "nt:unstructured",
                "hiddenProperty", "hiddenValue",
                "sling:resourceType", "original/resource/type");

        String overriddenResourceType = "new/resource/type";
        CoreResourceWrapper wrapper = new CoreResourceWrapper(originalResource, overriddenResourceType,
                List.of("hiddenProperty"),
                Map.of("property1", "value1"));

        assertEquals(overriddenResourceType, wrapper.getResourceType());
        assertEquals("value1", wrapper.getValueMap().get("property1", String.class));
        assertEquals("value1", wrapper.adaptTo(ValueMap.class).get("property1", String.class));
        assertFalse(wrapper.getValueMap().containsKey("hiddenProperty"));
    }

    @Test
    void testThrowException() {
        Resource originalResource = context.create().resource("/content/test-resource",
                "jcr:primaryType", "nt:unstructured");

        assertThrows(IllegalArgumentException.class, () -> {
            new CoreResourceWrapper(originalResource, "", null, null);
        });
    }
}