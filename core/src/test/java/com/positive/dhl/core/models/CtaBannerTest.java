package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.AssetInjector;
import com.positive.dhl.core.injectors.HomeAssetPropertyInjector;
import com.positive.dhl.core.injectors.HomePropertyInjector;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.spi.Injector;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CtaBannerTest {
    private final static String COMPONENT_LOCATION = "/content/home/small-business-advice/article/jcr:content/root/article_container/body/responsivegrid";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private AssetUtilService assetUtils;

    @Mock
    private PageUtilService pageUtils;

    @InjectMocks
    private HomePropertyInjector homePropertyInjector;

    @InjectMocks
    private HomeAssetPropertyInjector homeAssetPropertyInjector;

    @InjectMocks
    private AssetInjector assetInjector;

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/positive/dhl/core/models/CtaBanner/content.json", "/content");
        when(assetUtils.resolvePath(anyString())).thenAnswer(invocationOnMock -> "/prefix" + invocationOnMock.getArgument(0, String.class));
        context.registerService(Injector.class, assetInjector);
        context.registerService(AssetUtilService.class, assetUtils);
        context.registerService(Injector.class, homePropertyInjector);
        context.registerService(Injector.class, homeAssetPropertyInjector);
        context.addModelsForClasses(CtaBannerWithPoints.class);
    }

    private void mockHomePage() {
        when(pageUtils.getHomePage(any())).thenReturn(resourceResolver.getResource("/content/home").adaptTo(Page.class));
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void init_ShouldInitPropertiesFromHomePage_WhenTypeIsSubscribe() {
        initRequest(COMPONENT_LOCATION + "/cta_banner_subscribeNewsletter");
        mockHomePage();

        CtaBanner ctaBanner = request.adaptTo(CtaBanner.class);

        assertEquals("Subscribe To Our Newsletter", ctaBanner.getTitle());
        assertEquals("Stay In The Loop!", ctaBanner.getTopTitle());
        assertEquals("/content/dhl/openBusinessAccount", ctaBanner.getButtonLink());
        assertEquals("Subscribe", ctaBanner.getButtonName());
        assertEquals("/prefix/content/dam/images/desktop.jpg", ctaBanner.getDesktopBackgroundImage());
        assertEquals("/prefix/content/dam/images/tablet.jpg", ctaBanner.getTabletBackgroundImage());
        assertEquals("/prefix/content/dam/images/mobile.jpg", ctaBanner.getMobileBackgroundImage());
    }

    @Test
    void init_ShouldInitPropertiesFromHomePage_WhenTypeIsCustom() {
        Resource resource = context.resourceResolver().getResource(COMPONENT_LOCATION + "/cta_banner_custom");

        CtaBanner ctaBanner = resource.adaptTo(CtaBanner.class);

        assertEquals("CTA BANNER", ctaBanner.getTitle());
        assertEquals("Custom Top Title", ctaBanner.getTopTitle());
        assertEquals("/content/test", ctaBanner.getButtonLink());
        assertEquals("Buy", ctaBanner.getButtonName());
        assertEquals("/prefix/content/dam/images/desktop.jpg", ctaBanner.getDesktopBackgroundImage());
        assertEquals("/prefix/content/dam/images/tablet.jpg", ctaBanner.getTabletBackgroundImage());
        assertEquals("/prefix/content/dam/images/mobile.jpg", ctaBanner.getMobileBackgroundImage());
    }
}