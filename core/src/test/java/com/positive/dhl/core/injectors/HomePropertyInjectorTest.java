package com.positive.dhl.core.injectors;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.AnnotatedElement;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HomePropertyInjectorTest {
    private final AemContext context = new AemContext();

    @Mock
    private PageUtilService pageUtils;

    @InjectMocks
    private HomePropertyInjector homePropertyInjector;

    @Mock
    private AnnotatedElement annotatedElement;

    @Mock
    private DisposalCallbackRegistry disposalCallbackRegistry;

    @BeforeEach
    void setUp() {
        context.load().json("/com/positive/dhl/core/injectors/HomePropertyInjector/content.json", "/content");
    }


    @Test
    void getName() {
        assertEquals("discover-home-property", homePropertyInjector.getName());
    }

    @Test
    void getValue() {
        Resource resource = context.resourceResolver().getResource("/content/home/small-business-advice/article/jcr:content/par/component");
        when(annotatedElement.isAnnotationPresent(any())).thenReturn(true);
        when(pageUtils.getHomePage(any())).thenReturn(context.resourceResolver().getResource("/content/home").adaptTo(Page.class));

        Object result = homePropertyInjector.getValue(resource, "country", String.class, annotatedElement, disposalCallbackRegistry);

        assertEquals("Australia", result);
    }
}