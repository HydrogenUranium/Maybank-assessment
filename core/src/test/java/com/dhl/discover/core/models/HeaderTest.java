package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMException;
import com.dhl.discover.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class HeaderTest {
    private final static String HEADER_PATH = "/content/dhl/global/en-global/jcr:content/header";
    private AemContext context = new AemContext();
    private MockSlingHttpServletRequest request = context.request();

    @Mock
    private PageUtilService pageUtilService;

    private Page homePage;

    @BeforeEach
    void setUp() {
        request.setResource(context.resourceResolver().getResource(HEADER_PATH));
        context.registerService(PageUtilService.class, pageUtilService);
        context.addModelsForClasses(Header.class);
        homePage = context.create().page("/content/dhl/global/en-global");
        context.load().json("/com/dhl/discover/core/models/Header/content.json", HEADER_PATH);
        context.currentPage(homePage);
        request.setResource(context.resourceResolver().getResource(HEADER_PATH));
    }

    @Test
    void testHeader() {
        when(pageUtilService.getHomePage(any(Page.class))).thenReturn(homePage);

        Header header = request.adaptTo(Header.class);
        assertNotNull(header);

        // Validate basic properties
        assertEquals("Apply for a Business Account", header.getButtonName());
        assertEquals("/content/dhl/global/en-global/open-an-account", header.getButtonLink());
        assertEquals("", header.getSignInLabel());
        assertEquals("Country Selector Toggle", header.getCountrySelectorToggleAriaLabel());
        assertEquals("Switch Language to", header.getSwitchLanguageAriaLabel());
        assertEquals("Country Filter Input", header.getCountryFilterInputAriaLabel());
        assertEquals("Categories", header.getCategoryLinksLabel());
        assertEquals("Home", header.getHomePageLabel());
        assertEquals("More", header.getMoreLinkLabel());
        assertEquals("Less", header.getLessLinkLabel());
        assertEquals("Company", header.getCompanyLinksLabel());
        assertEquals("Search", header.getCountrySearchPlaceholder());
        assertEquals("Countries & Regions", header.getCountrySelectorTitle());

        // Validate company links
        List<LinkModel> companyLinks = header.getCompanyLinks();
        assertNotNull(companyLinks);
        assertEquals(1, companyLinks.size());
        assertEquals("Contact us", companyLinks.get(0).getLinkName());
        assertEquals("/content/dhl/global/en-global/ship-with-dhl/contact", companyLinks.get(0).getLinkPath());

        // Validate navigation menu visibility
        assertFalse(header.isHideNavigationMenu());

        // Validate generated home page link
        String expectedHomePageLink = "/content/dhl/global/en-global.html"; // Assuming the currentPage is set appropriately
        assertEquals(expectedHomePageLink, header.getHomePageLink());
    }
}