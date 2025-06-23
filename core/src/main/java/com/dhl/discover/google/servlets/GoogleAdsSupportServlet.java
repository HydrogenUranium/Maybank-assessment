package com.dhl.discover.google.servlets;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.jetbrains.annotations.NotNull;
import org.osgi.service.component.annotations.Component;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;

import javax.servlet.Servlet;
import java.io.IOException;
import java.util.Collections;

@Component(service = Servlet.class, property = {
        "sling.servlet.methods=" + HttpConstants.METHOD_POST,
        "sling.servlet.resourceTypes=dhl/google-ads/create--cloud-configuration" }
)
@Slf4j
public class GoogleAdsSupportServlet extends SlingAllMethodsServlet {
    private static final String CLOUD_CONFIG_PATH = "settings/cloudconfigs/google-ads";

    @Override
    protected void doPost(@NotNull SlingHttpServletRequest request, @NotNull SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        var resolver = request.getResourceResolver();
        PageManager pageManager = resolver.adaptTo(PageManager.class);

        if (pageManager == null) {
            writeErrorResponse(response, "Unable to get page manager");
            return;
        }

        try {
            String configPath = getRequiredParam(request, "configPath");
            Resource cloudConfigFolder = createCloudConfigFolder(resolver, configPath);
            var page = createCloudConfigPage(pageManager, cloudConfigFolder, request);

            resolver.commit();
            writeSuccessResponse(response, page.getPath());
        } catch (Exception e) {
            log.error("Failed to create cloud config", e);
            writeErrorResponse(response, e.getMessage());
        }
    }

    private Resource createCloudConfigFolder(ResourceResolver resolver, String configPath) throws IOException {
        return ResourceUtil.getOrCreateResource(
                resolver,
                configPath + "/" + CLOUD_CONFIG_PATH,
                Collections.singletonMap(JcrConstants.JCR_PRIMARYTYPE, JcrResourceConstants.NT_SLING_FOLDER),
                JcrResourceConstants.NT_SLING_FOLDER,
                false
        );
    }

    private Page createCloudConfigPage(PageManager pageManager, Resource cloudConfigFolder, SlingHttpServletRequest request)
            throws IOException, WCMException {
        return pageManager.create(
                cloudConfigFolder.getPath(),
                getRequiredParam(request, "name"),
                getRequiredParam(request, "template"),
                getRequiredParam(request, "title")
        );
    }

    private String getRequiredParam(SlingHttpServletRequest request, String param) throws IOException {
        String value = request.getParameter(param);
        if (StringUtils.isBlank(value)) {
            throw new IOException("Parameter " + param + " must not be blank");
        }
        log.debug("Loaded {} for parameter {}", value, param);
        return value;
    }

    private void writeSuccessResponse(SlingHttpServletResponse response, String pagePath) throws IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        var successTemplate = """
                    {
                        "status": 200,
                        "message": "Cloud configuration created successfully",
                        "href": "/mnt/overlay/wcm/core/content/sites/properties.html?item=%s"
                    }
                """;
        var json = String.format(successTemplate, pagePath);
        response.getWriter().write(json);
    }

    private void writeErrorResponse(SlingHttpServletResponse response, String errorMessage) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        var errorTemplate = """
        {
            "status": 500,
            "message": "Failed to create cloud config: %s"
        }
        """;

        var json = String.format(errorTemplate, errorMessage);
        response.getWriter().write(json);
    }
}
