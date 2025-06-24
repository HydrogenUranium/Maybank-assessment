package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.dhl.discover.junitUtils.InjectorMock;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class AdaptiveImageTest {
    private AemContext context = new AemContext();

    @Mock
    private Image defaultImageModel;

    @Mock
    private Image mobileImageModel;

    @Mock
    private Image tabletImageModel;

    @Mock
    private Image desktopImageModel;

    @Test
    void testAdaptiveImageModels() {
        mockInject(context, InjectorMock.INJECT_SELF, "defaultImageModel", defaultImageModel);
        mockInject(context, InjectorMock.INJECT_CHILD_IMAGE_MODEL, Map.of(
                "mobileImage", mobileImageModel,
                "tabletImage", tabletImageModel,
                "desktopImage", desktopImageModel
        ));

        AdaptiveImage adaptiveImage = context.request().adaptTo(AdaptiveImage.class);

        assertNotNull(adaptiveImage);
        assertEquals(defaultImageModel, adaptiveImage.getDefaultImageModel());
        assertEquals(mobileImageModel, adaptiveImage.getMobileImageModel());
        assertEquals(tabletImageModel, adaptiveImage.getTabletImageModel());
        assertEquals(desktopImageModel, adaptiveImage.getDesktopImageModel());
    }
}