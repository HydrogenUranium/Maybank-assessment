package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.positive.dhl.junitUtils.InjectorMock.INJECT_SCRIPT_BINDINGS;
import static com.positive.dhl.junitUtils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HeroBannerTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private Style currentStyle;

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/positive/dhl/core/models/HeroBanner/content.json", "/content");
        mockInject(context, INJECT_SCRIPT_BINDINGS, "currentStyle", currentStyle);
        mockInject(context, "currentPage", resourceResolver.getResource("/content/article").adaptTo(Page.class));
        context.addModelsForClasses(HeroBanner.class);

        when(currentStyle.get("margin",false)).thenReturn(true);
        when(currentStyle.get("inheritImage", false)).thenReturn(true);
        when(currentStyle.get("keyTakeaways", false)).thenReturn(true);
        when(currentStyle.get("roundedCorners", false)).thenReturn(true);
        when(currentStyle.get("enableAssetDelivery", false)).thenReturn(true);
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
        assertEquals("/heroimagedt.jpg", heroBanner.getDesktopBackgroundImage());
        assertEquals("/heroimagetab.jpg", heroBanner.getTabletBackgroundImage());
        assertEquals("/heroimagemob.jpg", heroBanner.getMobileBackgroundImage());
        assertTrue(heroBanner.isMargin());
        assertTrue(heroBanner.isInheritImage());
        assertTrue(heroBanner.isKeyTakeaways());
        assertTrue(heroBanner.isRoundedCorners());
    }

    @Test
    void init_shouldInitProperties_whenCustomImageConfig() {
        when(currentStyle.get("inheritImage", false)).thenReturn(false);
        when(currentStyle.get("keyTakeaways", false)).thenReturn(false);
        initRequest("/content/article/jcr:content/root/article_container/body/hero_banner_with_custom_image_config");
        HeroBanner heroBanner = request.adaptTo(HeroBanner.class);

        assertNotNull(heroBanner);
        assertEquals("/desktop.jpg", heroBanner.getDesktopBackgroundImage());
        assertEquals("/tablet.jpg", heroBanner.getTabletBackgroundImage());
        assertEquals("/mobile.jpg", heroBanner.getMobileBackgroundImage());
        assertTrue(heroBanner.isMargin());
        assertFalse(heroBanner.isInheritImage());
        assertFalse(heroBanner.isKeyTakeaways());
        assertTrue(heroBanner.isRoundedCorners());
    }
}