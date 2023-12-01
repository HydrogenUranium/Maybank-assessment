package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mock;

import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LandingPageTwoColumnTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.registerService(PageUtilService.class, new PageUtilService());
	    ctx.addModelsForClasses(LandingPageTwoColumn.class);
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/country/en/open-an-account-offer");

		LandingPageTwoColumn landingPageTwoColumn = ctx.request().adaptTo(LandingPageTwoColumn.class);
        assertNotNull(landingPageTwoColumn);

        assertEquals("Get up to 10% off your shipping costs", landingPageTwoColumn.getFullTitle());
        assertEquals("Get up to 10% off your shipping costs", landingPageTwoColumn.getTitle());
        assertEquals("Start selling to a whole new audience", landingPageTwoColumn.getHerosubtitle());
        assertEquals("/content/dam/dhl/landing-pages/new/mobile_towerblock.jpg", landingPageTwoColumn.getHeroimagemob());
        assertEquals("/content/dam/dhl/landing-pages/new/mobile_towerblock.jpg", landingPageTwoColumn.getHeroimagetab());
        assertEquals("/content/dam/dhl/landing-pages/new/desktop_towerblock.jpg", landingPageTwoColumn.getHeroimagedt());
        assertEquals("<p>Ship today without a DHL Express Account. It’s easy to get started. <br />\r\n" + 
        		"</p>\r\n" + 
        		"", landingPageTwoColumn.getShipNowMessage());
        assertEquals("https://mydhl.express.dhl/us/en/shipping_apps_redirect.html", landingPageTwoColumn.getShipNowUrl());
        assertEquals("", landingPageTwoColumn.getPreselectedCountry());
        assertEquals(1, landingPageTwoColumn.getRelatedArticles().size());

		landingPageTwoColumn.setFullTitle("");
		landingPageTwoColumn.setTitle("");
		landingPageTwoColumn.setHerosubtitle("");
		landingPageTwoColumn.setHeroimagemob("");
		landingPageTwoColumn.setHeroimagetab("");
		landingPageTwoColumn.setHeroimagedt("");
		landingPageTwoColumn.setShipNowMessage("");
		landingPageTwoColumn.setShipNowUrl("");
		landingPageTwoColumn.setPreselectedCountry("");
		landingPageTwoColumn.setRelatedArticles(new ArrayList<Article>());

        assertEquals("", landingPageTwoColumn.getFullTitle());
        assertEquals("", landingPageTwoColumn.getTitle());
        assertEquals("", landingPageTwoColumn.getHerosubtitle());
        assertEquals("", landingPageTwoColumn.getHeroimagemob());
        assertEquals("", landingPageTwoColumn.getHeroimagetab());
        assertEquals("", landingPageTwoColumn.getHeroimagedt());
        assertEquals("", landingPageTwoColumn.getShipNowMessage());
        assertEquals("", landingPageTwoColumn.getShipNowUrl());
        assertEquals("", landingPageTwoColumn.getPreselectedCountry());
        assertEquals(0, landingPageTwoColumn.getRelatedArticles().size());
	}
}