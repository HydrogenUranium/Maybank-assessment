package com.dhl.discover.core.models;

import com.day.cq.wcm.api.components.Component;
import com.dhl.discover.core.services.*;
import com.dhl.discover.junitUtils.InjectorMock;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.factory.ModelFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Locale;

import static com.dhl.discover.junitUtils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleTeaserModelTest {
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

    @Mock
    private ArticleUtilService articleUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private AssetUtilService assetUtilService;

    @Mock
    private ValueMap ComponentValueMap;

    @Mock
    private Component component;

    @BeforeEach
    void setUp() {
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(ArticleUtilService.class, articleUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);
        mockInject(context, InjectorMock.INJECT_CHILD_IMAGE_MODEL, "jcr:content/cq:featuredimage", null);
        mockInject(context, InjectorMock.INJECT_SCRIPT_BINDINGS, "component", component);

        context.addModelsForClasses(ArticleTeaserModel.class);
        resourceResolver = context.resourceResolver();
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, ROOT_TEST_PAGE_PATH);

        lenient().when(component.getProperties()).thenReturn(ComponentValueMap);
        lenient().when(ComponentValueMap.get("imageDelegate", "")).thenReturn("components/image");

        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(Locale.forLanguageTag("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
        lenient().when(assetUtilService.getThumbnailLink(any())).thenReturn("/thumbnail.png");
        lenient().when(assetUtilService.getPageImagePath(any(Resource.class))).thenReturn("/content/dam/dhl/listimage.jpg");
    }

    @Test
    void test_articleTeaserFromLinkedArticlePage() {
        Article article = createModel(getResource(ARTICLE_PAGE_RESOURCE_PATH));
        when(articleUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        ArticleTeaserModel articleTeaserModel = getRequest(ARTICLE_TEASER_COMPONENT_FROM_LINKED_ARTICLE_PAGE_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertEquals("#CategoryPage", articleTeaserModel.getCategoryTag());
        assertEquals("2023-10-11", articleTeaserModel.getPublishDate());
        assertEquals("October 11, 2023", articleTeaserModel.getFriendlyPublishDate());
        assertEquals("ARTICLE PAGE", articleTeaserModel.getTitleFromLinkedPage());
    }

    @Test
    void test_articleTeaserFromLinkedCategoryPage() {
        Article article = createModel(getResource(SUBCATEGORY_PAGE_RESOURCE_PATH));
        when(articleUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        ArticleTeaserModel articleTeaserModel = getRequest(ARTICLE_TEASER_COMPONENT_FROM_LINKED_SUBCATEGORY_PAGE_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertEquals("#CategoryPage", articleTeaserModel.getCategoryTag());
        assertEquals("", articleTeaserModel.getAuthor());
        assertEquals("2023-10-26", articleTeaserModel.getPublishDate());
        assertEquals("October 26, 2023", articleTeaserModel.getFriendlyPublishDate());
        assertEquals("SUB CATEGORY PAGE Navigation Title", articleTeaserModel.getTitleFromLinkedPage());
    }

    @Test
    void test_articleTeaserFromLinkedHomePage() {
        Article article = createModel(getResource(HOME_PAGE_RESOURCE_PATH));
        when(articleUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        ArticleTeaserModel articleTeaserModel = getRequest(ARTICLE_TEASER_COMPONENT_FROM_LINKED_HOME_PAGE_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertEquals("#CategoryPage", articleTeaserModel.getCategoryTag());
        assertEquals("", articleTeaserModel.getAuthor());
        assertEquals("2023-10-20", articleTeaserModel.getPublishDate());
        assertEquals("October 20, 2023", articleTeaserModel.getFriendlyPublishDate());
        assertEquals("EN-US Global", articleTeaserModel.getTitleFromLinkedPage());
    }

    @Test
    void test_articleTeaserCustomTitleAndImageSetup() {
        Article article = createModel(getResource(ARTICLE_PAGE_RESOURCE_PATH));
        when(articleUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        ArticleTeaserModel articleTeaserModel = getRequest(ARTICLE_TEASER_COMPONENT_WITH_CUSTOM_SETUP_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertEquals("#CategoryPage", articleTeaserModel.getCategoryTag());
        assertEquals("2023-10-11", articleTeaserModel.getPublishDate());
        assertEquals("October 11, 2023", articleTeaserModel.getFriendlyPublishDate());
        assertEquals("", articleTeaserModel.getTitleFromLinkedPage());
    }

    @Test
    void test_articleTeaserEmptySetup() {
        when(articleUtilService.getArticle(any(), any(ResourceResolver.class))).thenReturn(null);

        ArticleTeaserModel articleTeaserModel = getRequest(ARTICLE_TEASER_COMPONENT_EMPTY_SETUP_RESOURCE_PATH).adaptTo(ArticleTeaserModel.class);
        assertNotNull(articleTeaserModel);

        assertNull(articleTeaserModel.getCategoryTag());
        assertNull(articleTeaserModel.getAuthor());
        assertNull(articleTeaserModel.getPublishDate());
        assertNull(articleTeaserModel.getFriendlyPublishDate());
        assertNull(articleTeaserModel.getTitleFromLinkedPage());
    }

    private Article createModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }

    private Resource getResource(String path) {
        Resource resource = resourceResolver.getResource(path);
        assertNotNull(resource);
        return resource;
    }

    private SlingHttpServletRequest getRequest(String path) {
        Resource resource = getResource(path);
        context.request().setResource(resource);
        return context.request();
    }
}