package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.injectors.HomePropertyInjector;
import com.dhl.discover.core.services.PageUtilService;
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

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HeaderV2ModelTest {
    private final static String PAGE_LOCATION = "/content/home/small-business-advice/article";
    private final static String COMPONENT_LOCATION = PAGE_LOCATION +"/jcr:content/root/header";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    MockSlingHttpServletRequest request = context.request();
    ResourceResolver resolver = context.resourceResolver();

    @Mock
    private PageUtilService pageUtils;

    @InjectMocks
    private HomePropertyInjector homePropertyInjector;

    @BeforeEach
    void setUp() {
        context.registerService(Injector.class, homePropertyInjector);
        context.registerService(PageUtilService.class, pageUtils);
        context.addModelsForClasses(HeaderV2Model.class);
        context.addModelsForClasses(LinkModel.class);
        request.setPathInfo(COMPONENT_LOCATION);
    }

    private void init(String resourcePath) {
        context.load().json(resourcePath, "/content");
        when(pageUtils.getHomePage(any(Page.class))).thenReturn(context.resourceResolver().getResource("/content/home").adaptTo(Page.class));

        Resource resource = resolver.getResource(PAGE_LOCATION);
        Page page = resource.adaptTo(Page.class);
        context.currentPage(page);
    }

    @Test
    void test_withProperties() {
        init("/com/dhl/discover/core/models/HeaderV2/withProperties.json");

        HeaderV2Model headerV2Model = request.adaptTo(HeaderV2Model.class);
        assertEquals("Button Name", headerV2Model.getButtonName());
        assertEquals("switch language", headerV2Model.getSwitchLanguageAriaLabel());
        assertEquals("country filter input", headerV2Model.getCountryFilterInputAriaLabel());
        assertEquals("country selector toggle", headerV2Model.getCountrySelectorToggleAriaLabel());
        assertEquals("/content/dhl/button", headerV2Model.getButtonLink());
        assertEquals("Sign In", headerV2Model.getSignInLabel());
        assertEquals("Categories", headerV2Model.getCategoryLinksLabel());
        assertEquals("Home", headerV2Model.getHomePageLabel());
        assertEquals("... More", headerV2Model.getMoreLinkLabel());
        assertEquals("... Less", headerV2Model.getLessLinkLabel());
        assertEquals("Company", headerV2Model.getCompanyLinksLabel());
        assertEquals("/content/home.html", headerV2Model.getHomePageLink());
        assertEquals("Link Name 1", headerV2Model.getCompanyLinks().get(0).getLinkName());
        assertEquals("/content/dhl/link/1", headerV2Model.getCompanyLinks().get(0).getLinkPath());
        assertEquals("true", headerV2Model.getHideNavigationMenu());
        assertEquals("Search", headerV2Model.getCountrySearchPlaceholder());
        assertEquals("Countries & Regions", headerV2Model.getCountrySelectorTitle());
    }

    @Test
    void test_withoutProperties() {
        init("/com/dhl/discover/core/models/HeaderV2/withoutProperties.json");

        HeaderV2Model headerV2Model = request.adaptTo(HeaderV2Model.class);
        assertNull(headerV2Model.getButtonName());
        assertNull(headerV2Model.getButtonLink());
        assertNull(headerV2Model.getSignInLabel());
        assertNull(headerV2Model.getCategoryLinksLabel());
        assertNull(headerV2Model.getHomePageLabel());
        assertNull(headerV2Model.getCompanyLinksLabel());
        assertEquals("/content/home.html", headerV2Model.getHomePageLink());
        assertEquals(Collections.emptyList(), headerV2Model.getCompanyLinks());
    }
}
