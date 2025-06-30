package com.dhl.discover.core.servlets;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.TagManager;
import com.dhl.discover.core.models.Article;
import com.dhl.discover.core.services.*;
import com.dhl.discover.junitUtils.InjectorMock;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockRequestDispatcherFactory;
import org.apache.sling.testing.mock.sling.servlet.MockRequestPathInfo;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

import java.util.ArrayList;
import java.util.List;

import static com.dhl.discover.junitUtils.AssertXml.assertXmlEquals;
import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class RssFeedRenderServletTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();

    @Mock
    private AssetUtilService assetUtilService;

    @Spy
    private TagUtilService tagUtilService;

    @Mock
    private ArticleService articleService;

    private RssFeedRenderServlet servlet;

    @Mock
    private MockRequestDispatcherFactory dispatcherFactory;

    @Mock
    private RequestDispatcher dispatcher;

    @BeforeEach
    void setUp() throws InvalidTagFormatException {
        var launch = context.registerService(new LaunchService());
        var pageUtilService = context.registerInjectActivateService(PageUtilService.class, "launchService", launch);
        var pageExtractor = context.registerService(PageContentExtractorService.class, new PageContentExtractorService());
        context.registerService(AssetUtilService.class, assetUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(ArticleService.class, articleService);

        mockInject(context, InjectorMock.INJECT_CHILD_IMAGE_MODEL, "jcr:content/cq:featuredimage", null);

        servlet = context.registerInjectActivateService(RssFeedRenderServlet.class,
                "pageExtractor", pageExtractor,
                "pageUtilService", pageUtilService,
                "articleService", articleService

        );

        context.load().json("/com/dhl/discover/core/servlets/RssFeedRenderServlet/repository.json", "/content/dhl");
        TagManager tagManager = context.resourceResolver().adaptTo(TagManager.class);
        tagManager.createTag("dhl:tech-futures", "Tech Futures", "description");
        tagManager.createTag("dhl:culture-hype", "Culture Hype", "description");

        when(assetUtilService.getThumbnailLink(any())).thenReturn("/thumbnail.png");
    }


    private MockSlingHttpServletRequest getRequest(String path) {
        MockSlingHttpServletRequest mockRequest = new MockSlingHttpServletRequest(context.resourceResolver(), context.bundleContext());
        mockRequest.setResource(context.resourceResolver().getResource(path));
        return mockRequest;
    }

    @Test
    void doGet_ShouldReturnRSS_WhenConfigurationIsCorrect() throws ServletException {
        List<Article> articles = new ArrayList<>();
        articles.add(request.getResourceResolver().getResource("/content/dhl/country/en-global/business/productivity/ai-science-fiction-it-is-not").adaptTo(Article.class));
        articles.add(request.getResourceResolver().getResource("/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales").adaptTo(Article.class));
        when(articleService.getLatestArticles(any(String.class), anyInt())).thenReturn(articles);

        when(dispatcherFactory.getRequestDispatcher(any(String.class), any())).thenAnswer(getRequestDispatcherInvocation -> {
            String pathWithExtension = getRequestDispatcherInvocation.getArgument(0, String.class);
            String path = pathWithExtension.replace(".rss.entry.xml", "");
            MockSlingHttpServletRequest mockRequest = getRequest(path);
            ((MockRequestPathInfo) mockRequest.getRequestPathInfo()).setSelectorString("rss.entry");
            doAnswer(includeInvocation -> {
                servlet.doGet(mockRequest, includeInvocation.getArgument(1, SlingHttpServletResponse.class));
                return null;
            }).when(dispatcher).include(any(), any(SlingHttpServletResponse.class));
            return dispatcher;
        });
        String path = "/content/dhl/country/en-global";
        ((MockRequestPathInfo) request.getRequestPathInfo()).setSelectorString("rss.all");
        request.setResource(context.resourceResolver().getResource(path));
        context.requestPathInfo().setResourcePath(path);
        request.setRequestDispatcherFactory(dispatcherFactory);

        servlet.doGet(request, response);

        String responseBody = context.response().getOutputAsString()
                .replaceAll("<pubDate>.+</pubDate>", "<pubDate/>");

        String expected = """
            <?xml version="1.0" encoding="utf-8"?>
            <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
            <link>/dhl/country/en-global.html</link>
            <title>E-commerce business &amp; global logistics advice | Discover DHL</title>
            <description/>
            <language>en</language>
            <region>Global</region>
            <pubDate/><item>
            <link>/dhl/country/en-global/business/productivity/ai-science-fiction-it-is-not.html</link>
            <title>AI science fiction it is not</title>
            <description>description</description>
            <articleBody><![CDATA[<h2>Article Body ai-science-fiction-it-is-not</h2>]]></articleBody>
            <region>Global</region>
            <language>en</language>
            <pubDate/>
            <tags/>
            <thumbnail/>
            </item><item>
            <link>/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.html</link>
            <title>The future of cyber sales</title>
            <description>description</description>
            <articleBody><![CDATA[<h2>Article Body the-future-of-cyber-sales</h2>]]></articleBody>
            <region>Global</region>
            <language>en</language>
            <pubDate/>
            <tags>Tech Futures,Culture Hype</tags>
            <thumbnail/>
            </item>
            </channel>
            </rss>
            """;

        assertXmlEquals(expected, responseBody);
    }
}