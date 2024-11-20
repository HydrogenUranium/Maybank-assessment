package com.dhl.discover.core.servlets;

import org.apache.http.Header;
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
import java.io.InputStream;
import java.io.OutputStream;

@Component(service = Servlet.class, property = {
        Constants.SERVICE_DESCRIPTION + "=YouTube Schema Markup",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET,
        "sling.servlet.paths=" + "/apps/dhl/discoverdhlapi/youtube/index.json"}
)
@Designate(ocd = FetchYouTubeDataServlet.Configuration.class)
public class FetchYouTubeDataServlet extends SlingAllMethodsServlet {

    private String apiKey;

    @Activate
    @Modified
    public void init(FetchYouTubeDataServlet.Configuration config) {
        apiKey = config.apiKey();
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String videoId = request.getParameter("videoId");

        if (apiKey == null || videoId == null || !videoId.matches("^[a-zA-Z0-9_-]{11}$")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing API key or videoId parameter");
            return;
        }

        var apiUrl = String.format("https://www.googleapis.com/youtube/v3/videos?id=%s&part=snippet,contentDetails,statistics&key=%s", videoId, apiKey);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            var httpGet = new HttpGet(apiUrl);
            try (CloseableHttpResponse httpResponse = httpClient.execute(httpGet)) {
                int statusCode = httpResponse.getStatusLine().getStatusCode();
                response.setStatus(statusCode);

                for (Header header : httpResponse.getAllHeaders()) {
                    response.setHeader(header.getName(), header.getValue());
                }

                try (InputStream content = httpResponse.getEntity().getContent(); OutputStream out = response.getOutputStream()) {
                    var buffer = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = content.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                    }
                }
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
