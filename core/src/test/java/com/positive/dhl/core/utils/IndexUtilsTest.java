package com.positive.dhl.core.utils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class IndexUtilsTest {

    private final AemContext context = new AemContext();

    @Mock
    private ResourceResolver resolverMock;

    @Test
    void testGetLastVersionName() {
        List<Resource> resources = new ArrayList<>();
        resources.add(createResource("/content/oak:index/dhl.englishLucene-1-custom-1"));
        resources.add(createResource("/content/oak:index/dhl.englishLucene-1-custom-3"));
        resources.add(createResource("/content/oak:index/dhl.englishLucene-2-custom-2"));
        resources.add(createResource("/content/oak:index/dhl.englishLucene-1-custom-2"));
        resources.add(createResource("/content/oak:index/dhl.englishLucene-2-custom-1"));
        resources.add(createResource("/content/oak:index/dhl-1-custom-1"));
        resources.add(createResource("/content/oak:index/dhl-1"));
        resources.add(createResource("/content/oak:index/dhl-custom-1"));

        String expected = "dhl.englishLucene-2-custom-2";
        assertEquals(expected, IndexUtils.getIndexResourceWithLastVersion(resources).getName());
        assertEquals(expected, IndexUtils.getIndexResourceWithLastVersion(resources.iterator()).getName());
    }

    private Resource createResource(String path) {
        return createResource(path, new HashMap<>());
    }

    private Resource createResource(String path, Map<String, Object> props) {
        context.build().resource(path, props).commit();
        return context.resourceResolver().getResource(path);
    }

    @Test
    void testPathIncluded() {
        Map<String, Object> props = new HashMap<>();
        props.put("includedPaths", List.of("/content/dhl/page"));
        Resource resource = createResource("/content/oak:index/dhl-index", props);

        assertTrue(IndexUtils.isPathIncluded(resource, "/content/dhl/page"));
        assertFalse(IndexUtils.isPathIncluded(resource, "/content/dhl/excluded-page"));
    }

    @Test
    void testSplitByIndexName() {
        List<Resource> resources = new ArrayList<>();
        Resource english1 = createResource("/content/oak:index/dhl.englishLucene-1-custom-1");
        Resource english2 = createResource("/content/oak:index/dhl.englishLucene-1-custom-2");
        Resource englishAustralia1 = createResource("/content/oak:index/dhl.englishAustraliaLucene-1-custom-1");
        Resource englishAustralia2 = createResource("/content/oak:index/dhl.englishAustraliaLucene-1-custom-2");
        resources.add(english1);
        resources.add(english2);
        resources.add(englishAustralia1);
        resources.add(englishAustralia2);

        Map<String, List<Resource>> result = IndexUtils.splitByIndexName(resources.iterator());

        Map<String, List<Resource>> expected = Map.of(
                "dhl.englishLucene", List.of(english1, english2),
                "dhl.englishAustraliaLucene", List.of(englishAustralia1, englishAustralia2)
        );

        assertEquals(expected, result);
    }

    @Test
    void testHasFullTextIndex() {
        List<Resource> resources = new ArrayList<>();
        resources.add(createResource("/content/oak:index/dhl.englishLucene-1-custom-1", Map.of(
                "includedPaths", List.of("/content/dhl/english", "/content/dhl/ukraine")
        )));
        resources.add(createResource("/content/oak:index/dhl.englishLucene-1-custom-2", Map.of(
                "includedPaths", List.of("/content/dhl/english-renamed")
        )));
        resources.add(createResource("/content/oak:index/dhl.ukrainianLucene-1-custom-1", Map.of(
                "includedPaths", List.of("/content/dhl/ukraine")
        )));
        when(resolverMock.findResources(anyString(), anyString())).thenAnswer(invocationOnMock -> resources.iterator());

        assertFalse(IndexUtils.hasFullTextIndex("/content/dhl/english", resolverMock));
        assertTrue(IndexUtils.hasFullTextIndex("/content/dhl/english-renamed", resolverMock));
        assertTrue(IndexUtils.hasFullTextIndex("/content/dhl/ukraine", resolverMock));
    }

    @Test
    void testGetSuggestionIndexName() {
        List<Resource> resources = new ArrayList<>();
        resources.add(createResource("/content/oak:index/dhl.englishLucene-1-custom-1", Map.of(
                "includedPaths", List.of("/content/dhl/english", "/content/dhl/ukraine")
        )));
        resources.add(createResource("/content/oak:index/dhl.englishLucene-1-custom-2", Map.of(
                "includedPaths", List.of("/content/dhl/english")
        )));
        when(resolverMock.findResources(anyString(), anyString())).thenAnswer(invocationOnMock -> resources.iterator());

        assertEquals("dhl.englishLucene-1-custom-2", IndexUtils.getSuggestionIndexName("/content/dhl/english", resolverMock));
    }
}