package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;

import javax.jcr.Session;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class MeganavTest {
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
	    ctx.addModelsForClasses(Meganav.class, MeganavPanel.class);
	}

	@Test
	void test() {
        Mockito.when(mockQueryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(page1MockQuery);
		ctx.currentResource("/content/dhl/country/en/ship-now");
		
		Meganav meganav = ctx.request().adaptTo(Meganav.class);
		assertNotNull(meganav);
		assertEquals("E-commerce business & global logistics advice | Discover DHL", meganav.getSiteTitle());
		assertEquals("/content/dhl/country/en.html", meganav.getHomeUrl());
		assertEquals("/content/dhl/search-results.html", meganav.getSearchResultsPage());
		assertEquals("/apps/dhl/discoverdhlapi/tags/index.json", meganav.getAutocompleteUrl());
		assertEquals("/apps/dhl/discoverdhlapi/searchsuggest/index.json", meganav.getTopsearchesUrl());
		assertEquals(3, meganav.getPanels().size());
		assertEquals(5, meganav.getLinksSocial().size());
		
		MeganavPanel meganavPanel = meganav.getPanels().get(0);
		assertEquals(7, meganavPanel.getPanels().size());
		assertEquals(0, meganavPanel.getArticleCategories().size());
		assertEquals(0, meganavPanel.getIndex());
		assertEquals(false, meganavPanel.getCurrent());
		assertNotNull(meganavPanel.getPage());

		assertEquals("/content/dhl/country/en/business.html", meganavPanel.url());
		assertEquals("Business", meganavPanel.navigationTitle());

		meganavPanel.setPanels(new ArrayList<MeganavPanel>());
		meganavPanel.setArticleCategories(new ArrayList<ArticleCategory>());
		meganavPanel.setIndex(0);
		meganavPanel.setCurrent(false);
		meganavPanel.setPage(null);

		assertEquals(0, meganavPanel.getPanels().size());
		assertEquals(0, meganavPanel.getArticleCategories().size());
		assertEquals(0, meganavPanel.getIndex());
		assertEquals(false, meganavPanel.getCurrent());
		assertNull(meganavPanel.getPage());
		
		for (SocialLink socialLink: meganav.getLinksSocial()) {
			switch(socialLink.category) {
	    		case "youtube": 
	    			assertEquals("yt", socialLink.categoryshort());
	    			break;
	    			
	    		case "facebook": 
	    			assertEquals("fb", socialLink.categoryshort());
	    			break;
	    			
	    		case "instagram": 
	    			assertEquals("ig", socialLink.categoryshort());
	    			break;
	    			
	    		case "linkedin": 
	    			assertEquals("li", socialLink.categoryshort());
	    			break;
	    			
	    		case "twitter": 
	    			assertEquals("tw", socialLink.categoryshort());
	    			break;
	    			
	    		default: 
	    			assertEquals("", socialLink.categoryshort());
	    			break;
	    			
			}
		}

		meganav.setSiteTitle("");
		meganav.setHomeUrl("");
		meganav.setSearchResultsPage("");
		meganav.setAutocompleteUrl("");
		meganav.setTopsearchesUrl("");
		meganav.setPanels(new ArrayList<MeganavPanel>());
		meganav.setLinksSocial(new ArrayList<SocialLink>());

		assertEquals("", meganav.getSiteTitle());
		assertEquals("", meganav.getHomeUrl());
		assertEquals("", meganav.getSearchResultsPage());
		assertEquals("", meganav.getAutocompleteUrl());
		assertEquals("", meganav.getTopsearchesUrl());
		assertEquals(0, meganav.getPanels().size());
		assertEquals(0, meganav.getLinksSocial().size());
	}
}
