package com.positive.dhl.core.injectors;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.AnnotatedElement;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
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
        MockSlingHttpServletRequest request = context.request();
        request.setPathInfo("/content/home/small-business-advice/article/jcr:content/par/component.html");
        when(annotatedElement.isAnnotationPresent(any())).thenReturn(true);
        when(pageUtils.getHomePage(any(Page.class))).thenReturn(context.resourceResolver().getResource("/content/home").adaptTo(Page.class));

        Object result = homePropertyInjector.getValue(request, "country", String.class, annotatedElement, disposalCallbackRegistry);

        assertEquals("Australia", result);
    }

    @Test
    void getValue_ShouldReturnBoolean_WhenInjectBoolean() {
        MockSlingHttpServletRequest request = context.request();
        request.setPathInfo("/content/home/small-business-advice/article/jcr:content/par/component.html");
        when(annotatedElement.isAnnotationPresent(any())).thenReturn(true);
        when(pageUtils.getHomePage(any(Page.class))).thenReturn(context.resourceResolver().getResource("/content/home").adaptTo(Page.class));

        Object result = homePropertyInjector.getValue(request, "enabled", Boolean.class, annotatedElement, disposalCallbackRegistry);

        assertTrue((Boolean) result);
    }
}