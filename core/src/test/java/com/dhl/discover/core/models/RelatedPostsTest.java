package com.dhl.discover.core.models;

import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.ArticleUtilService;
import com.dhl.discover.core.services.TagUtilService;
import com.dhl.discover.core.services.PathUtilService;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.junitUtils.InjectorMock;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Locale;

import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
import static com.dhl.discover.junitUtils.InjectorMock.mockInjectHomeProperty;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class RelatedPostsTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private ArticleUtilService  articleUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private Style currentStyle;

    @Mock
    private AssetUtilService assetUtilService;

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/dhl/discover/core/models/RelatedPosts/content.json", "/content");
        context.addModelsForClasses(RelatedPosts.class);
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(ArticleUtilService.class, articleUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);

        mockInject(context, "script-bindings", "currentStyle", currentStyle);
        mockInject(context, InjectorMock.INJECT_CHILD_IMAGE_MODEL, "jcr:content/cq:featuredimage", null);
        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(Locale.forLanguageTag("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void init_ShouldInitRelatedPosts_WhenContainsCustomTitle() {
        Article article = createArticleModel(context.resourceResolver().getResource("/content/home"));
        when(articleUtilService.getArticle(anyString(), any(SlingHttpServletRequest.class))).thenReturn(article);

        initRequest("/content/home/jcr:content/par/related_posts_with_title");
        mockInjectHomeProperty(context, "relatedPosts-title" ,"");
        RelatedPosts relatedPosts = request.adaptTo(RelatedPosts.class);

        assertNotNull(relatedPosts);
        assertEquals("Custom Title", relatedPosts.getTitle());
        assertEquals(5, relatedPosts.getArticles().size());
    }

    @Test
    void init_ShouldInitRelatedPosts_WhenDoNotContainTitle() {
        Article article = createArticleModel(context.resourceResolver().getResource("/content/home"));
        when(articleUtilService.getArticle(anyString(), any(SlingHttpServletRequest.class))).thenReturn(article);

        initRequest("/content/home/jcr:content/par/related_posts_without_title");
        mockInjectHomeProperty(context, "relatedPosts-title" ,"Related Posts");
        RelatedPosts relatedPosts = request.adaptTo(RelatedPosts.class);

        assertEquals("Related Posts", relatedPosts.getTitle());
        assertEquals(5, relatedPosts.getArticles().size());
    }

    private Article createArticleModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}