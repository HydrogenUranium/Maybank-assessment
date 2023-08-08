package com.positive.dhl.core.rss;

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
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.stream.Collectors;

import static com.positive.dhl.core.utils.AssertXml.assertXmlEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DiscoverRssFeedTest {
    private final AemContext context = new AemContext();

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();

    @Mock
    private MockRequestDispatcherFactory dispatcherFactory;

    @Mock
    private RequestDispatcher dispatcher;

    @BeforeEach
    void setUp() {
        context.load().json("/com/positive/dhl/core/servlets/RssFeedRenderServlet/repository.json", "/content/dhl");
    }

    @Test
    void printHeaderAndFooter_ShouldAddDataToResponse_WhenResourceExist() throws IOException {
        String path = "/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales";
        request.setResource(context.resourceResolver().getResource(path));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response);
        rssFeed.printHeader();
        rssFeed.printFooter();

        String responseBody = context.response().getOutputAsString()
                .replaceAll("<pubDate>.+</pubDate>", "<pubDate/>");
        String expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
                "<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n" +
                "<channel>\n" +
                "<link>http://localhost/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.html</link>\n" +
                "<title>The future of cyber sales</title>\n" +
                "<description>description</description>\n" +
                "<language>EN</language>\n" +
                "<region>Global</region>\n" +
                "<pubDate/>\n" +
                "</channel>\n" +
                "</rss>\n";

        assertXmlEquals(expected, responseBody);
    }

    @Test
    void printEntry_ShouldAddDataToResponse_WhenResourceExist() throws IOException {
        String path = "/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales";
        request.setResource(context.resourceResolver().getResource(path));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response);
        rssFeed.printEntry();

        String responseBody = context.response().getOutputAsString()
                .replaceAll("<pubDate>.+</pubDate>", "<pubDate/>");
        String expected = "<item>\n" +
                "<link>http://localhost/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.html</link>\n" +
                "<title>The future of cyber sales</title>\n" +
                "<description>description</description>\n" +
                "<articleBody><![CDATA[<h2>Article Body the-future-of-cyber-sales</h2>]]></articleBody>\n" +
                "<region>Global</region>\n" +
                "<language>EN</language>\n" +
                "<pubDate/>\n" +
                "<tags>tech-futures,culture-hype</tags>\n" +
                "<thumbnail>http://localhost/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.thumb.319.319.png</thumbnail>\n" +
                "</item>\n";

        assertXmlEquals(expected, responseBody);
    }

    @Test
    void printEntry_ShouldAddDataToResponseWithPort_WhenPortIsNotHttp() throws IOException {
        String path = "/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales";
        request.setResource(context.resourceResolver().getResource(path));
        request.setServerPort(4503);

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response);
        rssFeed.printEntry();

        String responseBody = context.response().getOutputAsString()
                .replaceAll("<pubDate>.+</pubDate>", "<pubDate/>");
        String expected = "<item>" +
                "<link>http://localhost:4503/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.html</link>\n" +
                "<title>The future of cyber sales</title>\n" +
                "<description>description</description>\n" +
                "<articleBody><![CDATA[<h2>Article Body the-future-of-cyber-sales</h2>]]></articleBody>\n" +
                "<region>Global</region>\n" +
                "<language>EN</language>\n" +
                "<pubDate/>\n" +
                "<tags>tech-futures,culture-hype</tags>\n" +
                "<thumbnail>http://localhost:4503/content/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.thumb.319.319.png</thumbnail>\n" +
                "</item>\n";

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

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response);
        rssFeed.printEntry(resourceResolver.getResource(articlePath));

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

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response);

        assertThrows(IOException.class, () ->
                rssFeed.printEntry(resourceResolver.getResource(articlePath))
        );
    }

    @Test
    void printEntries_ShouldAddFixedEntries_WhenMaxArgumentProvided() throws IOException, ServletException {
        String path = "/content/dhl/country/en-global/business/productivity";
        String[] articles = new String[]{
                path + "/the-future-of-cyber-sales",
                path + "/ai-science-fiction-it-is-not"
        };
        ResourceResolver resourceResolver = context.resourceResolver();
        Iterator<Resource> articleIterator = Arrays.stream(articles)
                .map(resourceResolver::getResource)
                .collect(Collectors.toList())
                .iterator();
        when(dispatcherFactory.getRequestDispatcher(any(String.class), any())).thenReturn(dispatcher);
        request.setRequestDispatcherFactory(dispatcherFactory);
        request.setResource(resourceResolver.getResource(path));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response);
        rssFeed.printEntries(articleIterator, 1);

        verify(dispatcherFactory, times(1))
                .getRequestDispatcher(anyString(), any());
        verify(dispatcherFactory, times(1))
                .getRequestDispatcher(articles[0] + ".rss.entry.xml", null);
        verify(dispatcher, times(1))
                .include(any(), any());
    }

    @Test
    void printEntries_ShouldAddFixedEntries_WhenMaxArgumentIsNotProvided() throws IOException, ServletException {
        String path = "/content/dhl/country/en-global/business/productivity";
        String[] articles = new String[]{
                path + "/the-future-of-cyber-sales",
                path + "/ai-science-fiction-it-is-not"
        };
        ResourceResolver resourceResolver = context.resourceResolver();
        Iterator<Resource> articleIterator = Arrays.stream(articles)
                .map(resourceResolver::getResource)
                .collect(Collectors.toList())
                .iterator();
        when(dispatcherFactory.getRequestDispatcher(any(String.class), any())).thenReturn(dispatcher);
        request.setRequestDispatcherFactory(dispatcherFactory);
        request.setResource(resourceResolver.getResource(path));

        DiscoverRssFeed rssFeed = new DiscoverRssFeed(request, response);
        rssFeed.printEntries(articleIterator);


        verify(dispatcherFactory, times(2))
                .getRequestDispatcher(anyString(), any());
        for (String article : articles) {
            verify(dispatcherFactory, times(1))
                    .getRequestDispatcher(article + ".rss.entry.xml", null);
        }
        verify(dispatcher, times(2))
                .include(any(), any());
    }
}