package com.dhl.discover.core.services;

import com.day.cq.wcm.commons.ReferenceSearch;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReferenceServiceTest {
    @Spy
    private ReferenceService referenceService;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private ReferenceSearch referenceSearch;

    @BeforeEach
    void setUp() {
        when(referenceService.getReferenceSearch()).thenReturn(referenceSearch);
        when(referenceSearch.setExact(true)).thenReturn(referenceSearch);
        when(referenceSearch.setSearchRoot(anyString())).thenReturn(referenceSearch);
        when(referenceSearch.setHollow(true)).thenReturn(referenceSearch);
        when(referenceSearch.setMaxReferencesPerPage(-1)).thenReturn(referenceSearch);
    }

    @Test
    void testSearch_NoReferencesFound() {
        Map<String, ReferenceSearch.Info> mockResult = Collections.emptyMap();
        when(referenceSearch.search(resourceResolver, "/content/dhl/test", 100, 0)).thenReturn(mockResult);

        Set<String> result = referenceService.search(resourceResolver, "/content/dhl/test");

        assertEquals(0, result.size());
    }

    @Test
    void testSearch_WithReferencesFound() {
        ReferenceSearch.Info mockInfo = mock(ReferenceSearch.Info.class);
        when(mockInfo.getProperties()).thenReturn(Set.of("/content/dhl/page1", "/content/dhl/page2"));

        Map<String, ReferenceSearch.Info> mockResult = Map.of("key", mockInfo);
        when(referenceSearch.search(resourceResolver, "/content/dhl/test", 100, 0)).thenReturn(mockResult);

        Set<String> result = referenceService.search(resourceResolver, "/content/dhl/test");

        assertEquals(2, result.size());
        assertEquals(Set.of("/content/dhl/page1", "/content/dhl/page2"), result);
    }
}