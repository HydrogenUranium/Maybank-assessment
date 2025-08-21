package com.dhl.discover.genai.service;

import com.day.cq.dam.api.Asset;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.genai.api.GenAiClient;
import com.dhl.discover.genai.api.request.GenAiRequest;
import com.dhl.discover.genai.api.response.GenAiResponse;
import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.exception.UnsupportedLanguageException;
import com.dhl.discover.genai.prompt.PromptProvider;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetDescriptionServiceTest {

    @Mock
    private PromptProvider promptProvider;

    @Mock
    private GenAiClient client;

    @Mock
    private AssetUtilService assetUtilService;

    @Mock
    private Asset asset;

    @Mock
    private Resource resource;

    @Mock
    private GenAiResponse response;

    @InjectMocks
    private AssetDescriptionService assetDescriptionService;

    private static final String BASE64_IMAGE = "mockBase64Image";
    private static final String PROMPT = "Please create descriptive alt text for this image in en language";
    private static final String DESCRIPTION = "Generated description";

    @BeforeEach
    void setUp() {
        when(assetUtilService.getBase64(asset)).thenReturn(BASE64_IMAGE);
    }

    @Test
    void testGenerateDescriptionWithAsset() throws UnsupportedLanguageException, AiException {
        when(promptProvider.getAssetDescriptionPrompt(asset)).thenReturn(PROMPT);
        when(response.getFirstChoiceText()).thenReturn(DESCRIPTION);

        when(client.generateContent(any(GenAiRequest.class))).thenReturn(response);

        String result = assetDescriptionService.generateDescription(asset);

        assertEquals(DESCRIPTION, result);
        verify(promptProvider).getAssetDescriptionPrompt(asset);
        verify(assetUtilService).getBase64(asset);
        verify(client).generateContent(any(GenAiRequest.class));
    }

    @Test
    void testGenerateDescriptionWithAssetAndLocale() throws AiException {
        when(promptProvider.getAssetDescriptionPrompt(Locale.ENGLISH)).thenReturn(PROMPT);
        when(response.getFirstChoiceText()).thenReturn(DESCRIPTION);

        when(client.generateContent(any(GenAiRequest.class))).thenReturn(response);

        String result = assetDescriptionService.generateDescription(asset, Locale.ENGLISH);

        assertEquals(DESCRIPTION, result);
        verify(promptProvider).getAssetDescriptionPrompt(Locale.ENGLISH);
        verify(assetUtilService).getBase64(asset);
        verify(client).generateContent(any(GenAiRequest.class));
    }

    @Test
    void testGenerateDescriptionWithAssetAndResource() throws UnsupportedLanguageException, AiException {
        when(promptProvider.getAssetDescriptionPrompt(resource)).thenReturn(PROMPT);
        when(response.getFirstChoiceText()).thenReturn(DESCRIPTION);

        when(client.generateContent(any(GenAiRequest.class))).thenReturn(response);

        String result = assetDescriptionService.generateDescription(asset, resource);

        assertEquals(DESCRIPTION, result);
        verify(promptProvider).getAssetDescriptionPrompt(resource);
        verify(assetUtilService).getBase64(asset);
        verify(client).generateContent(any(GenAiRequest.class));
    }
}