package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.AssetInjector;
import com.positive.dhl.core.services.AssetUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
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

import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HeroBannerWithSummaryTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private AssetUtilService assetUtils;

    @InjectMocks
    private AssetInjector assetInjector;

    @BeforeEach
    void setUp() throws Exception {
        when(assetUtils.resolvePath(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            if(path.isBlank()) {
                return "";
            }
            return "/prefix" + invocationOnMock.getArgument(0, String.class);
        });
        context.load().json("/com/positive/dhl/core/models/HeroBannerWithSummary/content.json", "/content");
        mockInject(context, "currentPage", resourceResolver.getResource("/content/article").adaptTo(Page.class));
        context.registerService(Injector.class, assetInjector);
        context.registerService(AssetUtilService.class, assetUtils);
        context.addModelsForClasses(HeroBannerWithSummary.class);
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void init_shouldInitPropertiesFromPage_whenBackgroundIsNotConfigured() {
        initRequest("/content/article/jcr:content/root/article_container/body/hero_banner_with_sum");
        HeroBannerWithSummary heroBannerWithSummary = request.adaptTo(HeroBannerWithSummary.class);

        assertNotNull(heroBannerWithSummary);
        assertEquals("Key Takeaways", heroBannerWithSummary.getSummaryTitle());
        assertEquals(3, heroBannerWithSummary.getPoints().size());
        assertEquals("A key takeaway from the article will come here which summarises the article in a succinct way", heroBannerWithSummary.getPoints().get(0));
        assertEquals("It will make the reader curious to read the whole article", heroBannerWithSummary.getPoints().get(1));
        assertEquals("And if they are in a hurry, they will still be able to get a quick summary anyway", heroBannerWithSummary.getPoints().get(2));
        assertEquals("/prefix/heroimagedt.jpg", heroBannerWithSummary.getDesktopBackgroundImage());
        assertEquals("/prefix/heroimagetab.jpg", heroBannerWithSummary.getTabletBackgroundImage());
        assertEquals("/prefix/heroimagemob.jpg", heroBannerWithSummary.getMobileBackgroundImage());
    }

    @Test
    void init_shouldInitPropertiesFromComponent_whenBackgroundIsConfigured() {
        initRequest("/content/article/jcr:content/root/article_container/body/hero_banner_with_sum_custom_config");
        HeroBannerWithSummary heroBannerWithSummary = request.adaptTo(HeroBannerWithSummary.class);

        assertNotNull(heroBannerWithSummary);
        assertEquals("Key Takeaways", heroBannerWithSummary.getSummaryTitle());
        assertEquals(3, heroBannerWithSummary.getPoints().size());
        assertEquals("A key takeaway from the article will come here which summarises the article in a succinct way", heroBannerWithSummary.getPoints().get(0));
        assertEquals("It will make the reader curious to read the whole article", heroBannerWithSummary.getPoints().get(1));
        assertEquals("And if they are in a hurry, they will still be able to get a quick summary anyway", heroBannerWithSummary.getPoints().get(2));
        assertEquals("/prefix/desktop.jpg", heroBannerWithSummary.getDesktopBackgroundImage());
        assertEquals("/prefix/tablet.jpg", heroBannerWithSummary.getTabletBackgroundImage());
        assertEquals("/prefix/mobile.jpg", heroBannerWithSummary.getMobileBackgroundImage());
    }
}