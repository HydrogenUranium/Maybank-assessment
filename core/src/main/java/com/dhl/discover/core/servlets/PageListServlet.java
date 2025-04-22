package com.dhl.discover.core.servlets;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.dhl.discover.core.constants.DiscoverConstants;
import com.google.gson.JsonArray;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.LoginException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
/*
@Component(
        service = { Servlet.class },
        property = {
                "sling.servlet.methods=GET",
                "sling.servlet.paths=/bin/get-all-pages"
        }
)

 */
@Component(
        service = { Servlet.class },
        property = {
                "sling.servlet.methods=GET",
                "sling.servlet.resourceTypes=/apps/dhl/components/pages",
                "sling.servlet.selectors=published",
                "sling.servlet.extensions=json"
        }
)

@Slf4j
public class PageListServlet extends SlingAllMethodsServlet {
    private static final long serialVersionUID = 1L;

    @Reference
    private transient ResourceResolverFactory resolverFactory;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {
        Map<String, Object> params = new HashMap<>();
        params.put(ResourceResolverFactory.SUBSERVICE, DiscoverConstants.DISCOVER_READ_SERVICE);

        try (ResourceResolver resolver = resolverFactory.getServiceResourceResolver(params)) {
            QueryBuilder queryBuilder = resolver.adaptTo(QueryBuilder.class);
            Map<String, String> queryMap = new HashMap<>();
            queryMap.put("path", "/content/dhl");
            queryMap.put("type", "cq:Page");
            queryMap.put("p.limit", "-1");
            queryMap.put("orderby", "@jcr:path");
            queryMap.put("orderby.sort", "asc");
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), resolver.adaptTo(Session.class));
            SearchResult result = query.getResult();

            JsonArray pagesArray = new JsonArray();
            for (Hit hit : result.getHits()) {
                pagesArray.add(hit.getPath());
            }

            response.setContentType("application/json");
            response.getWriter().write(pagesArray.toString());
        } catch (LoginException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Failed to get resource resolver: " + e.getMessage());
        } catch (RepositoryException | org.apache.sling.api.resource.LoginException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("An unexpected error occurred. Please try again later.");
        }
    }
}
