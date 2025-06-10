package com.dhl.discover.core.models;

import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
import com.dhl.discover.core.services.TagUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleTest {
    public static final String PAGE_PATH = "/content/dhl/global";
    public static final String CF_PATH = "/content/dam/global-master/8-site-images/roundels/anna_thompson";
    public static final String TEST_RESOURCE_PATH = "/com/dhl/discover/core/models/Article/content.json";
    public static final String TEST_CF_RESOURCE_PATH = "/com/dhl/discover/core/models/Article/content-fragment.json";
    public static final String ARTICLE_PAGE_PATH = "/content/dhl/global/home/small-business-advice/article";
    public static final String ARTICLE_PAGE_WITH_CF_PATH = "/content/dhl/global/home/small-business-advice/article-with-author-cf";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private ResourceResolver resourceResolver;
    private Resource resource;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private AssetUtilService assetUtilService;

    @BeforeEach
    void setUp() throws Exception {
        resourceResolver = context.resourceResolver();
        context.load().json(TEST_RESOURCE_PATH, PAGE_PATH);
        context.load().json(TEST_CF_RESOURCE_PATH, CF_PATH);
        resource = resourceResolver.getResource(PAGE_PATH);

        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);

        when(pageUtilService.getLocale(any(Resource.class))).thenReturn(Locale.forLanguageTag("en"));
        when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#BusinessAdvice", "#eCommerceAdvice", "#InternationalShipping"));
        when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#SmallBusinessAdvice");
        when(assetUtilService.getPageImagePath(any(Resource.class))).thenReturn("/content/dam/image.jpg");
        when(assetUtilService.getPageImageAltText(any(Resource.class))).thenReturn("Page Image Alt Text");
    }

    @Test
    void initAssetDeliveryProperties() {
        lenient().when(assetUtilService.getMappedDeliveryUrl(anyString(), anyMap(), any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/adobe/dynamicmedia/deliver" + invocationOnMock.getArgument(0, String.class) : "";
        });
        Article article = createModel(getResource(ARTICLE_PAGE_PATH));
        article.initAssetDeliveryProperties(true);

        checkModel(article);
        assertEquals("/adobe/dynamicmedia/deliver/content/dam/desktop.jpg", article.getHeroimagedt());
        assertEquals("/adobe/dynamicmedia/deliver/content/dam/mobile.jpg", article.getHeroimagemob());
        assertEquals("/adobe/dynamicmedia/deliver/content/dam/tablet.jpg", article.getHeroimagetab());
    }

    @Test
    void init_ShouldInitArticle() {
        Article article = createModel(getResource(ARTICLE_PAGE_PATH));
        checkModel(article);

        assertEquals("What paperwork do I need for international shipping?", article.getTitle());
        assertEquals("What paperwork do I need for international shipping? \n Discover DHL", article.getPageTitle());
        assertEquals("What paperwork do I need for international shipping? <br> Discover DHL", article.getPageTitleWithBr());
        assertEquals("#SmallBusinessAdvice", article.getGroupTag());
        assertEquals("/content/dhl/global/home/small-business-advice", article.getGroupPath());
        assertEquals("Small Business advice", article.getGrouptitle());
        assertEquals("/content/dam/desktop.jpg", article.getHeroimagedt());
        assertEquals("/content/dam/mobile.jpg", article.getHeroimagemob());
        assertEquals("/content/dam/tablet.jpg", article.getHeroimagetab());
        assertEquals("infographic", article.getIcon());
        assertEquals("4 min read", article.getReadtime());
        assertEquals("en", article.getLocale().toString());
        assertEquals("/content/dhl/global/home/small-business-advice/article.html", article.getPath());
        assertEquals("/content/dam/image.jpg", article.getPageImage());
        assertEquals("Page Image Alt Text", article.getPageImageAltText());
        assertArrayEquals(new String[]{"#BusinessAdvice", "#eCommerceAdvice", "#InternationalShipping"}, article.getTagsToShow().toArray());
        assertEquals("From Waybills to Export Licenses, this guide breaks down the jargon to help you navigate customs seamlessly. ", article.getBrief());
        assertEquals("What paperwork do I need for international shipping?", article.getDescription());
        assertEquals("2023-08-04", article.getCreated());
        assertEquals("August 4, 2023", article.getCreatedfriendly());

        checkGettersAndSetters(article);
    }

    @Test
    void init_ShouldInitAuthorData() {
        Article article = createModel(getResource(ARTICLE_PAGE_WITH_CF_PATH));
        checkModel(article);

        assertEquals("Adam Riley", article.getAuthor());
        assertEquals("Discover Content Team", article.getAuthortitle());
        assertEquals("Adam Riley Description", article.getAuthorBriefDescription());
        assertEquals("/content/dam/global-master/8-site-images/roundels/laptop.png", article.getAuthorimage());

        checkGettersAndSetters(article);
    }

    private void checkModel(Article article) {
        assertNotNull(article);
        assertNotNull(article.getResource());
        assertNotNull(article.getPageUtilService());
        assertNotNull(article.getTagUtilService());
        assertNotNull(article.getPathUtilService());
    }

    private void checkGettersAndSetters(Article article) {
        assertTrue(article.isValid());
        assertEquals(0, article.getTags().size());
        assertNotNull(article.getCreatedDate());

        article.setValid(false);
        assertFalse(article.isValid());

        article.setCurrent(true);
        assertTrue(article.isCurrent());

        article.setThird(true);
        assertTrue(article.isThird());

        article.setFourth(true);
        assertTrue(article.isFourth());

        article.setIndex(1);
        assertEquals(1, article.getIndex());
    }

    private Resource getResource(String path) {
        return context.resourceResolver().getResource(path);
    }

    private Article createModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}
