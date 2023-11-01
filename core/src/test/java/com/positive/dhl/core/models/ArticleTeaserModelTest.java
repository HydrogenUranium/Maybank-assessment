package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleTeaserModelTest {
    public static final String TEST_RESOURCE_PATH = "/com/positive/dhl/core/newContentStructure.json";
    public static final String ROOT_TEST_PAGE_PATH = "/content";

    public static final String ARTICLE_TEASER_COMPONENT_FROM_LINKED_ARTICLE_PAGE_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/jcr:content/root/responsivegrid/article_carousel/item_from_linked_article_page";
    public static final String ARTICLE_PAGE_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/article-page-with-new-article-setup";

    public static final String ARTICLE_TEASER_COMPONENT_FROM_LINKED_SUBCATEGORY_PAGE_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/jcr:content/root/responsivegrid/article_carousel/item_from_linked_subcategory_page";
    public static final String SUBCATEGORY_PAGE_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/sub-category-page";

    public static final String ARTICLE_TEASER_COMPONENT_FROM_LINKED_HOME_PAGE_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/jcr:content/root/responsivegrid/article_carousel/item_from_linked_home_page";
    public static final String HOME_PAGE_RESOURCE_PATH = "/content/dhl/us/en-us";

    public static final String ARTICLE_TEASER_COMPONENT_WITH_CUSTOM_SETUP_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/jcr:content/root/responsivegrid/article_carousel/item_custom_setup";
    public static final String ARTICLE_TEASER_COMPONENT_EMPTY_SETUP_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/jcr:content/root/responsivegrid/article_carousel/item_empty_setup";

    private final AemContext context = new AemContext();
    private ResourceResolver resourceResolver;

    @Mock
    private PageUtilService pageUtilService;

    @BeforeEach
    void setUp() {
        context.registerService(PageUtilService.class, pageUtilService);
        context.addModelsForClasses(ArticleTeaserModel.class);
        resourceResolver = context.resourceResolver();
        context.load().json(TEST_RESOURCE_PATH, ROOT_TEST_PAGE_PATH);
    }

    @Test
    void test_articleTeaserFromLinkedArticlePage() {
        when(pageUtilService.getPage(any(), any())).thenReturn(getPage(ARTICLE_PAGE_RESOURCE_PATH));

        ArticleTeaserModel articleTeaserModel = getResource(ARTICLE_TEASER_COMPONENT_FROM_LINKED_ARTICLE_PAGE_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertTrue(articleTeaserModel.isImageFromPage());
        assertEquals("/content/dam/dhl/listimage.jpg", articleTeaserModel.getImagePathFromPage());
        assertEquals("Alt text", articleTeaserModel.getAltTextFromPageImage());
        assertEquals("#CategoryPage", articleTeaserModel.getCategoryTag());
        assertEquals("Sansa Stark", articleTeaserModel.getAuthor());
        assertEquals("2023-10-11", articleTeaserModel.getPublishDate());
        assertEquals("October 11, 2023", articleTeaserModel.getFriendlyPublishDate());
        assertEquals("ARTICLE PAGE", articleTeaserModel.getTitleFromLinkedPage());
    }

    @Test
    void test_articleTeaserFromLinkedCategoryPage() {
        when(pageUtilService.getPage(any(), any())).thenReturn(getPage(SUBCATEGORY_PAGE_RESOURCE_PATH));

        ArticleTeaserModel articleTeaserModel = getResource(ARTICLE_TEASER_COMPONENT_FROM_LINKED_SUBCATEGORY_PAGE_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertTrue(articleTeaserModel.isImageFromPage());
        assertEquals("/content/dam/dhl/listimage.jpg", articleTeaserModel.getImagePathFromPage());
        assertEquals("Alt text", articleTeaserModel.getAltTextFromPageImage());
        assertEquals("#CategoryPage", articleTeaserModel.getCategoryTag());
        assertEquals("", articleTeaserModel.getAuthor());
        assertEquals("2023-10-26", articleTeaserModel.getPublishDate());
        assertEquals("October 26, 2023", articleTeaserModel.getFriendlyPublishDate());
        assertEquals("SUB CATEGORY PAGE Navigation Title", articleTeaserModel.getTitleFromLinkedPage());
    }

    @Test
    void test_articleTeaserFromLinkedHomePage() {
        when(pageUtilService.getPage(any(), any())).thenReturn(getPage(HOME_PAGE_RESOURCE_PATH));

        ArticleTeaserModel articleTeaserModel = getResource(ARTICLE_TEASER_COMPONENT_FROM_LINKED_HOME_PAGE_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertTrue(articleTeaserModel.isImageFromPage());
        assertEquals("", articleTeaserModel.getImagePathFromPage());
        assertNull(articleTeaserModel.getAltTextFromPageImage());
        assertEquals("", articleTeaserModel.getCategoryTag());
        assertEquals("", articleTeaserModel.getAuthor());
        assertEquals("2023-10-20", articleTeaserModel.getPublishDate());
        assertEquals("October 20, 2023", articleTeaserModel.getFriendlyPublishDate());
        assertEquals("EN-US Global", articleTeaserModel.getTitleFromLinkedPage());
    }

    @Test
    void test_articleTeaserCustomTitleAndImageSetup() {
        ArticleTeaserModel articleTeaserModel = getResource(ARTICLE_TEASER_COMPONENT_WITH_CUSTOM_SETUP_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertFalse(articleTeaserModel.isImageFromPage());
        assertNull(articleTeaserModel.getImagePathFromPage());
        assertNull(articleTeaserModel.getAltTextFromPageImage());
        assertEquals("#CategoryPage", articleTeaserModel.getCategoryTag());
        assertEquals("Sansa Stark", articleTeaserModel.getAuthor());
        assertEquals("2023-10-11", articleTeaserModel.getPublishDate());
        assertEquals("October 11, 2023", articleTeaserModel.getFriendlyPublishDate());
        assertEquals("", articleTeaserModel.getTitleFromLinkedPage());
    }

    @Test
    void test_articleTeaserEmptySetup() {
        ArticleTeaserModel articleTeaserModel = getResource(ARTICLE_TEASER_COMPONENT_EMPTY_SETUP_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertFalse(articleTeaserModel.isImageFromPage());
        assertNull(articleTeaserModel.getImagePathFromPage());
        assertNull(articleTeaserModel.getAltTextFromPageImage());
        assertNull(articleTeaserModel.getCategoryTag());
        assertNull(articleTeaserModel.getAuthor());
        assertNull(articleTeaserModel.getPublishDate());
        assertNull(articleTeaserModel.getFriendlyPublishDate());
        assertEquals("", articleTeaserModel.getTitleFromLinkedPage());
    }

    private Page getPage(String pagePath) {
        Resource pageResource = getResource(pagePath);
        Page page = pageResource.adaptTo(Page.class);
        assertNotNull(page);
        return page;
    }

    private Resource getResource(String path) {
        Resource resource = resourceResolver.getResource(path);
        assertNotNull(resource);
        return resource;
    }
}