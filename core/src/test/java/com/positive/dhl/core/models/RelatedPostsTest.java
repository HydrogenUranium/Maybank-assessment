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
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Locale;

import static com.positive.dhl.core.utils.InjectorMock.mockInjectHomeProperty;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
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
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/positive/dhl/core/models/RelatedPosts/content.json", "/content");
        context.addModelsForClasses(RelatedPosts.class);
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);

        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
        lenient().when(pathUtilService.resolveAssetPath(any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/prefix" + invocationOnMock.getArgument(0, String.class) : "";
        });
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void init_ShouldInitRelatedPosts_WhenContainsCustomTitle() {
        Article article = createArticleModel(context.resourceResolver().getResource("/content/home"));
        when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        initRequest("/content/home/jcr:content/par/related_posts_with_title");
        mockInjectHomeProperty(context, "relatedPosts-title" ,"");
        RelatedPosts relatedPosts = request.adaptTo(RelatedPosts.class);

        assertEquals("Custom Title", relatedPosts.getTitle());
        assertEquals(5, relatedPosts.getArticles().size());
    }

    @Test
    void init_ShouldInitRelatedPosts_WhenDoNotContainTitle() {
        Article article = createArticleModel(context.resourceResolver().getResource("/content/home"));
        when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

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