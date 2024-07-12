package com.positive.dhl.core.models;

import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Objects;

import static com.positive.dhl.junitUtils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LandingPageTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

    @Mock
    private PathUtilService pathUtilService;

    @BeforeEach
    void setUp() throws Exception {
        ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.registerService(PageUtilService.class, new PageUtilService());
        ctx.registerService(PathUtilService.class, pathUtilService);
        ctx.addModelsForClasses(LandingPage.class);
    }

    @Test
    void test() {
        ctx.currentResource("/content/dhl/country/en/open-an-account-offer");

        LandingPage LandingPage = ctx.request().adaptTo(LandingPage.class);
        assertNotNull(LandingPage);

        assertEquals("Get up to 10% off your shipping costs", LandingPage.getFullTitle());
        assertEquals("Get up to 10% off your shipping costs", LandingPage.getTitle());
        assertEquals("/content/dam/dhl/landing-pages/new/mobile_towerblock.jpg", LandingPage.getHeroimagemob());
        assertEquals("/content/dam/dhl/landing-pages/new/mobile_towerblock.jpg", LandingPage.getHeroimagetab());
        assertEquals("/content/dam/dhl/landing-pages/new/desktop_towerblock.jpg", LandingPage.getHeroimagedt());
        assertEquals(0, LandingPage.getRelatedArticles().size());

        LandingPage.setFullTitle("");
        LandingPage.setTitle("");
        LandingPage.setHeroimagemob("");
        LandingPage.setHeroimagetab("");
        LandingPage.setHeroimagedt("");
        LandingPage.setRelatedArticles(new ArrayList<Article>());

        assertEquals("", LandingPage.getFullTitle());
        assertEquals("", LandingPage.getTitle());
        assertEquals("", LandingPage.getHeroimagemob());
        assertEquals("", LandingPage.getHeroimagetab());
        assertEquals("", LandingPage.getHeroimagedt());
        assertEquals(0, LandingPage.getRelatedArticles().size());
    }
}