package com.dhl.discover.core.services;

import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.dhl.discover.core.models.Article;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static com.dhl.discover.junitUtils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PageUtilServiceTest {
    public static final String PAGE_PATH = "/content";
    public static final String EMPTY_JCR_LANG_AND_EMPTY_ACCEPT_LANG = "/content/dhl/language-masters/en-master";
    public static final String EMPTY_JCR_LANG_AND_ASTERISK_ACCEPT_LANG = "/content/dhl/language-masters/es";
    public static final String EMPTY_JCR_LANG_AND_FR_ACCEPT_LANG = "/content/dhl/language-masters/fr";
    public static final String ZH_JCR_LANG_AND_EMPTY_ACCEPT_LANG = "/content/dhl/language-masters/zh";
    public static final String EN_JCR_LANG_AND_ASTERISK_ACCEPT_LANG = "/content/dhl/global/en-global";
    public static final String EMPTY_JCR_LANG_AND_INVALID_ACCEPT_LANG = "/content/dhl/language-masters/it";
    public static final String ES_US_JCR_LANG_AND_ES_US_ACCEPT_LANG = "/content/dhl/us/es-us/category-page/article-page";
    public static final String ES_US_ARTICLE_PAGE_PATH = ES_US_JCR_LANG_AND_ES_US_ACCEPT_LANG;
    public static final String EN_GLOBAL_HOME_PAGE_PATH = EN_JCR_LANG_AND_ASTERISK_ACCEPT_LANG;
    public static final String ZH_MASTER_HOME_PAGE_PATH = ZH_JCR_LANG_AND_EMPTY_ACCEPT_LANG;
    public static final String EN_US_CATEGORY_COMPONENT_PATH = "/content/dhl/us/en-us/category-page/jcr:content";

    AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

    private ResourceResolver resourceResolver;
    private Resource resource;
    private PageUtilService pageUtilService;

    @BeforeEach
    void setUp() {
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, PAGE_PATH);

        resourceResolver = context.resourceResolver();
        resource = resourceResolver.getResource(PAGE_PATH);
        var launchService = context.registerService(LaunchService.class, new LaunchService());
        pageUtilService = context.registerInjectActivateService(PageUtilService.class, "launchService", launchService);
    }

    @Test
    void test_getHomePageLevel() throws NoSuchFieldException, IllegalAccessException {
        Field privateHomePageLevel = pageUtilService.getClass().getDeclaredField("HOME_PAGE_LEVEL");
        privateHomePageLevel.setAccessible(true);
        int expectedHomePageLevel = (int) privateHomePageLevel.get(pageUtilService);

        assertEquals(expectedHomePageLevel, pageUtilService.getHomePageLevel());
    }

    @Test
    void test_forNull()  {
        assertNull(pageUtilService.getHomePage((Page) null));
        assertNull(pageUtilService.getAllHomePages((Page) null));
        assertEquals(ValueMap.EMPTY, pageUtilService.getPageProperties(null));
        assertEquals(ValueMap.EMPTY, pageUtilService.getHomePageProperties(null));
        assertEquals(StringUtils.EMPTY, pageUtilService.getCountryCodeByPagePath(null));
    }

    @Test
    void test_getHomePageWithIncorrectDepth()  {
        Page page = resource.adaptTo(Page.class);
        for (int i = 0; i < pageUtilService.getHomePageLevel(); i++) {
            assertNull(pageUtilService.getHomePage(page));
            assertEquals(ValueMap.EMPTY, pageUtilService.getHomePageProperties(page));

	        assert page != null;
	        page = page.listChildren().next();
        }
    }

    @Test
    void test_getAllHomePagesWithIncorrectDepth()  {
        Page page = getPageUpperHomePage();
        while (page != null) {
            assertNull(pageUtilService.getAllHomePages(page));
            page = page.listChildren().hasNext() ? page.listChildren().next() : null;
        }
    }

    @Test
    void test_getHomePageWithCorrectDepth()  {
        Page page = getPageUpperHomePage();
        Page expectedHomePage = page.getAbsoluteParent(pageUtilService.getHomePageLevel());

        while (page != null) {
            assertEquals(expectedHomePage, pageUtilService.getHomePage(page));
            page = page.listChildren().hasNext() ? page.listChildren().next() : null;
        }
    }

    @Test
    void test_getAllHomePagesWithCorrectDepth()  {
        Page page = resource.adaptTo(Page.class);
        int homePageLevel = pageUtilService.getHomePageLevel();
        for (int i = 0; i < homePageLevel; i++) {
            Page actualResult = pageUtilService.getAllHomePages(page).get(0);
            assertEquals(actualResult.getAbsoluteParent(homePageLevel), actualResult);
	        assert page != null;
	        page = page.listChildren().next();
        }
    }

    @Test
    void test_getPageProperties()  {
        Page page = resource.adaptTo(Page.class);
        assertEquals("Root", pageUtilService.getPageProperties(page).get("jcr:title"));
    }

    @Test
    void test_getCountryCodeByPagePath()  {
        assertEquals("us", pageUtilService.getCountryCodeByPagePath(getPage(ES_US_ARTICLE_PAGE_PATH)));
        assertEquals("global", pageUtilService.getCountryCodeByPagePath(getPage(EN_GLOBAL_HOME_PAGE_PATH)));
        assertEquals("", pageUtilService.getCountryCodeByPagePath(getPage(ZH_MASTER_HOME_PAGE_PATH)));
    }

    private Page getPageUpperHomePage() {
        Page page = resource.adaptTo(Page.class);
        int homePageLevel = pageUtilService.getHomePageLevel();
        for (int i = 0; i < homePageLevel + 1; i++) {
	        assert page != null;
	        page = page.listChildren().next();
        }
        return page;
    }

    @Test
    void test_getLocale()  {
        assertEquals("fr", pageUtilService.getLocale(getPage(EMPTY_JCR_LANG_AND_FR_ACCEPT_LANG)).toString());
        assertEquals("en", pageUtilService.getLocale(getPage(EN_JCR_LANG_AND_ASTERISK_ACCEPT_LANG)).toString());
        assertEquals("zh", pageUtilService.getLocale(getPage(ZH_JCR_LANG_AND_EMPTY_ACCEPT_LANG)).toString());
        assertEquals("es_US", pageUtilService.getLocale(getPage(ES_US_JCR_LANG_AND_ES_US_ACCEPT_LANG)).toString());
        assertEquals("it", pageUtilService.getLocale(getPage(EMPTY_JCR_LANG_AND_INVALID_ACCEPT_LANG)).toString());

        assertEquals("es", pageUtilService.getLocale(EMPTY_JCR_LANG_AND_ASTERISK_ACCEPT_LANG, resourceResolver).toString());
        assertEquals("fr", pageUtilService.getLocale(EMPTY_JCR_LANG_AND_FR_ACCEPT_LANG, resourceResolver).toString());
    }

    @Test
    void test_getLocaleFromResource()  {
        assertEquals("en_US", pageUtilService.getLocale(resourceResolver.getResource(EN_US_CATEGORY_COMPONENT_PATH)).toString());

        assertEquals("fr", pageUtilService.getLocale(resourceResolver.getResource(EMPTY_JCR_LANG_AND_FR_ACCEPT_LANG)).toString());
        assertEquals("en", pageUtilService.getLocale(resourceResolver.getResource(EN_JCR_LANG_AND_ASTERISK_ACCEPT_LANG)).toString());
        assertEquals("zh", pageUtilService.getLocale(resourceResolver.getResource(ZH_JCR_LANG_AND_EMPTY_ACCEPT_LANG)).toString());
        assertEquals("es_US", pageUtilService.getLocale(resourceResolver.getResource(ES_US_JCR_LANG_AND_ES_US_ACCEPT_LANG)).toString());
        assertEquals("it", pageUtilService.getLocale(resourceResolver.getResource(EMPTY_JCR_LANG_AND_INVALID_ACCEPT_LANG)).toString());
    }

    @Test
    void test_getPage()  {
        Page articlePage = pageUtilService.getPage(ES_US_ARTICLE_PAGE_PATH, resourceResolver);
        assertNotNull(articlePage);
        assertEquals(ES_US_ARTICLE_PAGE_PATH, articlePage.getPath());
    }

    @Test
    void test_getArticle()  {
        ResourceResolver mockResourceResolver = mock(ResourceResolver.class);
        Resource mockResource = mock(Resource.class);
        Article article = mock(Article.class);

        when(mockResourceResolver.getResource(anyString())).thenReturn(mockResource);
        when(mockResource.adaptTo(Article.class)).thenReturn(article);
        assertNotNull(pageUtilService.getArticle(ES_US_ARTICLE_PAGE_PATH, mockResourceResolver));
    }

    private Page getPage(String pagePath) {
        Resource pageResource = resourceResolver.getResource(pagePath);
        assertNotNull(pageResource);
        return pageResource.adaptTo(Page.class);
    }

    /**
     * Verifies the functionality of {@link PageUtilService#isGlobalPage(Page)}
     */
    @Test
    void isGlobalPage(){
        Page pageNotGlobal = context.create().page("/content/dhl/au/en-au");
        Page page = context.create().page("/content/dhl/global/en-global");
        assertTrue(pageUtilService.isGlobalPage(page));
        assertFalse(pageUtilService.isGlobalPage(pageNotGlobal));
        assertFalse(pageUtilService.isGlobalPage(null));
    }

    @Test
    void getAncestorPageByPredicate_whenAncestorExist() {
        Page currentPage = resourceResolver.getResource(ES_US_JCR_LANG_AND_ES_US_ACCEPT_LANG).adaptTo(Page.class);

        Page ancestor = pageUtilService.getAncestorPageByPredicate(currentPage, page ->
                page.getTitle().equals("DHL"));

        assertNotNull(ancestor);
        assertEquals("DHL", ancestor.getTitle());
    }

    @Test
    void getAncestorPageByPredicate_whenAncestorNotExist() {
        Page currentPage = resourceResolver.getResource(ES_US_JCR_LANG_AND_ES_US_ACCEPT_LANG).adaptTo(Page.class);

        Page ancestor = pageUtilService.getAncestorPageByPredicate(currentPage, page ->
                page.getTitle().equals("Not Exist"));

        assertNull(ancestor);
    }

    @Test
    void hasInheritedNoIndex() {
        Page currentPage = resourceResolver.getResource(ES_US_JCR_LANG_AND_ES_US_ACCEPT_LANG).adaptTo(Page.class);

        boolean result = pageUtilService.hasInheritedNoIndex(currentPage);

        assertFalse(result);
    }

    @Test
    void hasNoIndex() {
        Page currentPage = resourceResolver.getResource(EMPTY_JCR_LANG_AND_EMPTY_ACCEPT_LANG).adaptTo(Page.class);

        boolean result = pageUtilService.hasNoIndex(currentPage);

        assertFalse(result);
    }

    @Test
    void hasNoIndex_withInheritedLogic_WhenAncestorWithoutInheritableNoIndex() {
        Page currentPage = resourceResolver.getResource(EMPTY_JCR_LANG_AND_EMPTY_ACCEPT_LANG).adaptTo(Page.class);

        boolean result = pageUtilService.hasNoIndex(currentPage, true);

        assertFalse(result);
    }

    @Test
    void hasNoIndex_withInheritedLogic_WhenAncestorHasInheritableNoIndex() {
        context.load().json("/com/dhl/discover/core/content/inheritableNoIndexPageContent.json", "/content/dhl/home");
        context.load().json("/com/dhl/discover/core/content/simpleArticleContent.json", "/content/dhl/home/article");
        Page currentPage = resourceResolver.getResource("/content/dhl/home/article").adaptTo(Page.class);

        boolean result = pageUtilService.hasNoIndex(currentPage, true);

        assertTrue(result);
    }

    @Test
    void test_getHomePagesByPath()  {
        assertEquals("/content/dhl/language-masters/pt_br", pageUtilService.getHomePagePath("/content/dhl/language-masters/pt_br/news-and-insights1/dhl-stories"));
        assertEquals("/content/dhl/language-masters/pt_br", pageUtilService.getHomePagePath("/content/dhl/language-masters/pt_br"));
        assertEquals("/content/dhl/language-masters/pt", pageUtilService.getHomePagePath("/content/dhl/language-masters/pt/news-and-insights1/dhl-stories"));
        assertEquals("/content/dhl/language-masters/en-master", pageUtilService.getHomePagePath("/content/dhl/language-masters/en-master/news-and-insights1/dhl-stories"));
        assertEquals("", pageUtilService.getHomePagePath("/content/dhl/Archive/master-backup/old-ship-now/thanks-sn"));
        assertEquals("", pageUtilService.getHomePagePath("/content/dhl/au"));
        assertEquals("/content/dhl/au/en-au", pageUtilService.getHomePagePath("/content/dhl/au/en-au"));
        assertEquals("/content/dhl/au/en-au", pageUtilService.getHomePagePath("/content/dhl/au/en-au/small-business-advice/growing-your-business/making-more-of-your-time"));
        assertEquals("", pageUtilService.getHomePagePath("/content/dhl/global"));
        assertEquals("/content/dhl/global/en-global", pageUtilService.getHomePagePath("/content/dhl/global/en-global"));
        assertEquals("/content/dhl/global/en-global", pageUtilService.getHomePagePath("/content/dhl/global/en-global/ship-with-dhl/services/optional-services"));
    }

    @Test
    void testIsPublished_NullPage() {
        assertFalse(pageUtilService.isPublished(null));
    }

    @Test
    void testIsPublished_PageHasNoContent() {
        Page page = mock(Page.class);
        when(page.hasContent()).thenReturn(false);
        assertFalse(pageUtilService.isPublished(page));
    }

    @Test
    void testIsPublished_PageNotPublished() {
        Page page = mock(Page.class);
        when(page.hasContent()).thenReturn(true);
        Resource contentResource = mock(Resource.class);
        when(page.getContentResource()).thenReturn(contentResource);
        ReplicationStatus replicationStatus = mock(ReplicationStatus.class);
        when(contentResource.adaptTo(ReplicationStatus.class)).thenReturn(replicationStatus);
        when(replicationStatus.getLastReplicationAction()).thenReturn(ReplicationActionType.DEACTIVATE);

        assertFalse(pageUtilService.isPublished(page));
    }

    @Test
    void testIsPublished_PagePublished() {
        Page page = mock(Page.class);
        when(page.hasContent()).thenReturn(true);
        Resource contentResource = mock(Resource.class);
        when(page.getContentResource()).thenReturn(contentResource);
        ReplicationStatus replicationStatus = mock(ReplicationStatus.class);
        when(contentResource.adaptTo(ReplicationStatus.class)).thenReturn(replicationStatus);
        when(replicationStatus.getLastReplicationAction()).thenReturn(ReplicationActionType.ACTIVATE);

        assertTrue(pageUtilService.isPublished(page));
    }

    @Test
    void testGetArticle_NullOrBlankPath() {
        PageUtilService service = new PageUtilService();
        assertNull(service.getArticle(null, mock(SlingHttpServletRequest.class)));
        assertNull(service.getArticle("   ", mock(SlingHttpServletRequest.class)));
    }

    @Test
    void testGetArticle_ResourceNotFound() {
        PageUtilService service = new PageUtilService();
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        ResourceResolver resolver = mock(ResourceResolver.class);
        when(request.getResourceResolver()).thenReturn(resolver);
        when(resolver.getResource("some/path")).thenReturn(null);

        assertNull(service.getArticle("some/path", request));
    }

    @Test
    void testGetArticle_ModelFactoryReturnsArticle() {
        PageUtilService service = new PageUtilService();
        ModelFactory modelFactory = mock(ModelFactory.class);
        Resource resource = mock(Resource.class);
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        ResourceResolver resolver = mock(ResourceResolver.class);
        Article article = mock(Article.class);

        when(request.getResourceResolver()).thenReturn(resolver);
        when(resolver.getResource("valid/path")).thenReturn(resource);
        when(modelFactory.createModelFromWrappedRequest(request, resource, Article.class)).thenReturn(article);

        try {
            var field = PageUtilService.class.getDeclaredField("modelFactory");
            field.setAccessible(true);
            field.set(service, modelFactory);
        } catch (Exception e) {
            fail("Failed to inject modelFactory: " + e.getMessage());
        }

        assertEquals(article, service.getArticle("valid/path", request));
    }

    @Test
    void testHasNoIndex_CheckInheritanceFalse_DelegatesToHasNoIndex() {
        Page page = mock(Page.class);
        when(page.getProperties()).thenReturn(new org.apache.sling.api.wrappers.ValueMapDecorator(
                java.util.Map.of("cq:robotsTags", new String[] {"noindex"})
        ));

        PageUtilService service = new PageUtilService();
        boolean result = service.hasNoIndex(page, false);

        assertTrue(result, "Expected hasNoIndex to return true when robotsTags contains 'noindex'");
    }
    @Test
    void testGetHomePage_WithNullResource() {
        PageUtilService service = new PageUtilService();
        assertNull(service.getHomePage((Resource) null));
    }

    @Test
    void testGetHomePage_WithValidResource() {
        PageUtilService service = new PageUtilService();
        ResourceResolver mockResolver = mock(ResourceResolver.class);
        Resource mockResource = mock(Resource.class);
        Page mockPage = mock(Page.class);

        when(mockResource.getResourceResolver()).thenReturn(mockResolver);
        PageManager mockPageManager = mock(PageManager.class);
        when(mockResolver.adaptTo(PageManager.class)).thenReturn(mockPageManager);
        when(mockPageManager.getContainingPage(mockResource)).thenReturn(mockPage);

        PageUtilService spyService = spy(service);
        Page expectedHomePage = mock(Page.class);
        doReturn(expectedHomePage).when(spyService).getHomePage(mockPage);

        assertEquals(expectedHomePage, spyService.getHomePage(mockResource));
    }

    @Test
    void testIsHomePage_NullPage_ReturnsFalse() {
        PageUtilService service = new PageUtilService();
        assertFalse(service.isHomePage(null));
    }
}
