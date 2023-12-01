package com.positive.dhl.core.models;

import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.TagUtilService;
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

import java.util.Arrays;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TopTilesTest {
    private final AemContext context = new AemContext();

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @BeforeEach
    void setUp() throws Exception {
        context.addModelsForClasses(TopTiles.class);
        context.load().json("/com/positive/dhl/core/models/TopTiles/content.json", "/content");

        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);

        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
    }

    @Test
    void init_ShouldInitArticles_WhenArticlesAreConfigured() {
        Article article = createArticleModel(context.resourceResolver().getResource("/content/top-tiles"));
        when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        TopTiles topTiles = context.resourceResolver().getResource("/content/top-tiles").adaptTo(TopTiles.class);

        assertEquals(4, topTiles.getArticles().size());
    }

    private Article createArticleModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}