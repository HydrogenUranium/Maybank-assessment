package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.positive.dhl.core.services.ArticleService;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.InitUtil;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static com.positive.dhl.core.utils.InjectorMock.mockInjectHomeProperty;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleGridV2Test {
    private final AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private InitUtil initUtil;

    @Mock
    private AssetUtilService assetUtilService;

    @Mock
    private ArticleService articleService;

    private void initRequest(String path) {
        request.setPathInfo(path);
        Resource resource = resourceResolver.getResource(path);
        Page page = resource.adaptTo(Page.class);
        request.setResource(resourceResolver.getResource(path));
        mockInject(context, "currentPage", page);
    }

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(ArticleGridV2.class);
        context.registerService(InitUtil.class, initUtil);
        context.registerService(AssetUtilService.class, assetUtilService);
        context.registerService(ArticleService.class, articleService);
        context.load().json("/com/positive/dhl/core/models/ArticleGridV2/content.json", "/content");
    }

    private Article getArticle(String path) {
        return new Article(path, resourceResolver);
    }

    @Test
    void test() throws JsonProcessingException {
        when(articleService.getLatestArticles(any(Page.class), anyInt())).thenAnswer(invocationOnMock -> {
            Page rootPage = invocationOnMock.getArgument(0, Page.class);
            String path = rootPage.getPath();
            if (path.equals("/content/home")) {
                return List.of(
                        getArticle("/content/home/e-commerce-advice/article"),
                        getArticle("/content/home/b2b-advice/article")
                );
            }
            List<Article> articles = new ArrayList<>();
            rootPage.listChildren().forEachRemaining(page -> articles.add(new Article(page.getPath(), resourceResolver)));
            return articles;
        });
        when(assetUtilService.resolvePath(anyString())).thenReturn("/content/dhl/dam.png");
        mockInjectHomeProperty(context, "articleGrid-title", "Categories");
        mockInjectHomeProperty(context, "articleGrid-allTitle", "All");
        mockInjectHomeProperty(context, "articleGrid-sortTitle", "Sort By");
        mockInjectHomeProperty(context, "articleGrid-latestOptionTitle", "Latest");
        mockInjectHomeProperty(context, "articleGrid-showTags", "false");

        initRequest("/content/home");
        ArticleGridV2 articleGridV2 = request.adaptTo(ArticleGridV2.class);

        JsonNode json = new ObjectMapper().readTree(articleGridV2.toJson());

        assertNotNull(articleGridV2);
        assertEquals("Categories", articleGridV2.getTitle());
        assertEquals("All", articleGridV2.getAllCategoriesTitle());
        assertEquals("Categories", json.get("title").asText());
        assertEquals("false", json.get("showTags").asText());
        JsonNode allCategory = json.get("categories").get(0);
        assertEquals("All", allCategory.get("name").asText());
        JsonNode article = allCategory.get("articles").get(0);
        assertEquals("What paperwork do I need for international shipping?", article.get("title").asText());
        assertEquals("/content/home/e-commerce-advice/article.html", article.get("link").asText());
    }
}