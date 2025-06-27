package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.junitUtils.InjectorMock;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Objects;

import static com.dhl.discover.junitUtils.InjectorMock.INJECT_SCRIPT_BINDINGS;
import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.osgi.framework.Constants.SERVICE_RANKING;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CtaBannerWithPointsV2Test {

    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private ModelFactory modelFactory;

    @Mock
    private Style currentStyle;

    @Mock
    private AssetUtilService assetUtilService;

    @Mock
    private Image mobileImageModel;

    @BeforeEach
    void setUp() {
        context.load().json("/com/dhl/discover/core/models/CtaBannerWithPointsV2/content.json", "/content");
        mockInject(context, InjectorMock.INJECT_CHILD_IMAGE_MODEL, "mobileImage", mobileImageModel);
        mockInject(context, INJECT_SCRIPT_BINDINGS, "currentStyle", currentStyle);

        Page currentPage = Objects.requireNonNull(resourceResolver.getResource("/content/ctaBanner")).adaptTo(Page.class);
        context.currentPage(currentPage);
        context.addModelsForClasses(AdaptiveImage.class);
        context.addModelsForClasses(CtaBannerWithPointsV2.class);

        context.registerService(AssetUtilService.class, assetUtilService);
        context.registerService(ModelFactory.class, modelFactory, SERVICE_RANKING, Integer.MAX_VALUE);
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
        context.currentResource(resourceResolver.getResource(path));
    }

    @Test
    void init_ShouldInitPropertiesFromHomePage_WhenTypeIsCustom() {
        initRequest("/content/ctaBanner/small-business-advice/article/jcr:content/root/article_container/body/responsivegrid/cta_banner_custom");
        CtaBannerWithPointsV2 ctaBannerV2 = request.adaptTo(CtaBannerWithPointsV2.class);

        assertNotNull(ctaBannerV2);
        assertEquals("CTA Banner with Points V2", ctaBannerV2.getTitle());
        assertEquals("Buy", ctaBannerV2.getButtonName());
        assertEquals("P1", ctaBannerV2.getPoints().get(0).getText());
        assertNull(ctaBannerV2.getDesktopImageModel());
        assertNull(ctaBannerV2.getTabletImageModel());
        assertEquals(mobileImageModel, ctaBannerV2.getMobileImageModel());
    }
}