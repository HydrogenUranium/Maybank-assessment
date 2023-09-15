package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.AssetInjector;
import com.positive.dhl.core.injectors.HomePropertyInjector;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
import org.apache.sling.models.spi.Injector;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FooterV2ModelTest {
    private final static String COMPONENT_LOCATION = "/content/home/small-business-advice/article/jcr:content";

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
    private AssetInjector assetInjector;

    @Mock
    private Injector injector;

    @Mock
    private DisposalCallbackRegistry disposalCallbackRegistry;

    @BeforeEach
    void setUp() throws Exception {
        context.registerService(Injector.class, assetInjector);
        context.registerService(AssetUtilService.class, assetUtils);
        context.registerService(Injector.class, homePropertyInjector);
        context.addModelsForClasses(CtaBanner.class);
        context.addModelsForClasses(FooterV2Model.class);
    }

    private void mockHomePage() {
        when(pageUtils.getHomePage(any())).thenReturn(context.resourceResolver().getResource("/content/home").adaptTo(Page.class));
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void test_withProperties() {
        context.load().json("/com/positive/dhl/core/models/FooterV2/withProperties.json", "/content");

        initRequest(COMPONENT_LOCATION );
        mockHomePage();

        FooterV2Model footerV2Model = request.adaptTo(FooterV2Model.class);
        assertEquals("https://www.dhl.com/", footerV2Model.getLogoLink());
        assertEquals("DHL Group", footerV2Model.getLogoTitle());
        assertEquals("Alt Text", footerV2Model.getLogoAltText());
        assertEquals("/content/dam/dhl-discover/common/icons/glo-footer-logo.svg", footerV2Model.getLogoIcon());
        assertEquals("Ready to grow your business?", footerV2Model.getInvitationTitle());
        assertEquals("Join over 5000+ SMEs already growing with Discover", footerV2Model.getInvitationText());
        assertEquals("Get tips and advice", footerV2Model.getPromoText());
        assertEquals("About us", footerV2Model.getCompanyLinks().get(0).getLinkName());
        assertEquals("/content/dhl/about-us", footerV2Model.getCompanyLinks().get(0).getLinkPath());
        assertEquals("Facebook", footerV2Model.getSocialLinks().get(0).getLinkName());
        assertEquals("/content/dam/dhl-discover/common/icons/icon-sc-facebook.svg", footerV2Model.getSocialLinks().get(0).getLinkIcon());
        assertEquals("https://www.facebook.com/", footerV2Model.getSocialLinks().get(0).getLinkPath());
    }

    @Test
    void test_withoutProperties() {
        context.load().json("/com/positive/dhl/core/models/FooterV2/withoutProperties.json", "/content");
        initRequest(COMPONENT_LOCATION );
        mockHomePage();

        FooterV2Model footerV2Model = request.adaptTo(FooterV2Model.class);
        assertNull(footerV2Model.getLogoLink());
        assertNull(footerV2Model.getLogoTitle());
        assertNull(footerV2Model.getLogoAltText());
        assertNull(footerV2Model.getLogoIcon());
        assertNull(footerV2Model.getInvitationTitle());
        assertNull(footerV2Model.getInvitationText());
        assertNull(footerV2Model.getPromoText());
        assertEquals(Collections.emptyList(), footerV2Model.getCompanyLinks());
        assertEquals(Collections.emptyList(), footerV2Model.getSocialLinks());
    }
}