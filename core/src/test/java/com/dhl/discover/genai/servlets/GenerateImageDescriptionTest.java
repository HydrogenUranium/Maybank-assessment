package com.dhl.discover.genai.servlets;

import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.LanguageManager;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.service.AssetDescriptionService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Locale;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GenerateImageDescriptionTest {

    @Mock
    private AssetDescriptionService assetDescriptionService;

    @Mock
    private AssetUtilService assetUtilService;

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @Mock
    private LanguageManager languageManager;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private SlingHttpServletResponse response;

    @Mock
    private Resource resource;

    @Mock
    private ValueMap valueMap;

    @Mock
    private PrintWriter printWriter;

    @InjectMocks
    private GenerateImageDescription servlet;

    @Mock
    private Asset asset;

    private static final String ASSET_PATH = "/content/dam/image.jpg";
    private static final String GENERATED_DESCRIPTION = "Generated description";

    @BeforeEach
    void setUp() throws Exception {
        when(request.getResource()).thenReturn(resource);
        when(response.getWriter()).thenReturn(printWriter);
    }

    @Test
    void testDoGetWithValidAssetPath() throws Exception {
        when(languageManager.getLanguage(any(Resource.class))).thenReturn(Locale.ENGLISH);
        when(request.getParameter("assetPath")).thenReturn(ASSET_PATH);
        when(assetUtilService.getAsset(eq(ASSET_PATH), any())).thenReturn(asset);
        when(assetDescriptionService.generateDescription(any(), any(Locale.class))).thenReturn(GENERATED_DESCRIPTION);

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_OK);
        verify(printWriter).write(contains("\"status\":\"Success\""));
        verify(printWriter).write(contains("\"result\":\"Generated description\""));
    }

    @Test
    void testDoGetByAssetAndLanguage() throws AiException, IOException {
        when(request.getParameter("locale")).thenReturn("en_au");
        when(resource.getResourceType()).thenReturn("dam:Asset");
        when(resource.getPath()).thenReturn(ASSET_PATH);
        when(assetUtilService.getAsset(eq(ASSET_PATH), any())).thenReturn(asset);
        when(assetDescriptionService.generateDescription(any(), any(Locale.class))).thenReturn(GENERATED_DESCRIPTION);

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_OK);
        verify(printWriter).write(contains("\"status\":\"Success\""));
        verify(printWriter).write(contains("\"result\":\"Generated description\""));
    }

    @Test
    void testDoGetWithMissingAssetPath() throws Exception {
        when(request.getParameter("assetPath")).thenReturn(null);
        when(resource.getValueMap()).thenReturn(valueMap);
        when(valueMap.get("fileReference", String.class)).thenReturn(null);

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        verify(printWriter).write(contains("\"status\":\"Error\""));
        verify(printWriter).write(contains("\"errorMessage\":\"Failed to retrieve asset. Asset is not configured."));
    }

    @Test
    void testDoGetWithRepositoryException() throws Exception {
        when(request.getParameter("assetPath")).thenReturn(ASSET_PATH);
        when(assetUtilService.getAsset(eq(ASSET_PATH), any())).thenReturn(null);

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        verify(printWriter).write(contains("\"status\":\"Error\""));
        verify(printWriter).write(contains("\"errorMessage\":\"Failed to retrieve asset. Asset not found at path: /content/dam/image.jpg\""));
    }
}