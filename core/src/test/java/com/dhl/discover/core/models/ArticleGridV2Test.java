package com.dhl.discover.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import static com.dhl.discover.junitUtils.InjectorMock.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleGridV2Test {
    private final AemContext context = new AemContext();
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    protected Style currentStyle;

    @Mock
    private InitUtil initUtil;

    @Mock
    private ArticleService articleService;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private AssetUtilService assetUtilService;

    @Mock
    private PathUtilService pathUtilService;

    private void initRequest(String path) {
        request.setPathInfo(path);
        Resource resource = resourceResolver.getResource(path);
        Page page = resource.adaptTo(Page.class);
        request.setResource(resourceResolver.getResource(path));
        context.currentPage(page);
    }

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(ArticleGridV2.class);
        context.registerService(InitUtil.class, initUtil);
        context.registerService(ArticleService.class, articleService);
        context.registerService(AssetUtilService.class, assetUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.load().json("/com/dhl/discover/core/models/ArticleGridV2/content.json", "/content");
        mockInject(context, INJECT_SCRIPT_BINDINGS, "currentStyle", currentStyle);
        when(currentStyle.get("enableAssetDelivery", false)).thenReturn(false);
        when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#BusinessAdvice", "#eCommerceAdvice", "#InternationalShipping"));
        when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#SmallBusinessAdvice");
        when(assetUtilService.getPageImagePath(any(Resource.class))).thenReturn("/content/dam/image.jpg");
    }

    private Article getArticle(String path) {
        return context.getService(ModelFactory.class).createModel(resourceResolver.getResource(path), Article.class);
    }

    @Test
    void test() throws JsonProcessingException {
        when(articleService.getAllArticles(any(Page.class))).thenAnswer(invocationOnMock -> {
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
        lenient().when(pathUtilService.map(anyString())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + invocationOnMock.getArgument(0, String.class) : "";
        });
        mockInjectHomeProperty(context, "articleGrid-title", "Categories");
        mockInjectHomeProperty(context, "articleGrid-allTitle", "All");
        mockInjectHomeProperty(context, "articleGrid-sortTitle", "Sort By");
        mockInjectHomeProperty(context, "articleGrid-latestOptionTitle", "Latest");
        mockInjectHomeProperty(context, "articleGrid-showTags", "false");

        initRequest("/content/home");
        ArticleGridV2 articleGridV2 = request.adaptTo(ArticleGridV2.class);
        assertNotNull(articleGridV2);

        JsonNode json = new ObjectMapper().readTree(articleGridV2.toJson());

        assertEquals("Categories", articleGridV2.getTitle());
        assertEquals("All", articleGridV2.getAllCategoriesTitle());
        assertEquals("Categories", json.get("title").asText());
        assertEquals("false", json.get("showTags").asText());
        assertEquals(3, json.get("categories").size());
        JsonNode allCategory = json.get("categories").get(0);
        JsonNode b2bAdviceCategory = json.get("categories").get(1);
        JsonNode eCommerceAdviceCategory = json.get("categories").get(2);
        assertEquals("All", allCategory.get("name").asText());
        assertEquals("B2B Advice - title", b2bAdviceCategory.get("name").asText());
        assertEquals("E-commerce Advice - navTitle", eCommerceAdviceCategory.get("name").asText());
        JsonNode article = allCategory.get("articles").get(0);
        assertEquals("What paperwork do I need for international shipping?", article.get("title").asText());
        assertEquals("/content/home/e-commerce-advice/article.html", article.get("path").asText());
        assertEquals("/discover/content/dam/image.jpg", article.get("pageImage").asText());
    }
}