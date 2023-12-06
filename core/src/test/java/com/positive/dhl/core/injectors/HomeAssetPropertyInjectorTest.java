package com.positive.dhl.core.injectors;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.AnnotatedElement;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HomeAssetPropertyInjectorTest {
    private final AemContext context = new AemContext();

    @Mock
    private PageUtilService pageUtils;

    @Mock
    private PathUtilService pathUtilService;

    @InjectMocks
    private HomeAssetPropertyInjector homeAssetPropertyInjector;

    @Mock
    private AnnotatedElement annotatedElement;

    @Mock
    private DisposalCallbackRegistry disposalCallbackRegistry;

    @BeforeEach
    void setUp() {
        context.load().json("/com/positive/dhl/core/injectors/HomeAssetPropertyInjector/content.json", "/content");
    }

    @Test
    void getName() {
        assertEquals("discover-home-asset-property", homeAssetPropertyInjector.getName());
    }

    @Test
    void getValue() {
        MockSlingHttpServletRequest request = context.request();
        request.setPathInfo("/content/home/small-business-advice/article/jcr:content/par/component.html");
        when(annotatedElement.isAnnotationPresent(any())).thenReturn(true);
        when(pageUtils.getHomePage(any())).thenReturn(context.resourceResolver().getResource("/content/home").adaptTo(Page.class));
        when(pathUtilService.resolveAssetPath(any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/prefix" + invocationOnMock.getArgument(0, String.class) : "";
        });

        Object result = homeAssetPropertyInjector.getValue(request, "image", String.class, annotatedElement, disposalCallbackRegistry);

        assertEquals("/prefix/content/dam/image.png", result);
    }
}