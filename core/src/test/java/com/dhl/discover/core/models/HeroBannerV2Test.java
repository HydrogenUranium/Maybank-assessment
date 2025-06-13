package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.AssetUtilService;
import com.adobe.cq.wcm.core.components.models.Image;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.osgi.framework.Constants.SERVICE_RANKING;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HeroBannerV2Test {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private ModelFactory modelFactory;

    @Mock
    private Style currentStyle;

    @Mock
    private AssetUtilService assetUtilService;

    @BeforeEach
    void setUp() {
        context.load().json("/com/dhl/discover/core/models/HeroBannerV2/content.json", "/content");
        mockInject(context, INJECT_SCRIPT_BINDINGS, "currentStyle", currentStyle);

        Page currentPage = Objects.requireNonNull(resourceResolver.getResource("/content/article")).adaptTo(Page.class);
        context.currentPage(currentPage);
        context.addModelsForClasses(AdaptiveImage.class);
        context.addModelsForClasses(HeroBannerV2.class);

        context.registerAdapter(SlingHttpServletRequest.class, Image.class, (Function<SlingHttpServletRequest, Image>) adaptableRequest -> {
            Image image = mock(Image.class);
            String path = adaptableRequest.getResource().getValueMap().getOrDefault("fileReference", "").toString();
            lenient().when(image.getSrc()).thenReturn(path);
            return image;
        });
        context.registerService(AssetUtilService.class, assetUtilService);

        when(currentStyle.get("margin",false)).thenReturn(true);
        when(currentStyle.get("keyTakeaways", false)).thenReturn(true);
        when(currentStyle.get("roundedCorners", false)).thenReturn(true);
        when(currentStyle.get("enableAssetDelivery", false)).thenReturn(true);

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
    void init_shouldInitPropertiesFromPage() {
        initRequest("/content/article/jcr:content/root/article_container/body/hero_banner");

        HeroBannerV2 heroBanner = request.adaptTo(HeroBannerV2.class);

        assertNotNull(heroBanner);
        assertEquals("Key Takeaways", heroBanner.getSummaryTitle());
        assertEquals(3, heroBanner.getSummaryPoints().size());
        assertEquals("A key takeaway from the article will come here which summarises the article in a succinct way", heroBanner.getSummaryPoints().get(0).getText());
        assertEquals("It will make the reader curious to read the whole article", heroBanner.getSummaryPoints().get(1).getText());
        assertEquals("And if they are in a hurry, they will still be able to get a quick summary anyway", heroBanner.getSummaryPoints().get(2).getText());
        assertNull(heroBanner.getDesktopImageModel());
        assertNull(heroBanner.getTabletImageModel());
        assertEquals("/mobile-image.jpg", heroBanner.getMobileImageModel().getSrc());
        assertTrue(heroBanner.isMargin());
        assertTrue(heroBanner.isKeyTakeaways());
        assertTrue(heroBanner.isRoundedCorners());
        assertTrue(heroBanner.isEnableAssetDelivery());
    }

    @Test
    void init_shouldInitVideoProperties() {
        when(currentStyle.get("keyTakeaways", false)).thenReturn(false);
        when(assetUtilService.getMimeType(anyString())).thenReturn("mp4");
        initRequest("/content/article/jcr:content/root/article_container/body/hero_banner_with_video_config");
        HeroBannerV2 heroBanner = request.adaptTo(HeroBannerV2.class);

        assertNotNull(heroBanner);
        assertTrue(heroBanner.isUseVideo());
        assertEquals("/video.mp4", heroBanner.getVideo());
        assertEquals("mp4", heroBanner.getVideoMimeType());
        assertTrue(heroBanner.isMargin());
        assertFalse(heroBanner.isKeyTakeaways());
        assertTrue(heroBanner.isRoundedCorners());
    }
}
