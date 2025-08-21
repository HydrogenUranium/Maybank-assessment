package com.dhl.discover.core.servlets;

import com.adobe.cq.wcm.core.components.models.Image;
import com.dhl.discover.core.models.search.SearchResultEntry;
import com.dhl.discover.core.services.ArticleSearchService;
import com.google.gson.*;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.core.utils.IndexUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.entity.ContentType;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import static com.adobe.cq.dam.cfm.SemanticDataType.JSON;
import static org.apache.commons.codec.CharEncoding.UTF_8;

@Component(service = {Servlet.class})
@SlingServletResourceTypes(
        resourceTypes = "cq/Page",
        methods = HttpConstants.METHOD_GET,
        extensions = JSON,
        selectors = "search")
public class GetArticlesServlet extends SlingSafeMethodsServlet {
    private static final long serialVersionUID = 5380383600055940736L;

    @Reference
    protected transient ArticleSearchService articleSearchService;

    @Reference
    private ResourceResolverHelper resolverHelper;

    @Override
    public void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setCharacterEncoding(UTF_8);
        response.setContentType(ContentType.APPLICATION_JSON.getMimeType());

        var searchTerm = request.getParameter("s");
        var searchScope = request.getRequestPathInfo().getResourcePath();
        var fullTextSearch = hasFullTextIndex(searchScope);

        List<SearchResultEntry> searchResultEntries = StringUtils.isAnyBlank(searchTerm, searchScope)
                ? new ArrayList<>()
                : articleSearchService.findArticles(searchTerm, searchScope, request, fullTextSearch);

        var gson = new GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(Image.class, (JsonSerializer<Image>) (image, type, context) -> {
                    JsonObject obj = new JsonObject();
                    obj.addProperty("src", image.getSrc());
                    obj.addProperty("srcset", image.getSrcset());
                    obj.addProperty("alt", image.getAlt());
                    obj.addProperty("title", image.getTitle());
                    return obj;
                })
                .create();
        response.getWriter().write(gson.toJson(searchResultEntries));
    }

    private boolean hasFullTextIndex(String searchScope) {
        try (var resolver = resolverHelper.getReadResourceResolver()) {
            return IndexUtils.hasFullTextIndex(searchScope, resolver);
        }
    }
}
