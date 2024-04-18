package com.positive.dhl.core.servlets;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.TagManager;
import com.positive.dhl.core.services.PageContentExtractorService;
import com.positive.dhl.core.services.PageUtilService;
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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

import static com.positive.dhl.core.utils.AssertXml.assertXmlEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class RssFeedRenderServletTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();

    @Spy
    private PageContentExtractorService pageExtractor;

    @Spy
    private PageUtilService pageUtilService;

    @InjectMocks
    private RssFeedRenderServlet servlet;

    @Mock
    private MockRequestDispatcherFactory dispatcherFactory;

    @Mock
    private RequestDispatcher dispatcher;

    @Mock
    private RssFeedRenderServlet.Configuration configuration;

    @BeforeEach
    void setUp() throws InvalidTagFormatException {
        context.load().json("/com/positive/dhl/core/servlets/RssFeedRenderServlet/repository.json", "/content/dhl");
        TagManager tagManager = context.resourceResolver().adaptTo(TagManager.class);
        tagManager.createTag("dhl:tech-futures", "Tech Futures", "description");
        tagManager.createTag("dhl:culture-hype", "Culture Hype", "description");
    }


    private MockSlingHttpServletRequest getRequest(String path) {
        MockSlingHttpServletRequest mockRequest = new MockSlingHttpServletRequest(context.resourceResolver(), context.bundleContext());
        mockRequest.setResource(context.resourceResolver().getResource(path));
        return mockRequest;
    }

    @Test
    void doGet_ShouldReturnRSS_WhenConfigurationIsCorrect() throws ServletException {
        when(configuration.resourceTypes()).thenReturn(new String[]{"dhl/components/pages/editable-article"});
        when(configuration.maxPages()).thenReturn(1);

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

        servlet.activate(configuration);
        servlet.doGet(request, response);

        String responseBody = context.response().getOutputAsString()
                .replaceAll("<pubDate>.+</pubDate>", "<pubDate/>");

        String expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
                "<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n" +
                "<channel>\n" +
                "<link>http://localhost/dhl/country/en-global.html</link>\n" +
                "<title>E-commerce business &amp; global logistics advice | Discover DHL</title>\n" +
                "<description/>\n" +
                "<language>en</language>\n" +
                "<region>Global</region>\n" +
                "<pubDate/><item>\n" +
                "<link>http://localhost/dhl/country/en-global/business/productivity/ai-science-fiction-it-is-not.html</link>\n" +
                "<title>AI science fiction it is not</title>\n" +
                "<description>description</description>\n" +
                "<articleBody><![CDATA[<h2>Article Body ai-science-fiction-it-is-not</h2>]]></articleBody>\n" +
                "<region>Global</region>\n" +
                "<language>en</language>\n" +
                "<pubDate/>\n" +
                "<tags/>\n" +
                "<thumbnail/>\n" +
                "</item><item>\n" +
                "<link>http://localhost/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.html</link>\n" +
                "<title>The future of cyber sales</title>\n" +
                "<description>description</description>\n" +
                "<articleBody><![CDATA[<h2>Article Body the-future-of-cyber-sales</h2>]]></articleBody>\n" +
                "<region>Global</region>\n" +
                "<language>en</language>\n" +
                "<pubDate/>\n" +
                "<tags>Tech Futures,Culture Hype</tags>\n" +
                "<thumbnail>http://localhost/dhl/country/en-global/business/productivity/the-future-of-cyber-sales.thumb.319.319.png</thumbnail>\n" +
                "</item>\n" +
                "</channel>\n" +
                "</rss>\n";

        assertXmlEquals(expected, responseBody);
    }
}