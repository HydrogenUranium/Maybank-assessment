package com.positive.dhl.core.rss;

import com.day.cq.commons.SimpleXml;
import com.day.cq.commons.feed.StringResponseWrapper;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.*;

import javax.servlet.ServletException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Iterator;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.day.cq.commons.jcr.JcrConstants.*;
import static com.day.cq.wcm.api.constants.NameConstants.PN_TAGS;
import static org.apache.sling.jcr.resource.api.JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY;

public class DiscoverRssFeed {
    private final SlingHttpServletRequest request;
    private final SlingHttpServletResponse response;
    private final SimpleXml xml;
    private PageUtilService pageUtilService;

    private final String title;
    private final String description;
    private final String tags;
    private final String language;
    private final String region;
    private final String publishedDate;
    private final String resourcePath;
    private final String mappedResourcePath;
    private final String urlPrefix;
    private final String thumbnailImageUrl;
    private final String link;
    private final String articleBody;

    public DiscoverRssFeed(SlingHttpServletRequest req, SlingHttpServletResponse resp) throws IOException {
        request = req;
        response = resp;

        var resource = request.getResource();
        if (ResourceUtil.isNonExistingResource(resource)) {
            throw new ResourceNotFoundException("No data to render.");
        }

        var jcrContent = resource.getChild(JCR_CONTENT);

        if (jcrContent == null) {
            throw new ResourceNotFoundException("No jcr:content.");
        }

        var props = jcrContent.getValueMap();

        var resourceResolver = request.getResourceResolver();
        resourcePath = resource.getPath();
        mappedResourcePath =  resourceResolver.map(resource.getPath());
        title = props.get(JCR_TITLE, resource.getName());
        description = props.get(JCR_DESCRIPTION, "");
        publishedDate = formatDate(props.get(JCR_CREATED, Calendar.getInstance()));
        tags = getTagNames(props.get(PN_TAGS, new String[0]));
        urlPrefix = getUrlPrefix();
        thumbnailImageUrl = getThumbnailImageUrl();
        link = getHtmlLink();
        articleBody = getArticleIntroduction();
        pageUtilService = new PageUtilService();

        Page languageCopyRoot = getLanguageRoot(resource);
        if (languageCopyRoot == null) {
            language = "";
            region = "";
        } else {
            ValueMap properties = languageCopyRoot.getProperties();
            language = properties.get("sitelanguage", "");
            region = properties.get("siteregion", "");
        }

        xml = new SimpleXml(response.getWriter());
    }

    private Page getLanguageRoot(Resource resource) {
        Page page = resource.adaptTo(Page.class);
        return page == null ? null : pageUtilService.getHomePage(page);
    }

    private Resource getChildResource(String relativePath) {
        return request.getResourceResolver().getResource(resourcePath + relativePath);
    }

    private String getThumbnailImageUrl() {
        var image = getChildResource("/jcr:content/image");
        if (image == null) {
            return "";
        }
        return urlPrefix + mappedResourcePath + ".thumb.319.319.png";
    }

    private String getHtmlLink() {
        return urlPrefix + mappedResourcePath + ".html";
    }

    private String getUrlPrefix() {
        var url = new StringBuilder(request.getScheme());
        url.append("://");
        url.append(request.getServerName());

        int port = request.getServerPort();
        if (!(port == 80 || port == 443)) {
            url.append(":");
            url.append(port);
        }
        url.append(request.getContextPath());
        return url.toString();
    }

    private String getArticleIntroduction() {
        var par = getChildResource("/jcr:content/par");
        if (par == null) {
            return "";
        }

        return StreamSupport.stream(par.getChildren().spliterator(), false)
                .map(Resource::getValueMap)
                .filter(props -> props.get(SLING_RESOURCE_TYPE_PROPERTY, "").equals("dhl/components/content/text"))
                .findFirst().map(props -> props.get("text", "")).orElse("");
    }

    private String getTagNames(String[] tags) {
        return Arrays.stream(tags)
                .map(fullName -> fullName.replace(":", "/").split("/"))
                .map(parts -> parts[parts.length - 1])
                .collect(Collectors.joining(","));
    }

    public void printEntry(Resource resource) throws IOException {
        try {
            request.setAttribute("com.day.cq.wcm.api.components.ComponentContext/bypass", "true");
            var wrapper = new StringResponseWrapper(response);
            request.getRequestDispatcher(getFeedEntryPath(resource)).include(request, wrapper);
            xml.getWriter().print(wrapper.getString());
        } catch (ServletException exception) {
            throw new IOException(exception.getMessage(), exception);
        }
    }

    public void printEntries(Iterator<Resource> resources) throws IOException {
        printEntries(resources, 1450);
    }

    public void printEntries(Iterator<Resource> resources, int max) throws IOException {
        var i = 0;
        while (resources.hasNext() && (max == 0 || i++ < max)) {
            printEntry(resources.next());
        }
    }

    public void printFooter() throws IOException {
        xml.closeDocument();
    }

    public void printHeader() throws IOException {
        xml.openDocument();
        xml.open("rss").attr("version", "2.0").attr("xmlns:atom", "http://www.w3.org/2005/Atom")
                .open("channel")
                .open("link", getHtmlLink(), false).close()
                .open("title", title, false).close()
                .open("description", description, false).close()
                .open("language", language, false).close()
                .open("region", region, false).close()
                .open("pubDate", publishedDate, false).close();
    }

    public void printEntry() throws IOException {
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

    private String getFeedEntryPath(Resource resource) {
        return resource.getPath() + ".rss.entry.xml";
    }

    private String formatDate(Calendar calendar) {
        try {
            return (new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss")).format(calendar.getTime());
        } catch (Exception exception) {
            return "";
        }
    }
}
