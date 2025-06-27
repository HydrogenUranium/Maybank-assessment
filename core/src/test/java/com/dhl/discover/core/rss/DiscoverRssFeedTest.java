package com.dhl.discover.core.rss;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.TagManager;
import com.dhl.discover.core.models.Article;
import com.dhl.discover.core.services.*;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.junitUtils.InjectorMock;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockRequestDispatcherFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Arrays;

import static com.dhl.discover.junitUtils.AssertXml.assertXmlEquals;
import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DiscoverRssFeedTest {
    private final AemContext context = new AemContext();

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();

    @Spy
    private PageContentExtractorService pageExtractor;

    @Mock
    private LaunchService launchService;

    @Spy
    @InjectMocks
    private PageUtilService pageUtilService;

    @Spy
    private PathUtilService pathUtilService;


    @Mock
    private AssetUtilService assetUtilService;

    @Spy
    private TagUtilService tagUtilService;

    @Mock
    private MockRequestDispatcherFactory dispatcherFactory;

    @Mock
    private RequestDispatcher dispatcher;

    @BeforeEach
    void setUp() throws InvalidTagFormatException {
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        mockInject(context, InjectorMock.INJECT_CHILD_IMAGE_MODEL, "jcr:content/cq:featuredimage", null);

        context.load().json("/com/dhl/discover/core/servlets/RssFeedRenderServlet/repository.json", "/content/dhl");
        context.addModelsForClasses(Article.class);
        TagManager tagManager = context.resourceResolver().adaptTo(TagManager.class);
        tagManager.createTag("dhl:tech-futures", "Tech Futures", "description");
        tagManager.createTag("dhl:culture-hype", "Culture Hype", "description");

        when(assetUtilService.getThumbnailLink(any())).thenReturn("/thumbnail.png");
        lenient().when(launchService.resolveOutOfScopeLaunchPage(any(Page.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void printHeaderAndFooter_ShouldAddDataToResponse_WhenResourceExist() throws IOException {
        String path = "/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales";
        request.setResource(context.resourceResolver().getResource(path));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response, pageExtractor, pageUtilService);
        rssFeed.printHeader();
        rssFeed.printFooter();

        String responseBody = context.response().getOutputAsString()
                .replaceAll("<pubDate>.+</pubDate>", "<pubDate/>");
        String expected = """
      <?xml version="1.0" encoding="utf-8"?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
      <link>/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.html</link>
      <title>The future of cyber sales</title>
      <description>description</description>
      <language>en</language>
      <region>Global</region>
      <pubDate/>
      </channel>
      </rss>
      """;

        assertXmlEquals(expected, responseBody);
    }

    @Test
    void printEntry_ShouldAddDataToResponse_WhenResourceExist() throws IOException {
        String path = "/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales";
        request.setResource(context.resourceResolver().getResource(path));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response, pageExtractor, pageUtilService);
        rssFeed.printEntry();

        String responseBody = context.response().getOutputAsString()
                .replaceAll("<pubDate>.+</pubDate>", "<pubDate/>");
        String expected = """
                    <item>
                    <link>/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.html</link>
                    <title>The future of cyber sales</title>
                    <description>description</description>
                    <articleBody><![CDATA[<h2>Article Body the-future-of-cyber-sales</h2>]]></articleBody>
                    <region>Global</region>
                    <language>en</language>
                    <pubDate/>
                    <tags>Tech Futures,Culture Hype</tags>
                    <thumbnail/>
                    </item>
                    """;

        assertXmlEquals(expected, responseBody);
    }

    @Test
    void printEntry_ShouldAddFullBody_WhenFullBodyIsTrue() throws IOException {
        String path = "/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales";
        request.setResource(context.resourceResolver().getResource(path));
        doReturn("<div>full body</div>").when(pageExtractor).extract(any(Resource.class));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response, pageExtractor, pageUtilService);
        rssFeed.printEntry(true);

        String responseBody = context.response().getOutputAsString()
                .replaceAll("<pubDate>.+</pubDate>", "<pubDate/>");
        String expected = """
                        <item>
                        <link>/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.html</link>
                        <title>The future of cyber sales</title>
                        <description>description</description>
                        <articleBody><![CDATA[<div>full body</div>]]></articleBody>
                        <region>Global</region>
                        <language>en</language>
                        <pubDate/>
                        <tags>Tech Futures,Culture Hype</tags>
                        <thumbnail/>
                        </item>
                        """;

        assertXmlEquals(expected, responseBody);
    }

    @Test
    void printEntry_ShouldAddDataToResponseWithPort_WhenPortIsNotHttp() throws IOException {
        String path = "/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales";
        request.setResource(context.resourceResolver().getResource(path));
        request.setServerPort(4503);

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response, pageExtractor, pageUtilService);
        rssFeed.printEntry();

        String responseBody = context.response().getOutputAsString()
                .replaceAll("<pubDate>.+</pubDate>", "<pubDate/>");
        String expected = """
                        <item>
                        <link>/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.html</link>
                        <title>The future of cyber sales</title>
                        <description>description</description>
                        <articleBody><![CDATA[<h2>Article Body the-future-of-cyber-sales</h2>]]></articleBody>
                        <region>Global</region>
                        <language>en</language>
                        <pubDate/>
                        <tags>Tech Futures,Culture Hype</tags>
                        <thumbnail/>
                        </item>
                        """;

        assertXmlEquals(expected, responseBody);
    }

    @Test
    void printChildEntry_ShouldAddDataToResponse_WhenResourceExist() throws IOException, ServletException {
        String path = "/content/dhl/country/en-global/business/productivity";
        String articlePath = path + "/the-future-of-cyber-sales";
        ResourceResolver resourceResolver = context.resourceResolver();
        when(dispatcherFactory.getRequestDispatcher(any(String.class), any())).thenReturn(dispatcher);
        request.setRequestDispatcherFactory(dispatcherFactory);
        request.setResource(resourceResolver.getResource(path));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response, pageExtractor, pageUtilService);
        rssFeed.printEntry(articlePath, false);

        verify(dispatcherFactory, times(1))
                .getRequestDispatcher(articlePath + ".rss.entry.xml", null);
        verify(dispatcher, times(1))
                .include(any(), any());
    }

    @Test
    void printChildEntry_ShouldThrowException_WhenResourceExist() throws IOException, ServletException {
        String path = "/content/dhl/country/en-global/business/productivity";
        String articlePath = path + "/the-future-of-cyber-sales";
        ResourceResolver resourceResolver = context.resourceResolver();
        when(dispatcherFactory.getRequestDispatcher(any(String.class), any())).thenReturn(dispatcher);
        doThrow(new ServletException()).when(dispatcher).include(any(), any());
        request.setRequestDispatcherFactory(dispatcherFactory);
        request.setResource(resourceResolver.getResource(path));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response, pageExtractor, pageUtilService);

        assertThrows(IOException.class, () ->
                rssFeed.printEntry(articlePath, false)
        );
    }

    @Test
    void printEntries_ShouldAddEntries_WhenLinksAreProvided() throws IOException, ServletException {
        String path = "/content/dhl/country/en-global/business/productivity";
        String[] articles = new String[]{
                path + "/the-future-of-cyber-sales",
                path + "/ai-science-fiction-it-is-not"
        };
        ResourceResolver resourceResolver = context.resourceResolver();
        when(dispatcherFactory.getRequestDispatcher(any(String.class), any())).thenReturn(dispatcher);
        request.setRequestDispatcherFactory(dispatcherFactory);
        request.setResource(resourceResolver.getResource(path));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response, pageExtractor, pageUtilService);
        rssFeed.printEntries(Arrays.asList(articles), false);

        verify(dispatcherFactory, times(2))
                .getRequestDispatcher(anyString(), any());
        verify(dispatcherFactory, times(1))
                .getRequestDispatcher(articles[0] + ".rss.entry.xml", null);
        verify(dispatcher, times(2))
                .include(any(), any());
    }
}