package com.positive.dhl.core.utils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(AemContextExtension.class)
class IndexUtilsTest {

    private final AemContext context = new AemContext();

    @Test
    void testGetLastVersionName() {
        List<Resource> resources = new ArrayList<>();
        resources.add(createResource("/content/dhl.englishLucene-1-custom-1"));
        resources.add(createResource("/content/dhl.englishLucene-1-custom-3"));
        resources.add(createResource("/content/dhl.englishLucene-2-custom-2"));
        resources.add(createResource("/content/dhl.englishLucene-1-custom-2"));
        resources.add(createResource("/content/dhl.englishLucene-2-custom-1"));
        resources.add(createResource("/content/dhl-1-custom-1"));
        resources.add(createResource("/content/dhl-1"));
        resources.add(createResource("/content/dhl-custom-1"));

        String expected = "dhl.englishLucene-2-custom-2";
        assertEquals(expected, IndexUtils.getIndexResourceWithLastVersion(resources).getName());
    }

    private Resource createResource(String path) {
        context.build().resource(path).commit();
        return context.resourceResolver().getResource(path);
    }
}