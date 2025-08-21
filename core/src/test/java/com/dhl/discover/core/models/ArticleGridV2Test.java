package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.models.search.SearchResultEntry;
import com.dhl.discover.core.services.*;
import com.dhl.discover.junitUtils.InjectorMock;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import static com.dhl.discover.junitUtils.InjectorMock.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
@MockitoSettings(strictness = Strictness.LENIENT)
class ArticleGridV2Test {
    private final AemContext context = new AemContext();
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    protected Style currentStyle;

    @Mock
    private ArticleSearchService articleSearchService;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private AssetUtilService assetUtilService;

    @Mock
    private PathUtilService pathUtilService;

    private void initRequest(String pagePath, String resourcePath) {
        Resource resource = resourceResolver.getResource(resourcePath);
        Page page = context.pageManager().getPage(pagePath);

        context.currentPage(page);
        request.setPathInfo(pagePath);
        request.setResource(resource);
    }

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(ArticleGridV2.class);
        context.registerService(ArticleSearchService.class, articleSearchService);
        context.registerService(AssetUtilService.class, assetUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.load().json("/com/dhl/discover/core/models/ArticleGridV2/content.json", "/content");
        mockInject(context, INJECT_SCRIPT_BINDINGS, "currentStyle", currentStyle);
        when(currentStyle.get("enableAssetDelivery", false)).thenReturn(false);
        when(pageUtilService.getLocale(any(Resource.class))).thenReturn(Locale.forLanguageTag("en"));
        when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#BusinessAdvice", "#eCommerceAdvice", "#InternationalShipping"));
        when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#SmallBusinessAdvice");
        when(assetUtilService.getPageImagePath(any(Resource.class))).thenReturn("/content/dam/image.jpg");

        mockInjectHomeProperty(context, "articleGrid-title", "Categories");
        mockInjectHomeProperty(context, "articleGrid-allTitle", "All");
        mockInjectHomeProperty(context, "articleGrid-sortTitle", "Sort By");
        mockInjectHomeProperty(context, "articleGrid-latestOptionTitle", "Latest");
        mockInjectHomeProperty(context, "articleGrid-showTags", "false");
        com.adobe.cq.wcm.core.components.models.Image mockImage =
                mock(com.adobe.cq.wcm.core.components.models.Image.class);
        when(mockImage.getSrc()).thenReturn("/content/dam/image.jpg");
        when(mockImage.getSrcset()).thenReturn("");
        when(mockImage.getAlt()).thenReturn("");

        mockInject(context,
                InjectorMock.INJECT_CHILD_IMAGE_MODEL,
                "jcr:content/cq:featuredimage",
                mockImage);
    }

    private Article getArticle(String path) {
        return context.getService(ModelFactory.class).createModel(resourceResolver.getResource(path), Article.class);
    }

    @Test
    void test_ChildCategories() throws JsonProcessingException {
        when(articleSearchService.getAllArticles(any(Page.class), any(SlingHttpServletRequest.class))).thenAnswer(invocationOnMock -> {
            Page rootPage = invocationOnMock.getArgument(0, Page.class);
            String path = rootPage.getPath();
            if (path.equals("/content/home")) {
                return List.of(
                        getArticle("/content/home/e-commerce-advice/article"),
                        getArticle("/content/home/b2b-advice/article")
                );
            }
            List<Article> articles = new ArrayList<>();
            rootPage.listChildren().forEachRemaining(page -> articles.add(getArticle(page.getPath())));
            return articles;
        });
        when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + invocationOnMock.getArgument(0, String.class) : "";
        });

        initRequest("/content/home", "/content/home");
        ArticleGridV2 articleGridV2 = request.adaptTo(ArticleGridV2.class);
        assertNotNull(articleGridV2);

        JsonNode json = new ObjectMapper().readTree(articleGridV2.toJson());

        assertEquals("Categories", articleGridV2.getDefaultTitle());
        assertNull(null, articleGridV2.getTitle());
        assertEquals("All", articleGridV2.getAllCategoryTitle());
        assertEquals("Categories", json.get("title").asText());
        assertEquals("false", json.get("showTags").asText());
        assertEquals(3, json.get("categories").size());
        JsonNode b2bAdviceCategory = json.get("categories").get(1);
        JsonNode eCommerceAdviceCategory = json.get("categories").get(2);
        assertEquals("B2B Advice - title", b2bAdviceCategory.get("name").asText());
        assertEquals("E-commerce Advice - navTitle", eCommerceAdviceCategory.get("name").asText());
        JsonNode article = eCommerceAdviceCategory.get("articles").get(0);
        assertEquals("What paperwork do I need for international shipping?", article.get("title").asText());
        assertEquals("/content/home/e-commerce-advice/article.html", article.get("path").asText());
        assertEquals("/discover/content/dam/image.jpg", article.get("pageImage").asText());
    }

    @Test
    void test_TagBasedCategories() throws JsonProcessingException {
        Article article = getArticle("/content/home/e-commerce-advice/article");
        when(articleSearchService.findArticlesByTag(anyList(), anyString(), any(SlingHttpServletRequest.class)))
                .thenReturn(List.of(new SearchResultEntry(article)));
        when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + invocationOnMock.getArgument(0, String.class) : "";
        });

        initRequest("/content/home/b2b-advice", "/content/home/b2b-advice/jcr:content/article_grid");
        ArticleGridV2 articleGridV2 = request.adaptTo(ArticleGridV2.class);
        assertNotNull(articleGridV2);

        JsonNode json = new ObjectMapper().readTree(articleGridV2.toJson());

        assertEquals("Categories", articleGridV2.getDefaultTitle());
        assertEquals("Articles", articleGridV2.getTitle());
        assertEquals("All", articleGridV2.getAllCategoryTitle());
        assertEquals("Articles", json.get("title").asText());
        assertEquals("false", json.get("showTags").asText());
        assertEquals(2, json.get("categories").size());
        JsonNode productivityCategory = json.get("categories").get(0);
        JsonNode innovationCategory = json.get("categories").get(1);
        assertEquals("Productivity", productivityCategory.get("name").asText());
        assertEquals("Innovation", innovationCategory.get("name").asText());
        JsonNode articleJson = productivityCategory.get("articles").get(0);
        assertEquals("What paperwork do I need for international shipping?", articleJson.get("title").asText());
        assertEquals("/content/home/e-commerce-advice/article.html", articleJson.get("path").asText());
        assertEquals("/discover/content/dam/image.jpg", articleJson.get("pageImage").asText());
    }

    @Test
    void test_HasArticles() {
        when(articleSearchService.getAllArticles(any(Page.class), any(SlingHttpServletRequest.class))).thenAnswer(invocationOnMock -> {
            Page rootPage = invocationOnMock.getArgument(0, Page.class);
            String path = rootPage.getPath();
            if (path.equals("/content/home")) {
                return List.of(
                        getArticle("/content/home/e-commerce-advice/article"),
                        getArticle("/content/home/b2b-advice/article")
                );
            }
            List<Article> articles = new ArrayList<>();
            rootPage.listChildren().forEachRemaining(page -> articles.add(getArticle(page.getPath())));
            return articles;
        });
        when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + invocationOnMock.getArgument(0, String.class) : "";
        });

        initRequest("/content/home", "/content/home");
        ArticleGridV2 articleGridV2 = request.adaptTo(ArticleGridV2.class);
        assertNotNull(articleGridV2);

        assertTrue(articleGridV2.hasArticles());
    }
}