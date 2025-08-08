package com.dhl.discover.core.services.schema.impl;

import com.dhl.discover.core.models.Article;
import com.dhl.discover.core.services.ArticleUtilService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
import com.dhl.discover.core.services.schema.AbstractSchemaAdapter;
import com.dhl.discover.core.services.schema.SchemaAdapter;
import com.google.gson.JsonObject;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import static com.day.cq.commons.jcr.JcrConstants.JCR_PRIMARYTYPE;
import static com.dhl.discover.core.constants.SchemaMarkupType.*;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.createSchema;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.createType;

@Component(service = SchemaAdapter.class)
public class BlogPostingSchemaAdapter extends AbstractSchemaAdapter {
    public static final String COUNTRY_FIELD = "siteregion";

    @Reference
    private PathUtilService pathUtilService;

    @Reference
    private PageUtilService pageUtilService;

    @Reference
    private ArticleUtilService articleUtilService;

    @Override
    public boolean canHandle(Resource resource) {
        var valueMap = resource.getValueMap();
        return valueMap.get("mediatype", "").equals("blogPost")
                && valueMap.get(JCR_PRIMARYTYPE, "").equals("cq:PageContent");
    }

    private Article getArticle(SlingHttpServletRequest request) {
        String requestedPath = request.getResource().getPath();
        String pagePath = requestedPath.replaceAll("/jcr:content.*", "");
        return articleUtilService.getArticle(pagePath, request);
    }

    @Override
    public JsonObject toJson(Resource resource, SlingHttpServletRequest request) {
        var article = getArticle(request);
        var homePage = pageUtilService.getHomePage(resource);

        if(article == null || homePage == null) {
            return null;
        }

        var homePageProperties = homePage.getProperties();
        var featuredImage = article.getFeaturedImageModel();

        JsonObject blogPosting = createSchema(BLOG_POSTING);

        JsonObject webPage = createType(WEB_PAGE);
        webPage.addProperty("@id", pathUtilService.getFullMappedPath(article.getPath(), request));
        blogPosting.add("mainEntityOfPage", webPage);

        blogPosting.addProperty("headline", StringEscapeUtils.escapeHtml4(article.getTitle()));
        blogPosting.addProperty("description", StringEscapeUtils.escapeHtml4(article.getDescription()));
        if(featuredImage != null) {
            blogPosting.addProperty("image", pathUtilService.getFullMappedPath(featuredImage.getSrc(), request));
        }

        JsonObject author = createType(ORGANIZATION);
        author.addProperty("name", "DHL " + homePageProperties.get(COUNTRY_FIELD, ""));
        author.addProperty("url", pathUtilService.getFullMappedPath(homePage.getPath(), request));
        blogPosting.add("author", author);

        JsonObject publisher = createType(ORGANIZATION);
        publisher.addProperty("name", "DHL");

        JsonObject logo = createType(IMAGE_OBJECT);
        logo.addProperty("url", "https://www.dhl.com/etc.clientlibs/dhl/clientlibs/discover/resources/img/new-logo.svg");
        publisher.add("logo", logo);

        blogPosting.add("publisher", publisher);
        blogPosting.addProperty("datePublished", article.getCreated("yyyy-MM-dd'T'HH:mm:ss'Z'"));

        return blogPosting;
    }
}
