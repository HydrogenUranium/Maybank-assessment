package com.positive.dhl.core.services;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.models.Article;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PageUtilServiceTest {
    public static final String PAGE_PATH = "/content";
    public static final String TEST_RESOURCE_PATH = "/com/positive/dhl/core/newContentStructure.json";
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

    @InjectMocks
    private PageUtilService pageUtilService;

    @BeforeEach
    void setUp() {
        resourceResolver = context.resourceResolver();
        context.load().json(TEST_RESOURCE_PATH, PAGE_PATH);
        resource = resourceResolver.getResource(PAGE_PATH);
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
        assertNull(pageUtilService.getHomePage(null));
        assertNull(pageUtilService.getAllHomePages(null));
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
        assertEquals("en", pageUtilService.getLocale(getPage(EMPTY_JCR_LANG_AND_EMPTY_ACCEPT_LANG)).toString());
        assertEquals("en", pageUtilService.getLocale(getPage(EMPTY_JCR_LANG_AND_ASTERISK_ACCEPT_LANG)).toString());
        assertEquals("fr", pageUtilService.getLocale(getPage(EMPTY_JCR_LANG_AND_FR_ACCEPT_LANG)).toString());
        assertEquals("en", pageUtilService.getLocale(getPage(EN_JCR_LANG_AND_ASTERISK_ACCEPT_LANG)).toString());
        assertEquals("zh", pageUtilService.getLocale(getPage(ZH_JCR_LANG_AND_EMPTY_ACCEPT_LANG)).toString());
        assertEquals("es_US", pageUtilService.getLocale(getPage(ES_US_JCR_LANG_AND_ES_US_ACCEPT_LANG)).toString());
        assertEquals("en", pageUtilService.getLocale(getPage(EMPTY_JCR_LANG_AND_INVALID_ACCEPT_LANG)).toString());
    }

    @Test
    void test_getLocaleFromResource()  {
        assertEquals("en_US", pageUtilService.getLocale(resourceResolver.getResource(EN_US_CATEGORY_COMPONENT_PATH)).toString());

        assertEquals("en", pageUtilService.getLocale(resourceResolver.getResource(EMPTY_JCR_LANG_AND_EMPTY_ACCEPT_LANG)).toString());
        assertEquals("en", pageUtilService.getLocale(resourceResolver.getResource(EMPTY_JCR_LANG_AND_ASTERISK_ACCEPT_LANG)).toString());
        assertEquals("fr", pageUtilService.getLocale(resourceResolver.getResource(EMPTY_JCR_LANG_AND_FR_ACCEPT_LANG)).toString());
        assertEquals("en", pageUtilService.getLocale(resourceResolver.getResource(EN_JCR_LANG_AND_ASTERISK_ACCEPT_LANG)).toString());
        assertEquals("zh", pageUtilService.getLocale(resourceResolver.getResource(ZH_JCR_LANG_AND_EMPTY_ACCEPT_LANG)).toString());
        assertEquals("es_US", pageUtilService.getLocale(resourceResolver.getResource(ES_US_JCR_LANG_AND_ES_US_ACCEPT_LANG)).toString());
        assertEquals("en", pageUtilService.getLocale(resourceResolver.getResource(EMPTY_JCR_LANG_AND_INVALID_ACCEPT_LANG)).toString());
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
        context.load().json("/com/positive/dhl/core/content/inheritableNoIndexPageContent.json", "/content/dhl/home");
        context.load().json("/com/positive/dhl/core/content/simpleArticleContent.json", "/content/dhl/home/article");
        Page currentPage = resourceResolver.getResource("/content/dhl/home/article").adaptTo(Page.class);

        boolean result = pageUtilService.hasNoIndex(currentPage, true);

        assertTrue(result);
    }
}
