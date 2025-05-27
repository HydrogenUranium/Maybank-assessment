package com.dhl.discover.core.servlets;

import com.dhl.discover.core.models.Article;
import com.dhl.discover.core.services.ArticleService;
import com.dhl.discover.core.services.PageContentExtractorService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.rss.DiscoverRssFeed;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.jetbrains.annotations.NotNull;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static com.dhl.discover.core.rss.DiscoverRssFeed.SUB_REQUEST_LIMITATION;

@Slf4j
@Component(service = {Servlet.class}, immediate = true)
@SlingServletResourceTypes(
        resourceTypes = "cq/Page",
        methods = HttpConstants.METHOD_GET,
        extensions = "xml",
        selectors = "rss"
)
public class RssFeedRenderServlet extends SlingSafeMethodsServlet {
    private static final int MAX_PAGES = 50;

    @Reference
    private transient PageContentExtractorService pageExtractor;

    @Reference
    private PageUtilService pageUtilService;

    @Reference
    protected transient ArticleService articleService;

    @Override
    protected void doGet(@NotNull SlingHttpServletRequest req, @NotNull SlingHttpServletResponse resp) throws ServletException {
        var selectors = List.of(req.getRequestPathInfo().getSelectors());
        boolean isEntry = selectors.contains("entry");
        boolean isAll = selectors.contains("all");
        boolean isFullBody = selectors.contains("fullbody");
        try {
            resp.setContentType("application/rss+xml");
            resp.setCharacterEncoding("utf-8");
            var feed = new DiscoverRssFeed(req, resp, pageExtractor, pageUtilService);

            if(isEntry) {
                feed.printEntry(isFullBody);
                return;
            }

            feed.printHeader();

            String rootPath = req.getResource().getPath();
            List<String> paths = articleService.getLatestArticles(rootPath, isAll ? SUB_REQUEST_LIMITATION : MAX_PAGES)
                    .stream().map(Article::getJcrPath).toList();
            feed.printEntries(paths, isFullBody);

            feed.printFooter();

        } catch (IOException exception) {
            throw new ServletException("Error while rendering resource as rss feed: " + exception.getMessage(), exception);
        }
    }
}
