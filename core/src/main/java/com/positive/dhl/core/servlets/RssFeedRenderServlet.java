package com.positive.dhl.core.servlets;

import com.drew.lang.annotations.NotNull;
import com.positive.dhl.core.rss.DiscoverRssFeed;
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
        String[] selectors = req.getRequestPathInfo().getSelectors();
        boolean isEntry = selectors.length > 1 && "entry".equals(selectors[1]);
        boolean isAll = selectors.length > 1 && "all".equals(selectors[1]);
        try {
            resp.setContentType("application/rss+xml");
            resp.setCharacterEncoding("utf-8");
            DiscoverRssFeed feed = new DiscoverRssFeed(req, resp);

            if(isEntry) {
                feed.printEntry();
                return;
            }

            String query = getQuery(req.getResource().getPath());
            Iterator<Resource> pages = req.getResourceResolver().findResources(query, Query.JCR_SQL2);

            feed.printHeader();
            if (isAll) {
                feed.printEntries(pages);
            } else {
                feed.printEntries(pages, maxPages);
            }
            feed.printFooter();

        } catch (Exception exception) {
            throw new ServletException("Error while rendering resource as rss feed: " + exception.getMessage(), exception);
        }
    }

    private String buildQueryFormat(List<String> resourceTypes) {
        StringBuilder stringBuilder = new StringBuilder()
                .append("SELECT page.* FROM [cq:Page] AS page ")
                .append("INNER JOIN [cq:PageContent] AS jcrcontent ON ISCHILDNODE(jcrcontent, page) ")
                .append("WHERE ISDESCENDANTNODE(page, '%s') ");
        if(!resourceTypes.isEmpty()) {
            String resourceTypeFilter = resourceTypes.stream()
                    .map(resourceType -> "jcrcontent.[sling:resourceType] = '" + resourceType + "' ")
                    .collect(Collectors.joining("OR "));
            stringBuilder.append("AND ").append(resourceTypeFilter);
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
