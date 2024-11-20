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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.day.cq.wcm.api.designer.Style;
import java.util.Arrays;
import java.util.Locale;

import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
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

    @Mock
    private AssetUtilService assetUtilService;

    @BeforeEach
    void setUp() throws Exception {
        context.addModelsForClasses(TopTiles.class);
        context.load().json("/com/dhl/discover/core/models/TopTiles/content.json", "/content");

        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);

        when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
        mockInject(context, "script-bindings", "currentStyle", currentStyle);
        when(currentStyle.get("enableAssetDelivery", false)).thenReturn(false);
        when(assetUtilService.getThumbnailLink(any())).thenReturn("/thumbnail.png");
        lenient().when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class)))
                .thenAnswer(invocationOnMock -> createArticleModel(context.resourceResolver().getResource("/content/article_1")));
    }

    @Test
    void init_ShouldInitArticles_WhenArticlesAreConfigured() {
        TopTiles topTiles = context.resourceResolver().getResource("/content/top-tiles").adaptTo(TopTiles.class);

        assertNotNull(topTiles);
        assertEquals(4, topTiles.getArticles().size());

        Article article = topTiles.getArticles().get(0);
        assertEquals("/content/dam/mob.jpg", article.getHeroimagemob());
        assertEquals("/content/dam/mob.jpg", article.getHeroimagetab());
        assertEquals("/content/dam/mob.jpg", article.getHeroimagedt());

        Article secondArticle = topTiles.getArticles().get(1);
        assertEquals("/content/dam/overridden-mobile.png", secondArticle.getHeroimagemob());
        assertEquals("/content/dam/overridden-desktop.png", secondArticle.getHeroimagetab());
        assertEquals("/content/dam/overridden-desktop.png", secondArticle.getHeroimagedt());
    }

    private Article createArticleModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}