package com.dhl.discover.core.services.schema.impl;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.models.Article;
import com.google.gson.JsonObject;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
import com.dhl.discover.core.services.schema.AbstractSchemaAdapter;
import com.dhl.discover.core.services.schema.SchemaAdapter;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.Optional;

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

    @Override
    public boolean canHandle(Resource resource) {
        var valueMap = resource.getValueMap();
        return valueMap.get("mediatype", "").equals("blogPost")
                && valueMap.get(JCR_PRIMARYTYPE, "").equals("cq:PageContent");
    }

    @Override
    public JsonObject toJson(Resource resource, SlingHttpServletRequest request) {
        var article = Optional.ofNullable(pageUtilService.getPage(resource))
                .map(Page::getContentResource)
                .map(Resource::getParent)
                .map(page -> page.adaptTo(Article.class)).orElse(null);
        var homePage = pageUtilService.getHomePage(resource);

        if(article == null || homePage == null) {
            return null;
        }

        var valueMap = homePage.getProperties();

        JsonObject blogPosting = createSchema(BLOG_POSTING);

        JsonObject webPage = createType(WEB_PAGE);
        webPage.addProperty("@id", pathUtilService.getFullMappedPath(article.getPath(), request));
        blogPosting.add("mainEntityOfPage", webPage);

        blogPosting.addProperty("headline", StringEscapeUtils.escapeHtml4(article.getTitle()));
        blogPosting.addProperty("description", StringEscapeUtils.escapeHtml4(article.getDescription()));
        blogPosting.addProperty("image", pathUtilService.getFullMappedPath(article.getHeroimagemob(), request));

        JsonObject author = createType(ORGANIZATION);
        author.addProperty("name", "DHL " + valueMap.get(COUNTRY_FIELD, ""));
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
