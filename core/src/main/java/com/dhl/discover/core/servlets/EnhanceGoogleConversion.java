package com.dhl.discover.core.servlets;

import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import javax.servlet.Servlet;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.NoSuchAlgorithmException;

import static com.dhl.discover.core.helpers.GoogleApiHelper.requestAccessToken;
import static com.dhl.discover.core.helpers.GoogleApiHelper.uploadEnhancedConversion;

@Slf4j
@Component(
        service = {Servlet.class})
@SlingServletResourceTypes(
        resourceTypes = {"cq/Page"},
        methods = HttpConstants.METHOD_POST,
        extensions = "html",
        selectors = "enhanced-google-conversion"
)
@Designate(ocd = EnhanceGoogleConversion.Configuration.class)
public class EnhanceGoogleConversion extends SlingAllMethodsServlet {
    private String customerId;
    private String developerToken;
    private String clientId;
    private String clientSecret;
    private String refreshToken;

    private String accessToken;
    private long accessTokenExpiryTime;

    @Activate
    @Modified
    public void init(EnhanceGoogleConversion.Configuration config) {
        this.customerId = config.customerId();
        this.developerToken = config.developerToken();
        this.clientId = config.clientId();
        this.clientSecret = config.clientSecret();
        this.refreshToken = config.refreshToken();
    }

    private String getAccessToken() throws IOException {
        if (accessToken == null || System.currentTimeMillis() > accessTokenExpiryTime - 60_000) {
            var tokenResponse = requestAccessToken(clientId, clientSecret, refreshToken);
            accessToken = tokenResponse.get("access_token").getAsString();
            var expiresIn = tokenResponse.get("expires_in").getAsInt();
            accessTokenExpiryTime = System.currentTimeMillis() + (expiresIn * 1000L);
        }
        return accessToken;
    }

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        try {
            String token = getAccessToken();
            JsonObject responseObject = processEnhancementRequest(request, token);
            writeResponse(response, responseObject);
        } catch (Exception e) {
            log.error("Error processing enhancement request", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Error");
        }
    }

    private JsonObject processEnhancementRequest(SlingHttpServletRequest request, String token) throws IOException, NoSuchAlgorithmException {
        var email = request.getParameter("email");
        var orderId = request.getParameter("orderId");
        var conversionActionId = request.getParameter("conversionActionId");
        log.debug("Processing enhancement request for orderId: {}, conversionActionId: {}", orderId, conversionActionId);

        return uploadEnhancedConversion(token, developerToken, customerId, orderId, email, conversionActionId);
    }

    private void writeResponse(SlingHttpServletResponse response, JsonObject responseObject) throws IOException {
        try (PrintWriter pw = response.getWriter()) {
            pw.write(responseObject.toString());
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_ACCEPTED);
        }
    }

    @ObjectClassDefinition
    @interface Configuration {

        @AttributeDefinition(name = "Customer ID")
        String customerId();

        @AttributeDefinition(name = "Developer Token")
        String developerToken();

        @AttributeDefinition(name = "Client ID")
        String clientId();

        @AttributeDefinition(name = "Client Secret")
        String clientSecret();

        @AttributeDefinition(name = "Refresh Token")
        String refreshToken();
    }
}
