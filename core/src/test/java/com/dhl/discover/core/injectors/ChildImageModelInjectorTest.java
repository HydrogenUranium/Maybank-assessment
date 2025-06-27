package com.dhl.discover.core.injectors;

import com.adobe.cq.wcm.core.components.models.Image;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.AnnotatedElement;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class ChildImageModelInjectorTest {
    private final AemContext context = new AemContext();

    @Mock
    private ModelFactory modelFactory;

    @InjectMocks
    private ChildImageModelInjector injector;

    @Mock
    private Image imageModel;

    @Mock
    private AnnotatedElement annotatedElement;

    @Mock
    private DisposalCallbackRegistry callbackRegistry;

    @Test
    void testGetValue_NoAnnotation() {
        when(annotatedElement.isAnnotationPresent(InjectChildImageModel.class)).thenReturn(false);

        Object result = injector.getValue(context.request(), "childName", Image.class, annotatedElement, callbackRegistry);

        assertNull(result, "Expected null when annotation is not present");
    }

    @Test
    void testGetValue_WithAnnotationAndValidChildResource() {
        context.create().resource("/content/test", "fileReference", "some/file/reference");
        context.create().resource("/content/test/childName", "fileReference", "some/file/reference");
        var resource = context.resourceResolver().getResource("/content/test");
        when(annotatedElement.isAnnotationPresent(InjectChildImageModel.class)).thenReturn(true);
        when(modelFactory.createModelFromWrappedRequest(any(), any(), any())).thenReturn(imageModel);
        context.request().setResource(resource);

        Object result = injector.getValue(context.request(), "childName", Image.class, annotatedElement, callbackRegistry);

        assertNotNull(result, "Expected a non-null result when child resource is valid");
        assertTrue(result instanceof Image, "Expected the result to be an instance of Image");
    }

    @Test
    void testGetValue_WithAnnotationAndNoChildResource() {
        context.create().resource("/content/test");
        var resource = context.resourceResolver().getResource("/content/test");
        when(annotatedElement.isAnnotationPresent(InjectChildImageModel.class)).thenReturn(true);
        context.request().setResource(resource);

        Object result = injector.getValue(context.request(), "childName", Image.class, annotatedElement, callbackRegistry);

        assertNull(result, "Expected null when no child resource is found");
    }
}