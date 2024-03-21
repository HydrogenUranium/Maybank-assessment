package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.positive.dhl.core.services.ArticleService;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleShowcaseTest {
    private final AemContext context = new AemContext();
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private PageUtilService pageUtils;

    @Mock
    private ArticleService articleService;

    @Mock
    private Page page;

    @Mock
    private Article article;

    @Mock
    private Style currentStyle;

    @Mock
    private PathUtilService pathUtilService;

    @BeforeEach
    void setUp() throws Exception {
        context.registerService(PageUtilService.class, pageUtils);
        context.registerService(ArticleService.class, articleService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.addModelsForClasses(ArticleShowcase.class);
        mockInject(context, "currentPage", page);
        context.load().json("/com/positive/dhl/core/models/ArticleShowcase/content.json", "/content");
        lenient().when(pageUtils.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);
        mockInject(context, "script-bindings", "currentStyle", currentStyle);
        when(currentStyle.get("enableAssetDelivery", false)).thenReturn(false);
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void init_ShouldInitArticles_WhenArticlesAreConfiguredToUseCustomPicks() {
        initRequest("/content/home/jcr:content/par/article-showcase");
        ArticleShowcase showcase = request.adaptTo(ArticleShowcase.class);

        assertEquals(4, showcase.getArticles().size());
    }

    @Test
    void init_ShouldInitArticles_WhenArticlesAreConfiguredToUseLatestPosts() {
        when(pageUtils.getHomePage(any())).thenReturn(page);
        when(articleService.getLatestArticles(any(Page.class), anyInt())).thenReturn(List.of(article));
        initRequest("/content/home/jcr:content/par/article-showcase_latest-posts");

        ArticleShowcase showcase = request.adaptTo(ArticleShowcase.class);

        assertNotNull(showcase);
        List<Article> articles = showcase.getArticles();
        assertEquals(1, articles.size());
        assertEquals(article, articles.get(0));
    }
}