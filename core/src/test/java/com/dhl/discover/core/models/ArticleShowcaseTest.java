package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.ArticleService;
import com.dhl.discover.core.services.ArticleUtilService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

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

    @Mock
    private ArticleUtilService articleUtilService;

    @BeforeEach
    void setUp() throws Exception {
        context.registerService(PageUtilService.class, pageUtils);
        context.registerService(ArticleService.class, articleService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(ArticleUtilService.class, articleUtilService);
        context.addModelsForClasses(ArticleShowcase.class);
        context.currentPage(page);
        context.load().json("/com/dhl/discover/core/models/ArticleShowcase/content.json", "/content");
        lenient().when(articleUtilService.getArticle(anyString(), any(SlingHttpServletRequest.class))).thenReturn(article);
        mockInject(context, "script-bindings", "currentStyle", currentStyle);
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
        assertEquals("Trending posts", showcase.getTitle());
        assertEquals("horizontal", showcase.getDesignMode());
        assertEquals("See All Latest Posts", showcase.getLinkName());
        assertEquals("/content/dhl/au", showcase.getLinkPath());
        assertNull(showcase.getShowTags());
        assertEquals("h3", showcase.getArticlesTitleType());
        assertEquals("h2", showcase.getTitleType());
        assertEquals("customPick", showcase.getSource());
        assertEquals("See All Latest Posts", showcase.getLinkName());
    }

    @Test
    void init_ShouldInitArticles_WhenArticlesAreConfiguredToUseLatestPosts() {
        when(pageUtils.getHomePage(any(Page.class))).thenReturn(page);
        when(articleService.getLatestArticles(any(Page.class), anyInt(), any(SlingHttpServletRequest.class))).thenReturn(List.of(article));
        initRequest("/content/home/jcr:content/par/article-showcase_latest-posts");

        ArticleShowcase showcase = request.adaptTo(ArticleShowcase.class);

        assertNotNull(showcase);
        List<Article> articles = showcase.getArticles();
        assertEquals(1, articles.size());
        assertEquals(article, articles.get(0));
    }

    @Test
    void initCustomPick_ShouldReturn_WhenArticleResourcesIsNull() throws IllegalAccessException, NoSuchFieldException {
        ArticleShowcase showcase = new ArticleShowcase();
        Field articlesField = ArticleShowcase.class.getDeclaredField("articles");
        articlesField.setAccessible(true);
        articlesField.set(showcase, new ArrayList<>());

        Field articleResourcesField = ArticleShowcase.class.getDeclaredField("articleResources");
        articleResourcesField.setAccessible(true);
        articleResourcesField.set(showcase, null);

        Field articleUtilServiceField = ArticleShowcase.class.getDeclaredField("articleUtilService");
        articleUtilServiceField.setAccessible(true);
        articleUtilServiceField.set(showcase, articleUtilService);

        showcase.initCustomPick();

        assertEquals(0, showcase.getArticles().size(), "Articles list should remain empty when articleResources is null");
        verify(articleUtilService, never()).getArticle(anyString(), any(SlingHttpServletRequest.class));
    }
    @Test
    void initCustomPick_ShouldReturn_WhenArticleResourcesIsEmpty() throws IllegalAccessException {
        ArticleShowcase showcase = new ArticleShowcase();
        Field field = null;
        try {
            field = ArticleShowcase.class.getDeclaredField("articleResources");
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e);
        }
        field.setAccessible(true);
        field.set(showcase, new ArrayList<>());

        showcase.initCustomPick();

        assertEquals(0, showcase.getArticles().size());
    }

}