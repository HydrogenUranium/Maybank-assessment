package com.dhl.discover.core.servlets;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import javax.servlet.Servlet;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.charset.StandardCharsets;


@Component(service = Servlet.class, property = {
        Constants.SERVICE_DESCRIPTION + "=YouTube Schema Markup",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET,
        "sling.servlet.resourceTypes=" + "discoverdhlapi/youtube",
        "sling.servlet.selectors=" + "index",
        "sling.servlet.extensions=" + "json"}
)
@Designate(ocd = FetchYouTubeDataServlet.Configuration.class)
@Slf4j
public class FetchYouTubeDataServlet extends SlingAllMethodsServlet {

    private String apiKey;

    private static final String SNIPPET = "snippet";

    private static final String PAGEINFO = "pageInfo";

    @Activate
    @Modified
    public void init(FetchYouTubeDataServlet.Configuration config) {
        apiKey = config.apiKey();
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String videoId = request.getParameter("videoId");

        if (apiKey == null || videoId == null || !videoId.matches("^[a-zA-Z0-9_-]{11}$")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing API key or invalid videoId parameter");
            return;
        }

        String apiUrl = String.format("https://www.googleapis.com/youtube/v3/videos?id=%s&part=snippet,contentDetails,statistics&key=%s", videoId, apiKey);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            var httpGet = new HttpGet(apiUrl);
            try (CloseableHttpResponse httpResponse = httpClient.execute(httpGet)) {
                String contentType = httpResponse.getEntity().getContentType().getValue();
                if (!contentType.startsWith("application/json")) {
                    response.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, "Unexpected content type");
                    return;
                }

                String responseBody = new String(httpResponse.getEntity().getContent().readAllBytes(), StandardCharsets.UTF_8);
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(responseBody);

                ObjectNode resultNode = mapper.createObjectNode();
                resultNode.put("kind", root.path("kind").asText(""));
                resultNode.put("etag", root.path("etag").asText(""));

                ArrayNode itemsArray = mapper.createArrayNode();
                JsonNode itemsNode = root.path("items");

                if (itemsNode.isArray()) {
                    for (JsonNode item : itemsNode) {
                        ObjectNode filteredItem = mapper.createObjectNode();

                        filteredItem.put("kind", item.path("kind").asText(""));
                        filteredItem.put("etag", item.path("etag").asText(""));
                        filteredItem.put("id", item.path("id").asText(""));

                        ObjectNode snippet = mapper.createObjectNode();
                        snippet.put("title", item.path(SNIPPET).path("title").asText(""));
                        snippet.put("description", item.path(SNIPPET).path("description").asText(""));
                        snippet.put("publishedAt", item.path(SNIPPET).path("publishedAt").asText(""));

                        ObjectNode thumbnails = mapper.createObjectNode();
                        ObjectNode highThumbnail = mapper.createObjectNode();
                        highThumbnail.put("url", item.path(SNIPPET).path("thumbnails").path("high").path("url").asText(""));
                        thumbnails.set("high", highThumbnail);
                        snippet.set("thumbnails", thumbnails);

                        filteredItem.set(SNIPPET, snippet);

                        ObjectNode contentDetails = mapper.createObjectNode();
                        contentDetails.put("duration", item.path("contentDetails").path("duration").asText(""));
                        filteredItem.set("contentDetails", contentDetails);

                        ObjectNode statistics = mapper.createObjectNode();
                        statistics.put("viewCount", item.path("statistics").path("viewCount").asText(""));
                        filteredItem.set("statistics", statistics);

                        itemsArray.add(filteredItem);
                    }
                }

                resultNode.set("items", itemsArray);

                ObjectNode pageInfo = mapper.createObjectNode();
                pageInfo.put("totalResults", root.path(PAGEINFO).path("totalResults").asInt(0));
                pageInfo.put("resultsPerPage", root.path(PAGEINFO).path("resultsPerPage").asInt(0));
                resultNode.set(PAGEINFO, pageInfo);

                response.setContentType("application/json");
                response.setHeader("Content-Security-Policy", "default-src 'self'");
                response.setHeader("X-Content-Type-Options", "nosniff");
                response.setHeader("X-XSS-Protection", "1; mode=block");
                response.setHeader("X-Frame-Options", "DENY");

                response.getWriter().write(resultNode.toString());
            }
        }
    }

    @ObjectClassDefinition
    @interface Configuration {

        @AttributeDefinition(
                name = "YouTube API Key",
                type = AttributeType.STRING
        )
        String apiKey();
    }
}
