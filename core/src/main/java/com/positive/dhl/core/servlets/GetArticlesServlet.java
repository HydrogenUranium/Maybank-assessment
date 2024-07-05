package com.positive.dhl.core.servlets;

import com.google.gson.GsonBuilder;
import com.positive.dhl.core.models.Article;
import com.positive.dhl.core.services.ArticleService;
import com.positive.dhl.core.services.ResourceResolverHelper;
import com.positive.dhl.core.utils.IndexUtils;
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
import java.util.Collections;
import java.util.List;

import static com.adobe.cq.dam.cfm.SemanticDataType.JSON;
import static org.apache.commons.codec.CharEncoding.UTF_8;

@Component(service = { Servlet.class })
@SlingServletResourceTypes(
        resourceTypes = "wcm/foundation/components/responsivegrid",
        methods = HttpConstants.METHOD_GET,
        extensions = JSON,
        selectors = "searcharticlesuggest")
public class GetArticlesServlet extends SlingSafeMethodsServlet {
    private static final long serialVersionUID = 5380383600055940736L;

    @Reference
    protected transient ArticleService articleService;

    @Reference
    private ResourceResolverHelper resolverHelper;

    @Override
    public void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setCharacterEncoding(UTF_8);
        response.setContentType(ContentType.APPLICATION_JSON.getMimeType());

        var resolver = request.getResourceResolver();
        var searchTerm = request.getParameter("s");
        var searchScope = request.getParameter("homepagepath");
        var useWebOptimized = Boolean.parseBoolean(request.getParameter("optimized"));
        var imgQuality = request.getParameter("imgquality");
        var fullTextSearch = hasFullTextIndex(searchScope);

        List<Article> articles = StringUtils.isAnyBlank(searchTerm, searchScope)
                ? Collections.emptyList()
                : articleService.findArticles(searchTerm, searchScope,  resolver, fullTextSearch);

        articles.forEach(article -> article.initAssetDeliveryProperties(useWebOptimized, imgQuality));

        var gson = new GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .create();
        response.getWriter().write(gson.toJson(articles));
    }

    private boolean hasFullTextIndex(String searchScope) {
        try(var resolver = resolverHelper.getReadResourceResolver()) {
            return IndexUtils.hasFullTextIndex(searchScope, resolver);
        }
    }
}
