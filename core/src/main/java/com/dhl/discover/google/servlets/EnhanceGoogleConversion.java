package com.dhl.discover.google.servlets;

import com.adobe.granite.crypto.CryptoException;
import com.adobe.granite.crypto.CryptoSupport;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.exceptions.HttpRequestException;
import com.dhl.discover.google.services.GoogleAdsService;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.jetbrains.annotations.NotNull;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.NoSuchAlgorithmException;


@Slf4j
@Component(
        service = {Servlet.class})
@SlingServletResourceTypes(
        resourceTypes = {"cq/Page"},
        methods = HttpConstants.METHOD_POST,
        extensions = "html",
        selectors = "enhanced-google-conversion"
)
public class EnhanceGoogleConversion extends SlingAllMethodsServlet {
    @Reference
    private transient GoogleAdsService googleApiService;

    @Reference
    private transient CryptoSupport cryptoSupport;

    @Override
    protected void doPost(@NotNull SlingHttpServletRequest request, @NotNull SlingHttpServletResponse response) throws IOException {
        try {
            JsonObject responseObject = processEnhancementRequest(request);
            writeResponse(response, responseObject);
        } catch (HttpRequestException e) {
            log.error("HTTP request error processing enhancement request", e);
            writeErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            log.error("Error processing enhancement request", e);
            writeErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Error");
        }
    }

    private JsonObject processEnhancementRequest(SlingHttpServletRequest request)
            throws IOException, NoSuchAlgorithmException, ServletException, CryptoException, HttpRequestException {
        Page page = request.getResource().adaptTo(Page.class);
        if (page == null) {
            throw new ServletException("Page not found for the request");
        }
        ValueMap googleAdsConfig = googleApiService.getGoogleAdsConfig(page);
        if (googleAdsConfig == null || googleAdsConfig.isEmpty()) {
            throw new ServletException("Google Ads configuration not found for page: " + page.getPath());
        }

        var developerToken = getRequiredParameter(googleAdsConfig, "developerToken");
        var customerId = getRequiredParameter(googleAdsConfig, "customerId");
        var email = getRequiredParameter(request, "email");
        var orderId = getRequiredParameter(request, "orderId");
        var conversionActionId = getRequiredParameter(request, "conversionActionId");
        return googleApiService.uploadEnhancedConversion(developerToken, customerId, orderId, email, conversionActionId);
    }

    private String getRequiredParameter(ValueMap valueMap, String param) throws CryptoException, ServletException {
        String value = valueMap.get(param, "");
        if(StringUtils.isBlank(value)) {
            throw new ServletException("Parameter " + param + " must not be blank");
        }

        if(cryptoSupport.isProtected(value)) {
            return cryptoSupport.unprotect(value);
        }
        return value;
    }

    private String getRequiredParameter(SlingHttpServletRequest request, String param) throws HttpRequestException {
        String value = request.getParameter(param);
        if (StringUtils.isBlank(value)) {
            throw new HttpRequestException("Parameter " + param + " must not be blank");
        }
        return value;
    }

    private void writeResponse(SlingHttpServletResponse response, JsonObject responseObject) throws IOException {
        try (PrintWriter pw = response.getWriter()) {
            pw.write(responseObject.toString());
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_ACCEPTED);
        }
    }

    private void writeErrorResponse(SlingHttpServletResponse response, int statusCode, String message) throws IOException {
        response.setContentType("application/json");
        response.setStatus(statusCode);
        var errorResponse = new JsonObject();
        errorResponse.addProperty("status", statusCode);
        errorResponse.addProperty("message", message);
        response.getWriter().write(errorResponse.toString());
    }
}
