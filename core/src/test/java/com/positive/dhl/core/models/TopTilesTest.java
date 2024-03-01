package com.positive.dhl.core.models;

import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import com.positive.dhl.core.services.TagUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.day.cq.wcm.api.designer.Style;
import java.util.Arrays;
import java.util.Locale;

import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TopTilesTest {
    private final AemContext context = new AemContext();

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private Style currentStyle;

    @BeforeEach
    void setUp() throws Exception {
        context.addModelsForClasses(TopTiles.class);
        context.load().json("/com/positive/dhl/core/models/TopTiles/content.json", "/content");

        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);

        when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
        when(pathUtilService.resolveAssetPath(any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/prefix" + invocationOnMock.getArgument(0, String.class) : "";
        });
        when(pathUtilService.resolveAssetPath(any(), anyBoolean(), any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            Boolean useOptimized = invocationOnMock.getArgument(1, Boolean.class);
            String prefix = useOptimized ? "/optimized" : "/prefix";
            return StringUtils.isNotBlank(path) ? prefix + invocationOnMock.getArgument(0, String.class) : "";
        });
        when(pathUtilService.resolveAssetPath(any(), anyBoolean())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            Boolean useOptimized = invocationOnMock.getArgument(1, Boolean.class);
            String prefix = useOptimized ? "/optimized" : "/prefix";
            return StringUtils.isNotBlank(path) ? prefix + invocationOnMock.getArgument(0, String.class) : "";
        });
        mockInject(context, "script-bindings", "currentStyle", currentStyle);
        when(currentStyle.get("enableAssetDelivery", false)).thenReturn(false);
        lenient().when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class)))
                .thenAnswer(invocationOnMock -> createArticleModel(context.resourceResolver().getResource("/content/article_1")));
    }

    @Test
    void init_ShouldInitArticles_WhenArticlesAreConfigured() {
        TopTiles topTiles = context.resourceResolver().getResource("/content/top-tiles").adaptTo(TopTiles.class);

        assertNotNull(topTiles);
        assertEquals(4, topTiles.getArticles().size());

        Article article = topTiles.getArticles().get(0);
        assertEquals("/prefix/content/dam/mob.jpg", article.getHeroimagemob());
        assertEquals("/prefix/content/dam/mob.jpg", article.getHeroimagetab());
        assertEquals("/prefix/content/dam/mob.jpg", article.getHeroimagedt());

        Article secondArticle = topTiles.getArticles().get(1);
        assertEquals("/prefix/content/dam/overridden-mobile.png", secondArticle.getHeroimagemob());
        assertEquals("/prefix/content/dam/overridden-desktop.png", secondArticle.getHeroimagetab());
        assertEquals("/prefix/content/dam/overridden-desktop.png", secondArticle.getHeroimagedt());
    }

    private Article createArticleModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}