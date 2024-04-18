package com.positive.dhl.core.servlets;

import com.drew.lang.annotations.NotNull;
import com.positive.dhl.core.rss.DiscoverRssFeed;
import com.positive.dhl.core.services.PageContentExtractorService;
import com.positive.dhl.core.services.PageUtilService;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import javax.jcr.query.Query;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component(service = {Servlet.class}, immediate = true)
@SlingServletResourceTypes(
        resourceTypes = "cq/Page",
        methods = HttpConstants.METHOD_GET,
        extensions = "xml",
        selectors = "rss"
)
@Designate(ocd = RssFeedRenderServlet.Configuration.class)
public class RssFeedRenderServlet extends SlingSafeMethodsServlet {
    private int maxPages;
    private String queryFormat;

    @Reference
    private PageContentExtractorService pageExtractor;

    @Reference
    private PageUtilService pageUtilService;

    @Activate
    @Modified
    public void activate(RssFeedRenderServlet.Configuration config) {
        List<String> resourceTypes = Arrays.asList(config.resourceTypes());
        maxPages = config.maxPages();
        queryFormat = buildQueryFormat(resourceTypes);

        log.info("Initialized service with query: {}", queryFormat);
    }

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

            String query = getQuery(req.getResource().getPath());
            Iterator<Resource> pages = req.getResourceResolver().findResources(query, Query.JCR_SQL2);

            feed.printHeader();
            if (isAll) {
                feed.printEntries(pages, isFullBody);
            } else {
                feed.printEntries(pages, maxPages, isFullBody);
            }
            feed.printFooter();

        } catch (Exception exception) {
            throw new ServletException("Error while rendering resource as rss feed: " + exception.getMessage(), exception);
        }
    }

    private String buildQueryFormat(List<String> resourceTypes) {
        var stringBuilder = new StringBuilder()
                .append("SELECT page.* FROM [cq:Page] AS page ")
                .append("INNER JOIN [cq:PageContent] AS jcrcontent ON ISCHILDNODE(jcrcontent, page) ")
                .append("WHERE ISDESCENDANTNODE(page, '%s') ");
        if(!resourceTypes.isEmpty()) {
            String resourceTypeFilter = resourceTypes.stream()
                    .map(resourceType -> "jcrcontent.[sling:resourceType] = '" + resourceType + "' ")
                    .collect(Collectors.joining("OR "));
            stringBuilder.append("AND (").append(resourceTypeFilter).append(")");
        }
        stringBuilder.append("ORDER BY jcrcontent.[jcr:created] DESC");

        return stringBuilder.toString();
    }

    private String getQuery(String pagePath) {
        return String.format(queryFormat, pagePath);
    }

    @ObjectClassDefinition
    @interface Configuration {

        @AttributeDefinition(
                name = "Max pages",
                description = "Max pages in RSS response",
                type = AttributeType.INTEGER
        )
        int maxPages() default 50;

        @AttributeDefinition(
                name = "Resource Types",
                description = "Provides resource types to be added to the RSS response"
        )
        String[] resourceTypes() default {};
    }
}
