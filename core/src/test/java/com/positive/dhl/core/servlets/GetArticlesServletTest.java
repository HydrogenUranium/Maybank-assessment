package com.positive.dhl.core.servlets;

import com.positive.dhl.core.models.Article;
import com.positive.dhl.core.services.ArticleService;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import com.positive.dhl.core.services.TagUtilService;
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

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class GetArticlesServletTest {
    private final AemContext context = new AemContext();

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();

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


    @BeforeEach
    void setUp() {
        context.requestPathInfo().setResourcePath("/content");
        context.load().json("/com/positive/dhl/core/services/ArticleServiceTest/content.json", "/content");

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

        Article article1 = createArticleModel(context.resourceResolver().getResource("/content/home/article_1"));
        Article article2 = createArticleModel(context.resourceResolver().getResource("/content/home/article_2"));
        lenient().when(articleService.getArticlesByTitle(anyString(), anyString(), any(ResourceResolver.class))).thenReturn(List.of(article1, article2));

        request.setResource(context.resourceResolver().getResource("/content"));
    }

    @Test
    void doGet_withoutParameters() throws IOException {
        servlet.doGet(request, response);
        String responseBody = context.response().getOutputAsString();
        assertEquals("[]", responseBody);
    }

    @Test
    void doGet_withParameters() throws IOException {
        request.setParameterMap(Map.of("s", "searchTerm", "homepagepath", "/content"));
        servlet.doGet(request, response);
        String responseBody = context.response().getOutputAsString();
        String expected = "[" +
                "{" +
                    "\"createdfriendly\":\"August 3, 2023\"," +
                    "\"createdMilliseconds\":1691046000000," +
                    "\"groupTag\":\"#CategoryPage\"," +
                    "\"title\":\"What paperwork do I need for international shipping?\"," +
                    "\"description\":\"What paperwork do I need for international shipping?\"," +
                    "\"author\":\"Anna Thompson\"," +
                    "\"readtime\":\"4 min read\"," +
                    "\"listimage\":\"/prefix/content/dam/global-master/4-logistics-advice/essential-guides/dis0880-what-paperwork-do-i-need-for-international-shipping-/Mobile_991x558_V01.jpg\"," +
                    "\"tagsToShow\":[\"#CategoryPage\"]," +
                    "\"path\":\"/content/home/article_1\"" +
                "}," +
                "{" +
                    "\"createdfriendly\":\"August 4, 2023\"," +
                    "\"createdMilliseconds\":1691132400000," +
                    "\"groupTag\":\"#CategoryPage\"," +
                    "\"title\":\"What paperwork do I need for international shipping?\"," +
                    "\"description\":\"What paperwork do I need for international shipping?\"," +
                    "\"author\":\"Anna Thompson\"," +
                    "\"readtime\":\"4 min read\"," +
                    "\"listimage\":\"/prefix/content/dam/global-master/4-logistics-advice/essential-guides/dis0880-what-paperwork-do-i-need-for-international-shipping-/Mobile_991x558_V01.jpg\"," +
                    "\"tagsToShow\":[\"#CategoryPage\"]," +
                    "\"path\":\"/content/home/article_2\"" +
                "}" +
        "]";
        assertEquals(expected, responseBody);
    }

    private Article createArticleModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}
