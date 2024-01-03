package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.policies.ContentPolicy;
import com.day.cq.wcm.api.policies.ContentPolicyManager;
import com.positive.dhl.core.injectors.AssetInjector;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.spi.Injector;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HeroBannerTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private PathUtilService pathUtilService;

    @InjectMocks
    private AssetInjector assetInjector;

    @Mock
    private ContentPolicyManager contentPolicyManager;

    @Mock
    private ContentPolicy contentPolicy;

    @Mock
    private ValueMap valueMap;

    @BeforeEach
    void setUp() throws Exception {
        lenient().when(pathUtilService.resolveAssetPath(any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/prefix" + invocationOnMock.getArgument(0, String.class) : "";
        });
        context.load().json("/com/positive/dhl/core/models/HeroBanner/content.json", "/content");
        mockInject(context, "currentPage", resourceResolver.getResource("/content/article").adaptTo(Page.class));
        context.registerService(Injector.class, assetInjector);
        context.registerService(PathUtilService.class, pathUtilService);
        context.addModelsForClasses(HeroBanner.class);

        context.registerAdapter(ResourceResolver.class, ContentPolicyManager.class, contentPolicyManager);
        when(contentPolicyManager.getPolicy(any(Resource.class))).thenReturn(contentPolicy);

        when(contentPolicy.getProperties()).thenReturn(valueMap);
        when(valueMap.get("margin",false)).thenReturn(true);
        when(valueMap.get("inheritImage", false)).thenReturn(true);
        when(valueMap.get("keyTakeaways", false)).thenReturn(true);
        when(valueMap.get("roundedCorners", false)).thenReturn(true);
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void init_shouldInitPropertiesFromPage_whenInheritImage() {
        initRequest("/content/article/jcr:content/root/article_container/body/hero_banner_with_sum");
        HeroBanner heroBanner = request.adaptTo(HeroBanner.class);

        assertNotNull(heroBanner);
        assertEquals("Key Takeaways", heroBanner.getSummaryTitle());
        assertEquals(3, heroBanner.getPoints().size());
        assertEquals("A key takeaway from the article will come here which summarises the article in a succinct way", heroBanner.getPoints().get(0));
        assertEquals("It will make the reader curious to read the whole article", heroBanner.getPoints().get(1));
        assertEquals("And if they are in a hurry, they will still be able to get a quick summary anyway", heroBanner.getPoints().get(2));
        assertEquals("/prefix/heroimagedt.jpg", heroBanner.getDesktopBackgroundImage());
        assertEquals("/prefix/heroimagetab.jpg", heroBanner.getTabletBackgroundImage());
        assertEquals("/prefix/heroimagemob.jpg", heroBanner.getMobileBackgroundImage());
        assertTrue(heroBanner.isMargin());
        assertTrue(heroBanner.isInheritImage());
        assertTrue(heroBanner.isKeyTakeaways());
        assertTrue(heroBanner.isRoundedCorners());
    }

    @Test
    void init_shouldInitProperties_whenCustomImageConfig() {
        when(valueMap.get("inheritImage", false)).thenReturn(false);
        when(valueMap.get("keyTakeaways", false)).thenReturn(false);
        initRequest("/content/article/jcr:content/root/article_container/body/hero_banner_with_custom_image_config");
        HeroBanner heroBanner = request.adaptTo(HeroBanner.class);

        assertNotNull(heroBanner);
        assertEquals("/prefix/desktop.jpg", heroBanner.getDesktopBackgroundImage());
        assertEquals("/prefix/tablet.jpg", heroBanner.getTabletBackgroundImage());
        assertEquals("/prefix/mobile.jpg", heroBanner.getMobileBackgroundImage());
        assertTrue(heroBanner.isMargin());
        assertFalse(heroBanner.isInheritImage());
        assertFalse(heroBanner.isKeyTakeaways());
        assertTrue(heroBanner.isRoundedCorners());
    }
}