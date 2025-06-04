package com.dhl.discover.core.servlets;

import com.dhl.discover.core.models.search.SearchResultEntry;
import com.dhl.discover.core.models.Article;
import com.dhl.discover.core.services.*;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.commons.util.StringUtils;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.query.Query;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class GetArticlesServletTest {
    public static final String CF_PATH = "/content/dam/global-master/8-site-images/roundels/anna_thompson";
    public static final String CONTENT_PATH = "/com/dhl/discover/core/services/ArticleServiceTest/content.json";
    public static final String TEST_CF_RESOURCE_PATH = "/com/dhl/discover/core/models/Article/content-fragment.json";

    private final AemContext context = new AemContext();

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();
    private final ResourceResolver resolver = context.resourceResolver();

    @InjectMocks
    private GetArticlesServlet servlet;

    @Mock
    private ArticleService articleService;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @Mock
    private ResourceResolver resolverMock;

    @Mock
    private AssetUtilService assetUtilService;

    @BeforeEach
    void setUp() {
        context.requestPathInfo().setResourcePath("/content");
        context.load().json(CONTENT_PATH, "/content");
        context.load().json(TEST_CF_RESOURCE_PATH, CF_PATH);

        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);

        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
        when(assetUtilService.getThumbnailLink(any())).thenReturn("/thumbnail.png");
        when(assetUtilService.getPageImagePath(any(Resource.class))).thenReturn("/content/dam/global-master/4-logistics-advice/essential-guides/dis0880-what-paperwork-do-i-need-for-international-shipping-/Mobile_991x558_V01.jpg");

        Article article1 = createArticleModel(context.resourceResolver().getResource("/content/home/article_1"));
        Article article2 = createArticleModel(context.resourceResolver().getResource("/content/home/article_2"));
        lenient().when(articleService.findArticles(anyString(), anyString(), any(ResourceResolver.class), anyBoolean()))
                .thenReturn(List.of(new SearchResultEntry(article1), new SearchResultEntry(article2)));

        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resolverMock);
        when(resolverMock.findResources(anyString(), anyString())).thenAnswer(invocationOnMock ->
                resolver.findResources(invocationOnMock.getArgument(0), Query.JCR_SQL2));
        request.setResource(resolver.getResource("/content"));
    }

    @Test
    void doGet_withoutParameters() throws IOException {
        servlet.doGet(request, response);
        String responseBody = context.response().getOutputAsString();
        assertEquals("[]", responseBody);
    }

    @Test
    void doGet_withParameters() throws IOException {
        lenient().when(pathUtilService.map(any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/discover" + invocationOnMock.getArgument(0, String.class) : "";
        });
        request.setParameterMap(Map.of("s", "searchTerm", "homepagepath", "/content"));
        servlet.doGet(request, response);
        String responseBody = context.response().getOutputAsString();

        String expected = "[" +
                "{" +
                    "\"article\":{" +
                        "\"createdfriendly\":\"August 3, 2023\"," +
                        "\"created\":\"2023-08-03\"," +
                        "\"createdMilliseconds\":1691046000000," +
                        "\"groupTag\":\"#CategoryPage\"," +
                        "\"title\":\"What paperwork do I need for international shipping?\"," +
                        "\"description\":\"What paperwork do I need for international shipping?\"," +
                        "\"author\":\"Adam Riley\"," +
                        "\"readtime\":\"4 min read\"," +
                        "\"pageImage\":\"/discover/content/dam/global-master/4-logistics-advice/essential-guides/dis0880-what-paperwork-do-i-need-for-international-shipping-/Mobile_991x558_V01.jpg\"," +
                        "\"tagsToShow\":[\"#CategoryPage\"]," +
                        "\"path\":\"/content/home/article_1.html\"," +
                        "\"thumbnail\":\"/discover/thumbnail.png\"" +
                    "}," +
                    "\"excerpt\":\"\"" +
                "}," +
                "{" +
                    "\"article\":{" +
                        "\"createdfriendly\":\"August 4, 2023\"," +
                        "\"created\":\"2023-08-04\"," +
                        "\"createdMilliseconds\":1691132400000," +
                        "\"groupTag\":\"#CategoryPage\"," +
                        "\"title\":\"What paperwork do I need for international shipping?\"," +
                        "\"description\":\"What paperwork do I need for international shipping?\"," +
                        "\"author\":\"Adam Riley\"," +
                        "\"readtime\":\"4 min read\"," +
                        "\"pageImage\":\"/discover/content/dam/global-master/4-logistics-advice/essential-guides/dis0880-what-paperwork-do-i-need-for-international-shipping-/Mobile_991x558_V01.jpg\"," +
                        "\"tagsToShow\":[\"#CategoryPage\"]," +
                        "\"path\":\"/content/home/article_2.html\"," +
                        "\"thumbnail\":\"/discover/thumbnail.png\"" +
                    "}," +
                    "\"excerpt\":\"\"" +
                "}" +
        "]";
        assertEquals(expected, responseBody);
    }

    private Article createArticleModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}
