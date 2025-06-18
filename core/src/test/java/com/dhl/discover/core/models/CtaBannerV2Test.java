package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.junitUtils.InjectorMock;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
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
import java.util.function.Function;

import static com.dhl.discover.junitUtils.InjectorMock.INJECT_SCRIPT_BINDINGS;
import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.osgi.framework.Constants.SERVICE_RANKING;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CtaBannerV2Test {

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
        context.load().json("/com/dhl/discover/core/models/CtaBannerV2/content.json", "/content");
        mockInject(context, INJECT_SCRIPT_BINDINGS, "currentStyle", currentStyle);
        mockInject(context, InjectorMock.INJECT_CHILD_IMAGE_MODEL, "mobileImage", mobileImageModel);

        Page currentPage = Objects.requireNonNull(resourceResolver.getResource("/content/ctaBanner")).adaptTo(Page.class);
        context.currentPage(currentPage);
        context.addModelsForClasses(AdaptiveImage.class);
        context.addModelsForClasses(CtaBannerV2.class);

        context.registerAdapter(SlingHttpServletRequest.class, Image.class, (Function<SlingHttpServletRequest, Image>) adaptableRequest -> {
            Image image = mock(Image.class);
            String path = adaptableRequest.getResource().getValueMap().getOrDefault("fileReference", "").toString();
            lenient().when(image.getSrc()).thenReturn(path);
            return image;
        });
        context.registerService(AssetUtilService.class, assetUtilService);

        context.registerService(ModelFactory.class, modelFactory, SERVICE_RANKING, Integer.MAX_VALUE);
        lenient().when(modelFactory.createModelFromWrappedRequest(any(MockSlingHttpServletRequest.class), any(Resource.class), any()))
                .thenAnswer(invocation -> {
                    Resource resource = invocation.getArgument(1);
                    Class<?> modelClass = invocation.getArgument(2);
                    return mockRequest(resource).adaptTo(modelClass);
                });
    }

    private MockSlingHttpServletRequest mockRequest(Resource resource) {
        MockSlingHttpServletRequest mockRequest = new MockSlingHttpServletRequest(context.resourceResolver(), context.bundleContext());
        mockRequest.setResource(resource);
        mockRequest.setPathInfo(resource.getPath());
        return mockRequest;
    }


    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
        context.currentResource(resourceResolver.getResource(path));
    }

    @Test
    void init_ShouldInitPropertiesFromHomePage_WhenTypeIsCustom() {
        initRequest("/content/ctaBanner/small-business-advice/article/jcr:content/root/article_container/body/responsivegrid/cta_banner_custom");
        CtaBannerV2 ctaBannerV2 = request.adaptTo(CtaBannerV2.class);

        assertNotNull(ctaBannerV2);
        assertEquals("CTA Banner Title V2", ctaBannerV2.getTitle());
        assertEquals("CTA Banner V2", ctaBannerV2.getTopTitle());
        assertEquals("/content/test", ctaBannerV2.getButtonLink());
        assertEquals("Buy", ctaBannerV2.getButtonName());
        assertNull(ctaBannerV2.getDesktopImageModel());
        assertNull(ctaBannerV2.getTabletImageModel());
        assertEquals(mobileImageModel, ctaBannerV2.getMobileImageModel());
    }
}