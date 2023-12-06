package com.positive.dhl.core.models;

import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import com.positive.dhl.core.services.TagUtilService;
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

import java.text.ParseException;
import java.util.Arrays;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleTest {
    public static final String PAGE_PATH = "/content/dhl/global";
    public static final String TEST_RESOURCE_PATH = "/com/positive/dhl/core/models/Article/content.json";
    public static final String ARTICLE_PAGE_PATH = "/content/dhl/global/home/small-business-advice/article";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private ResourceResolver resourceResolver;
    private Resource resource;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @BeforeEach
    void setUp() throws Exception {
        resourceResolver = context.resourceResolver();
        context.load().json(TEST_RESOURCE_PATH, PAGE_PATH);
        resource = resourceResolver.getResource(PAGE_PATH);

        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);

        when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#BusinessAdvice", "#eCommerceAdvice", "#InternationalShipping"));
        when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#SmallBusinessAdvice");
        when(pathUtilService.resolveAssetPath(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/prefix" + invocationOnMock.getArgument(0, String.class) : "";
        });
    }

    @Test
    void init_ShouldInitArticle() throws ParseException {
        Article article = createModel(getResource(ARTICLE_PAGE_PATH));
        checkModel(article);

        assertArrayEquals(new String[]{"#BusinessAdvice", "#eCommerceAdvice", "#InternationalShipping"}, article.getTagsToShow().toArray());
        assertEquals("From Waybills to Export Licenses, this guide breaks down the jargon to help you navigate customs seamlessly. ", article.getBrief());
        assertEquals("What paperwork do I need for international shipping?", article.getDescription());
        assertEquals("Anna Thompson", article.getAuthor());
        assertEquals("/prefix/content/dam/global-master/8-site-images/roundels/anna_thompson.jpg", article.getAuthorimage());
        assertEquals("Discover content team", article.getAuthortitle());
        assertEquals("2023-08-04", article.getCreated());
        assertEquals("August 4, 2023", article.getCreatedfriendly());
        assertEquals("What paperwork do I need for international shipping?", article.getFullTitle());
        assertEquals("#SmallBusinessAdvice", article.getGroupTag());
        assertEquals("/content/dhl/global/home/small-business-advice", article.getGrouppath());
        assertEquals("Small Business advice", article.getGrouptitle());
        assertEquals("/prefix/content/dam/desktop.jpg", article.getHeroimagedt());
        assertEquals("/prefix/content/dam/mobile.jpg", article.getHeroimagemob());
        assertEquals("/prefix/content/dam/tablet.jpg", article.getHeroimagetab());
        assertEquals("infographic", article.getIcon());
        assertEquals("4 min read", article.getReadtime());
        assertEquals("en", article.getLocale().toString());
        assertEquals("/content/dhl/global/home/small-business-advice/article", article.getPath());

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
        assertFalse(article.isShowshipnow());
        assertEquals(0, article.getTags().size());
        assertEquals(0, article.getCounter());
        assertEquals("", article.getYoutubeid());
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
