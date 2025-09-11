package com.dhl.discover.genai.servlets;

import com.day.cq.wcm.api.LanguageManager;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.service.AssetDescriptionService;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.RepositoryException;
import javax.servlet.Servlet;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Locale;

import static org.apache.sling.api.servlets.HttpConstants.METHOD_GET;

@Component(service = Servlet.class)
@SlingServletResourceTypes(
        resourceTypes = {"core/wcm/components/image", "dam/Asset"},
        methods = METHOD_GET,
        extensions = "json",
        selectors = "generateImageDescription"
)
@Slf4j
public class GenerateImageDescription extends SlingSafeMethodsServlet {

    @Reference
    private transient AssetDescriptionService assetDescriptionService;

    @Reference
    private transient AssetUtilService assetUtilService;

    @Reference
    private transient LanguageManager languageManager;

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    @Override
    public void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");

        try {
            JsonObject responseBody = processRequest(request);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(responseBody.toString());
        } catch (RepositoryException e) {
            handleError(response, "Failed to retrieve asset. " + e.getMessage());
            log.error("Failed to retrieve asset for description generation: {}", e.getMessage(), e);
        } catch (AiException e) {
            handleError(response, "Exception: " + e.getMessage());
            log.error("AI exception during asset description generation: {}", e.getMessage(), e);
        }
    }

    private String getAssetPath(SlingHttpServletRequest request) {
        var resource = request.getResource();
        if ("dam:Asset".equals(resource.getResourceType())) {
            return resource.getPath();
        }

        String assetPathParameter = request.getParameter("assetPath");
        if (StringUtils.isNotBlank(assetPathParameter)) {
            return assetPathParameter;
        }

        return resource.getValueMap().get("fileReference", String.class);
    }

    private Locale getLocale(SlingHttpServletRequest request) {
        String localeParam = request.getParameter("locale");
        if (StringUtils.isNotBlank(localeParam)) {
            return Locale.of(localeParam);
        }

        return null;
    }

    private String getDescription(SlingHttpServletRequest request) throws AiException, RepositoryException {
        String assetPath = getAssetPath(request);

        if (StringUtils.isBlank(assetPath)) {
            throw new RepositoryException("Asset is not configured.");
        }

        var asset = assetUtilService.getAsset(assetPath, resourceResolverHelper.getReadResourceResolver());
        if (asset == null) {
            throw new RepositoryException("Asset not found at path: " + assetPath);
        }

        var locale = getLocale(request);
        if (locale != null) {
            return assetDescriptionService.generateDescription(asset, locale);
        }

        return assetDescriptionService.generateDescription(asset, request.getResource());
    }

    private JsonObject processRequest(SlingHttpServletRequest request) throws RepositoryException, AiException {

        var description = getDescription(request);

        var jsonResponse = new JsonObject();
        jsonResponse.addProperty("result", description);
        jsonResponse.addProperty("status", "Success");
        return jsonResponse;
    }

    private void handleError(SlingHttpServletResponse response, String errorMessage) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        var errorResponse = new JsonObject();
        errorResponse.addProperty("status", "Error");
        errorResponse.addProperty("errorMessage", errorMessage);
        response.getWriter().write(errorResponse.toString());
    }
}
