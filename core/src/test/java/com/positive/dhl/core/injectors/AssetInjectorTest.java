package com.positive.dhl.core.injectors;

import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
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
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class AssetInjectorTest {
    private final AemContext context = new AemContext();

    @Mock
    private PathUtilService pathUtilService;

    @InjectMocks
    private AssetInjector assetInjector;

    @Mock
    private AnnotatedElement annotatedElement;

    @Mock
    private DisposalCallbackRegistry disposalCallbackRegistry;

    @BeforeEach
    void setUp() {
        context.load().json("/com/positive/dhl/core/injectors/AssetInjector/content.json", "/content");
    }

    @Test
    void getName() {
        assertEquals("discover-asset", assetInjector.getName());
    }

    @Test
    void getValue() {
        Resource resource = context.resourceResolver().getResource("/content/component");
        when(pathUtilService.resolveAssetPath(any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/prefix" + invocationOnMock.getArgument(0, String.class) : "";
        });
        when(annotatedElement.isAnnotationPresent(any())).thenReturn(true);

        Object result = assetInjector.getValue(resource, "heroimagedt", String.class, annotatedElement, disposalCallbackRegistry);

        assertEquals("/prefix/content/dam/desktop.jpg", result);
    }
}