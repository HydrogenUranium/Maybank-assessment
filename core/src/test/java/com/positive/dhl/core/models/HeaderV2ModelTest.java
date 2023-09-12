package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.AssetInjector;
import com.positive.dhl.core.injectors.HomePropertyInjector;
import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HeaderV2ModelTest {
    private final static String COMPONENT_LOCATION = "/content/home/small-business-advice/article/jcr:content/root/header";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    MockSlingHttpServletRequest request = context.request();

    @Mock
    private PageUtilService pageUtils;

    @InjectMocks
    private HomePropertyInjector homePropertyInjector;

    @InjectMocks
    private AssetInjector assetInjector;

    @Mock
    private Injector injector;

    @BeforeEach
    void setUp() {
        context.registerService(Injector.class, assetInjector);
        context.registerService(Injector.class, homePropertyInjector);
        context.registerService(PageUtilService.class, pageUtils);
        context.addModelsForClasses(CtaBanner.class);
        mockType("businessAccount");
        context.registerService(Injector.class, injector);
        request.setPathInfo(COMPONENT_LOCATION);
    }

    private void mockType(String type) {
        when(injector.getValue(any(), anyString(), any(), any(), any())).thenReturn(null);
        when(injector.getName()).thenReturn("adaptable");
        lenient().when(injector.getValue(any(), eq("type"), any(), any(), any())).thenReturn(type);
        context.registerService(Injector.class, injector);
    }

    @Test
    void test_withProperties() {
        context.load().json("/com/positive/dhl/core/models/HeaderV2/withProperties.json", "/content");
        when(pageUtils.getHomePage(any())).thenReturn(context.resourceResolver().getResource("/content/home").adaptTo(Page.class));

        HeaderV2Model headerV2Model = request.adaptTo(HeaderV2Model.class);
        assertEquals("Button Name", headerV2Model.getButtonName());
        assertEquals("/content/dhl/button", headerV2Model.getButtonLink());
        assertEquals("/content/home.html", headerV2Model.getHomePageLink());
        assertEquals("Link Name 1", headerV2Model.getCompanyLinks().get(0).getLinkName());
        assertEquals("/content/dhl/link/1", headerV2Model.getCompanyLinks().get(0).getLinkPath());
    }

    @Test
    void test_withoutProperties() {
        context.load().json("/com/positive/dhl/core/models/HeaderV2/withoutProperties.json", "/content");
        when(pageUtils.getHomePage(any())).thenReturn(context.resourceResolver().getResource("/content/home").adaptTo(Page.class));

        HeaderV2Model headerV2Model = request.adaptTo(HeaderV2Model.class);
        assertNull(headerV2Model.getButtonName());
        assertNull(headerV2Model.getButtonLink());
        assertEquals("/content/home.html", headerV2Model.getHomePageLink());
        assertEquals(Collections.emptyList(), headerV2Model.getCompanyLinks());
    }
}
