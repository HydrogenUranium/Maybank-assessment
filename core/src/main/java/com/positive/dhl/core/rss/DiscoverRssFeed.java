package com.positive.dhl.core.rss;

import com.day.cq.commons.SimpleXml;
import com.day.cq.commons.feed.StringResponseWrapper;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.models.Article;
import com.positive.dhl.core.services.PageContentExtractorService;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.utils.RequestUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceNotFoundException;
import org.apache.sling.api.resource.ResourceUtil;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.apache.sling.jcr.resource.api.JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY;

@Slf4j
public class DiscoverRssFeed {
    public static final int SUB_REQUEST_LIMITATION = 1450;

    private final SlingHttpServletRequest request;
    private final SlingHttpServletResponse response;
    private final SimpleXml xml;
    private final PageUtilService pageUtilService;
    private final PageContentExtractorService pageExtractor;
    private final Resource resource;

    private final String title;
    private final String description;
    private final String tags;
    private final String language;
    private final String region;
    private final String publishedDate;
    private final String resourcePath;
    private final String thumbnailImageUrl;
    private final String link;

    public DiscoverRssFeed(SlingHttpServletRequest req, SlingHttpServletResponse resp, PageContentExtractorService pageExtractor, PageUtilService pageUtilService) throws IOException {
        request = req;
        response = resp;
        this.pageUtilService = pageUtilService;
        this.pageExtractor = pageExtractor;
        this.resource = request.getResource();

        if (ResourceUtil.isNonExistingResource(resource)) {
            throw new ResourceNotFoundException("No data to render.");
        }

        Article article = resource.adaptTo(Article.class);
        if (article == null) {
            throw new ResourceNotFoundException("Failed to adapt resource to article");
        }

        resourcePath = article.getJcrPath();

        title = article.getNavTitle();
        description = article.getDescription();
        publishedDate = article.getCreated();
        var urlPrefix = RequestUtils.getUrlPrefix(request);
        thumbnailImageUrl = urlPrefix.concat(request.getResourceResolver().map(article.getListimage()));
        link = article.getPath();
        region = Optional.ofNullable(getLanguageRoot(resource))
                .map(Page::getProperties)
                .map(valueMap -> valueMap.get("siteregion", "")).orElse("");
        var locale = article.getLocale();
        language = locale.toLanguageTag();

        tags = getTagNames(article.getValueMap().get("jcr:content/cq:tags", new String[0]), locale);
        xml = new SimpleXml(response.getWriter());
    }

    private Page getLanguageRoot(Resource resource) {
        Page page = resource.adaptTo(Page.class);
        return page == null ? null : pageUtilService.getHomePage(page);
    }

    private Resource getChildResource(String relativePath) {
        return request.getResourceResolver().getResource(resourcePath + relativePath);
    }

    private String getArticleIntroduction() {
        var par = getChildResource("/jcr:content/root/article_container/body/responsivegrid");
        if (par == null) {
            return "";
        }

        return StreamSupport.stream(par.getChildren().spliterator(), false)
                .map(Resource::getValueMap)
                .filter(props -> props.get(SLING_RESOURCE_TYPE_PROPERTY, "").equals("dhl/components/content/text"))
                .findFirst().map(props -> props.get("text", "")).orElse("");
    }

    private String getTagNames(String[] tags, Locale locale) {
        TagManager tagManager = request.getResourceResolver().adaptTo(TagManager.class);
        if (tagManager == null) {
            log.error("Tag Manager is null");
            return "";
        }
        return Arrays.stream(tags)
                .map(tagManager::resolve)
                .filter(Objects::nonNull)
                .map(tag -> tag.getTitle(locale))
                .collect(Collectors.joining(","));
    }

    public void printEntry(String path, boolean isFullBody) throws IOException {
        try {
            request.setAttribute("com.day.cq.wcm.api.components.ComponentContext/bypass", "true");
            var wrapper = new StringResponseWrapper(response);
            request.getRequestDispatcher(getFeedEntryPath(path, isFullBody)).include(request, wrapper);
            xml.getWriter().print(wrapper.getString());
        } catch (ServletException exception) {
            throw new IOException(exception.getMessage(), exception);
        }
    }

    public void printEntries(List<String> paths, boolean isWithBody) throws IOException {
        if (paths.size() > SUB_REQUEST_LIMITATION) {
            paths = paths.subList(0, SUB_REQUEST_LIMITATION);
        }

        for(String path : paths) {
            printEntry(path, isWithBody);
        }
    }

    public void printFooter() throws IOException {
        xml.closeDocument();
    }

    public void printHeader() throws IOException {
        xml.openDocument();
        xml.open("rss").attr("version", "2.0").attr("xmlns:atom", "http://www.w3.org/2005/Atom")
                .open("channel")
                .open("link", link, false).close()
                .open("title", title, false).close()
                .open("description", description, false).close()
                .open("language", language, false).close()
                .open("region", region, false).close()
                .open("pubDate", publishedDate, false).close();
    }

    public void printEntry() throws IOException {
        printEntry(false);
    }

    public void printEntry(boolean isFullBody) throws IOException {
        String articleBody = isFullBody
                ? pageExtractor.extract(resource)
                : getArticleIntroduction();
        xml.omitXmlDeclaration(true);
        xml.open("item")
                .open("link", link, false).close()
                .open("title", title, false).close()
                .open("description", description, false).close()
                .open("articleBody", articleBody, true).close()
                .open("region", region, false).close()
                .open("language", language, false).close()
                .open("pubDate", publishedDate, false).close()
                .open("tags", tags, false).close()
                .open("thumbnail",thumbnailImageUrl, false).close();
        xml.tidyUp();
    }


    private String getFeedEntryPath(String path, boolean isFullBody) {
        if(isFullBody) {
            return path + ".rss.entry.fullbody.xml";
        }
        return path + ".rss.entry.xml";
    }
}
