package com.dhl.discover.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class FooterTest {
    private static final String FOOTER_PATH = "/content/dhl/global/en-global/jcr:content/footer";
    private AemContext context = new AemContext();
    private MockSlingHttpServletRequest request = context.request();

    @BeforeEach
    void setUp() {
        context.load().json("/com/dhl/discover/core/models/Footer/content.json", FOOTER_PATH);
        request.setResource(context.resourceResolver().getResource(FOOTER_PATH));
        context.addModelsForClasses(Footer.class);
    }

    @Test
    void testFooter() {
        Footer footer = request.adaptTo(Footer.class);
        assertNotNull(footer);

        assertEquals("/content/dam/dhl/glo-footer-logo.svg", footer.getLogoIcon());
        assertEquals("DHL group", footer.getLogoTitle());
        assertEquals("A logo of DHL Group", footer.getLogoAltText());
        assertEquals("https://www.dhl.com/", footer.getLogoLink());
        assertEquals("Ready to grow your business?", footer.getInvitationTitle());
        assertEquals("Join the Discover community today.", footer.getInvitationText());
        assertEquals("Business and logistics insights to power your SME. If you're looking for ideas, trends or advice to stay ahead of the game, we've got you covered.", footer.getPromoText());
        assertEquals("Categories", footer.getCategoryLinksLabel());
        assertEquals("Company", footer.getCompanyLinksLabel());
        assertEquals("Follow us", footer.getSocialLinksLabel());

        // Validate company links
        List<LinkModel> companyLinks = footer.getCompanyLinks();
        assertNotNull(companyLinks);
        assertEquals(2, companyLinks.size());
        assertEquals("About DHL", companyLinks.get(0).getLinkName());
        assertEquals("https://www.dhl.com/gb-en/home/about-us.html", companyLinks.get(0).getLinkPath());
        assertEquals("contact", companyLinks.get(1).getLinkName());
        assertEquals("/content/dhl/global/en-global/ship-with-dhl/contact", companyLinks.get(1).getLinkPath());

        // Validate social links
        List<LinkModel> socialLinks = footer.getSocialLinks();
        assertNotNull(socialLinks);
        assertEquals(2, socialLinks.size());
        assertEquals("Facebook", socialLinks.get(0).getLinkName());
        assertEquals("/content/dam/dhl/site-image/social-icons/facebook.png", socialLinks.get(0).getLinkIcon());
        assertEquals("https://www.facebook.com/DHLexpress/", socialLinks.get(0).getLinkPath());
        assertEquals("Youku", socialLinks.get(1).getLinkName());
        assertEquals("/content/dam/dhl/site-image/social-icons/youtube.png", socialLinks.get(1).getLinkIcon());
        assertEquals("https://www.youtube.com/user/dhl", socialLinks.get(1).getLinkPath());
    }
}