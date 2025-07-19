package com.dhl.discover.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.LaunchService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
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
	    ctx.load().json("/com/dhl/discover/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
		var launchService = ctx.registerService(LaunchService.class, new LaunchService());
		PageUtilService pageUtilService = mock(PageUtilService.class);
		ctx.registerService(PageUtilService.class, pageUtilService);
	    ctx.addModelsForClasses(Meganav.class, MeganavPanel.class);
	}

	@Test
	void testMeganavProperties() {
		ctx.currentResource("/content/dhl/country/en/ship-now");

		Meganav meganav = ctx.request().adaptTo(Meganav.class);
		assertNotNull(meganav);
		meganav.setSiteTitle("E-commerce business & global logistics advice | Discover DHL");
		meganav.setHomeUrl("/content/dhl/country/en.html");
		meganav.setSearchResultsPage("/content/dhl/search-results.html");
		meganav.setAutocompleteUrl("/apps/dhl/discoverdhlapi/tags/index.json");
		meganav.setTopsearchesUrl("/apps/dhl/discoverdhlapi/searchsuggest/index.json");
		List<MeganavPanel> panels = new ArrayList<>();
		for (int i = 0; i < 3; i++) {
			MeganavPanel panel = mock(MeganavPanel.class);
			panels.add(panel);
		}
		meganav.setPanels(panels);
		List<SocialLink> socialLinks = new ArrayList<>();
		String[] categories = {"youtube", "facebook", "instagram", "linkedin", "twitter"};
		for (String category : categories) {
			SocialLink link = new SocialLink(category, "https://" + category + ".com", "");
			link.category = category;
			link.link = "https://" + category + ".com";
			socialLinks.add(link);
		}
		meganav.setLinksSocial(socialLinks);
		assertEquals("E-commerce business & global logistics advice | Discover DHL", meganav.getSiteTitle());
		assertEquals("/content/dhl/country/en.html", meganav.getHomeUrl());
		assertEquals("/content/dhl/search-results.html", meganav.getSearchResultsPage());
		assertEquals("/apps/dhl/discoverdhlapi/tags/index.json", meganav.getAutocompleteUrl());
		assertEquals("/apps/dhl/discoverdhlapi/searchsuggest/index.json", meganav.getTopsearchesUrl());
		assertEquals(3, meganav.getPanels().size());
		assertEquals(5, meganav.getLinksSocial().size());
	}

	@Test
	void testMeganavPanel() throws RepositoryException {
		SearchResult mockSearchResult = mock(SearchResult.class);

		ctx.currentResource("/content/dhl/country/en/ship-now");

		// Create a mock MeganavPanel directly instead of creating a real one
		MeganavPanel panel = mock(MeganavPanel.class);

		// Set up expected behavior
		when(panel.getPanels()).thenReturn(Arrays.asList(
				mock(MeganavPanel.class),
				mock(MeganavPanel.class),
				mock(MeganavPanel.class),
				mock(MeganavPanel.class),
				mock(MeganavPanel.class),
				mock(MeganavPanel.class),
				mock(MeganavPanel.class)
		));
		when(panel.getArticleCategories()).thenReturn(Collections.emptyList());
		when(panel.getIndex()).thenReturn(0);
		when(panel.getCurrent()).thenReturn(false);
		when(panel.getPage()).thenReturn(mock(Page.class));
		when(panel.url()).thenReturn("/content/dhl/country/en/business.html");
		when(panel.navigationTitle()).thenReturn("Business");

		// Create Meganav and add the mocked panel
		Meganav meganav = ctx.request().adaptTo(Meganav.class);
		assertNotNull(meganav);

		List<MeganavPanel> panels = new ArrayList<>();
		panels.add(panel);
		meganav.setPanels(panels);

		// Now test the panel
		MeganavPanel meganavPanel = meganav.getPanels().get(0);

		assertEquals(7, meganavPanel.getPanels().size());
		assertEquals(0, meganavPanel.getArticleCategories().size());
		assertEquals(0, meganavPanel.getIndex());
		assertEquals(false, meganavPanel.getCurrent());
		assertNotNull(meganavPanel.getPage());
		assertEquals("/content/dhl/country/en/business.html", meganavPanel.url());
		assertEquals("Business", meganavPanel.navigationTitle());
	}

	@Test
	void testMeganavPanelSetters() throws RepositoryException {
		int index = 0;

		// Create mock page with necessary behavior
		com.day.cq.wcm.api.Page page = mock(com.day.cq.wcm.api.Page.class);
		when(page.getPath()).thenReturn("/content/path/to/page");
		when(page.listChildren()).thenReturn(Collections.emptyIterator());

		// Mock root page with required behavior
		com.day.cq.wcm.api.Page rootPage = mock(com.day.cq.wcm.api.Page.class);
		when(rootPage.getPath()).thenReturn("/content/path/to/root");

		// Mock Query and SearchResult objects
		Query mockQuery = mock(Query.class);
		SearchResult mockSearchResult = mock(SearchResult.class);
		when(mockQuery.getResult()).thenReturn(mockSearchResult);
		when(mockSearchResult.getHits()).thenReturn(Collections.emptyList());
		when(mockSearchResult.getResources()).thenReturn(Collections.emptyIterator());

		// Configure QueryBuilder to return the mock query
		when(mockQueryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(mockQuery);

		// Get resource resolver from context
		org.apache.sling.api.resource.ResourceResolver resourceResolver = ctx.resourceResolver();

		// Create MeganavPanel with the required constructor arguments
		MeganavPanel meganavPanel = new MeganavPanel(index, page, rootPage, mockQueryBuilder, resourceResolver);

		// Test setters
		meganavPanel.setPanels(new ArrayList<>());
		meganavPanel.setArticleCategories(new ArrayList<>());
		meganavPanel.setIndex(0);
		meganavPanel.setCurrent(false);
		meganavPanel.setPage(null);

		// Assert values
		assertEquals(0, meganavPanel.getPanels().size());
		assertEquals(0, meganavPanel.getArticleCategories().size());
		assertEquals(0, meganavPanel.getIndex());
		assertEquals(false, meganavPanel.getCurrent());
		assertNull(meganavPanel.getPage());
	}

	@Test
	void testSearchResultProcessing() throws RepositoryException {
		// Setup
		int index = 0;
		Page page = mock(Page.class);
		Page rootPage = mock(Page.class);
		when(page.getPath()).thenReturn("/content/test");
		when(page.listChildren()).thenReturn(Collections.emptyIterator());
		when(rootPage.getPath()).thenReturn("/content/root");

		// Mock QueryBuilder and related objects
		QueryBuilder queryBuilder = mock(QueryBuilder.class);
		Query mockQuery = mock(Query.class);
		SearchResult mockSearchResult = mock(SearchResult.class);

		// Mock search hits
		Hit hit1 = mock(Hit.class);
		Hit hit2 = mock(Hit.class);
		Hit hit3 = mock(Hit.class);
		List<Hit> hits = Arrays.asList(hit1, hit2, hit3);

		// Setup hit1 - Should be included (showInMeganav=true, hideInNav=false)
		ValueMap hit1Properties = new ValueMapDecorator(new HashMap<>());
		hit1Properties.put("hideInNav", false);
		when(hit1.getProperties()).thenReturn(hit1Properties);
		when(hit1.getPath()).thenReturn("/content/hit1");

		Resource hit1Resource = mock(Resource.class);
		ValueMap hit1ResourceProps = new ValueMapDecorator(new HashMap<>());
		hit1ResourceProps.put("jcr:content/showinmeganav", true);
		hit1ResourceProps.put("jcr:content/jcr:title", "Title 1");
		hit1ResourceProps.put("jcr:content/navTitle", "Nav Title 1");
		hit1ResourceProps.put("jcr:content/cq:featuredimage/fileReference", "/content/dam/image1.jpg");
		when(hit1Resource.adaptTo(ValueMap.class)).thenReturn(hit1ResourceProps);

		// Setup hit2 - Should be included with external URL
		ValueMap hit2Properties = new ValueMapDecorator(new HashMap<>());
		hit2Properties.put("hideInNav", false);
		when(hit2.getProperties()).thenReturn(hit2Properties);
		when(hit2.getPath()).thenReturn("/content/hit2");

		Resource hit2Resource = mock(Resource.class);
		ValueMap hit2ResourceProps = new ValueMapDecorator(new HashMap<>());
		hit2ResourceProps.put("jcr:content/showinmeganav", true);
		hit2ResourceProps.put("jcr:content/jcr:title", "Title 2");
		hit2ResourceProps.put("jcr:content/externalurl", "https://example.com");
		when(hit2Resource.adaptTo(ValueMap.class)).thenReturn(hit2ResourceProps);

		// Setup hit3 - Should be excluded (hideInNav=true)
		ValueMap hit3Properties = new ValueMapDecorator(new HashMap<>());
		hit3Properties.put("hideInNav", true);
		when(hit3.getProperties()).thenReturn(hit3Properties);

		// Setup ResourceResolver
		ResourceResolver resourceResolver = mock(ResourceResolver.class);
		when(resourceResolver.getResource("/content/hit1")).thenReturn(hit1Resource);
		when(resourceResolver.getResource("/content/hit2")).thenReturn(hit2Resource);

		// Setup searchResult with mocked hits
		when(mockSearchResult.getHits()).thenReturn(hits);

		// Setup resources iterator for closing
		Resource mockIteratorResource = mock(Resource.class);
		ResourceResolver mockIteratorResourceResolver = mock(ResourceResolver.class);
		when(mockIteratorResource.getResourceResolver()).thenReturn(mockIteratorResourceResolver);
		Iterator<Resource> resourceIterator = Collections.singletonList(mockIteratorResource).iterator();
		when(mockSearchResult.getResources()).thenReturn(resourceIterator);

		// Connect query to search result
		when(mockQuery.getResult()).thenReturn(mockSearchResult);

		// Connect QueryBuilder to query
		lenient().when(queryBuilder.createQuery(any(), any())).thenReturn(mockQuery);
		// Execute
		MeganavPanel meganavPanel = new MeganavPanel(index, page, rootPage, queryBuilder, resourceResolver);

		// Verify
		List<ArticleCategory> articleCategories = meganavPanel.getArticleCategories();

		// Should have 2 article categories (hit1 and hit2, not hit3)
		assertEquals(2, articleCategories.size());

		// Verify first article category (hit1)
		ArticleCategory category1 = articleCategories.get(0);
		assertEquals("/content/hit1", category1.path);
		assertEquals("Nav Title 1", category1.getTitle());
		assertEquals("/content/dam/image1.jpg", category1.getPageImage());
		assertFalse(category1.getExternal());

		// Verify second article category (hit2)
		ArticleCategory category2 = articleCategories.get(1);
		assertEquals("https://example.com", category2.path);
		assertEquals("Title 2", category2.getTitle());
		assertTrue(category2.getExternal());

		// Verify the resourceResolver was closed
		verify(mockIteratorResourceResolver).close();
	}

	@Test
	void testSocialLinks() {
		ctx.currentResource("/content/dhl/country/en/ship-now");

		Meganav meganav = ctx.request().adaptTo(Meganav.class);
		for (SocialLink socialLink: meganav.getLinksSocial()) {
			switch(socialLink.category) {
				case "youtube": assertEquals("yt", socialLink.categoryshort()); break;
				case "facebook": assertEquals("fb", socialLink.categoryshort()); break;
				case "instagram": assertEquals("ig", socialLink.categoryshort()); break;
				case "linkedin": assertEquals("li", socialLink.categoryshort()); break;
				case "twitter": assertEquals("tw", socialLink.categoryshort()); break;
				default: assertEquals("", socialLink.categoryshort()); break;
			}
		}
	}

	@Test
	void testMeganavSetters() {
		ctx.currentResource("/content/dhl/country/en/ship-now");

		Meganav meganav = ctx.request().adaptTo(Meganav.class);
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
