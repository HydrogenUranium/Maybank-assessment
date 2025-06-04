package com.dhl.discover.core.injectors;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.junit.jupiter.api.Test;

import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Type;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AbstractInjectorTest {

    static class TestInjector extends AbstractInjector {
        @Override
        public @NotNull String getName() {
            return "test-injector";
        }

        @Override
        public @Nullable Object getValue(@NotNull Object o, String s, @NotNull Type type, @NotNull AnnotatedElement annotatedElement, @NotNull DisposalCallbackRegistry disposalCallbackRegistry) {
            return null;
        }
    }

    @Test
    void testGetResource_fromResource() {
        Resource mockResource = mock(Resource.class);
        AbstractInjector injector = new TestInjector();

        Resource result = injector.getResource(mockResource);

        assertNotNull(result);
        assertEquals(mockResource, result);
    }

    @Test
    void testGetResource_fromRequest() {
        Resource mockResource = mock(Resource.class);
        SlingHttpServletRequest mockRequest = mock(SlingHttpServletRequest.class);
        when(mockRequest.getResource()).thenReturn(mockResource);

        AbstractInjector injector = new TestInjector();

        Resource result = injector.getResource(mockRequest);

        assertNotNull(result);
        assertEquals(mockResource, result);
    }

    @Test
    void testGetResource_withInvalidType() {
        AbstractInjector injector = new TestInjector();

        Object unknownType = new Object();
        Resource result = injector.getResource(unknownType);

        assertNull(result);
    }
}
