package com.positive.dhl.core.servlets;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.positive.dhl.core.constants.DiscoverConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.LoginException;
import javax.jcr.Session;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component(
        service = { Servlet.class },
        property = {
                "sling.servlet.methods=GET",
                "sling.servlet.paths=/bin/get-all-pages"
        }
)
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
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), resolver.adaptTo(Session.class));
            SearchResult result = query.getResult();

            JsonArray pagesArray = new JsonArray();
            for (Hit hit : result.getHits()) {
                JsonObject pageObject = new JsonObject();
                pageObject.addProperty("path", hit.getPath());
                pagesArray.add(pageObject);
            }

            response.setContentType("application/json");
            response.getWriter().write(pagesArray.toString());
        } catch (LoginException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Failed to get resource resolver: " + e.getMessage());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error: " + e.getMessage());
        }
    }
}
