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
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import javax.jcr.LoginException;
import javax.jcr.RepositoryException;
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
                "sling.servlet.resourceTypes=cq/Page",
                "sling.servlet.selectors=child-pages",
                "sling.servlet.extensions=json"
        }
)
@Slf4j
@Designate(ocd = PageListServlet.Configuration.class)
public class PageListServlet extends SlingAllMethodsServlet {
    private static final long serialVersionUID = 1L;

    @Reference
    private transient ResourceResolverFactory resolverFactory;

    private boolean pageListServletEnabled;

    @Activate
    @Modified
    public void init(PageListServlet.Configuration config) {
        this.pageListServletEnabled =  config.pageListServletEnabled();
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {
        Map<String, Object> params = new HashMap<>();
        params.put(ResourceResolverFactory.SUBSERVICE, DiscoverConstants.DISCOVER_READ_SERVICE);

        String searchScope = request.getRequestPathInfo().getResourcePath();

        if (!pageListServletEnabled) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("PageListServlet is disabled.");
                return;
        }

        try (ResourceResolver resolver = resolverFactory.getServiceResourceResolver(params)) {
            log.info("Executing query for path: {}", searchScope);
            QueryBuilder queryBuilder = resolver.adaptTo(QueryBuilder.class);
            Map<String, String> queryMap = new HashMap<>();
            queryMap.put("path", searchScope);
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

    @ObjectClassDefinition
    @interface Configuration {

        @AttributeDefinition(
                name = "PAGE_LIST_SERVLET_ENABLED",
                description = "On / Off switch that either sets the configuration enabled or disabled. " +
                        "If disabled, replication events would still be listened to, but not acted on.",
                type = AttributeType.BOOLEAN
        )
        boolean pageListServletEnabled() default false;
    }

}
