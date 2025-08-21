package com.dhl.discover.genai.service;


import com.day.cq.dam.api.Asset;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.genai.api.GenAiClient;
import com.dhl.discover.genai.api.request.Message;
import com.dhl.discover.genai.api.request.GenAiRequest;
import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.exception.UnsupportedLanguageException;
import com.dhl.discover.genai.prompt.PromptProvider;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.Locale;


@Component(service = AssetDescriptionService.class)
public class AssetDescriptionService {

    @Reference
    private PromptProvider promptProvider;

    @Reference
    private GenAiClient client;

    @Reference
    private AssetUtilService assetUtilService;

    public String generateDescription(Asset asset) throws UnsupportedLanguageException, AiException {
        String prompt = promptProvider.getAssetDescriptionPrompt(asset);
        return generateDescription(prompt, asset);
    }

    public String generateDescription(Asset asset, Resource location) throws AiException {
        String prompt = promptProvider.getAssetDescriptionPrompt(location);
        return generateDescription(prompt, asset);
    }

    public String generateDescription(Asset asset, Locale locale) throws AiException {
        String prompt = promptProvider.getAssetDescriptionPrompt(locale);
        return generateDescription(prompt, asset);
    }

    private String generateDescription(String prompt, Asset asset) throws AiException {
        String base64 = assetUtilService.getBase64(asset);

        var request = new GenAiRequest();
        request.addMessage(Message.system(PromptProvider.ASSET_DESCRIPTION_SYSTEM_INSTRUCTION));
        request.addMessage(Message.getBuilder()
                .addText(prompt)
                .addImage(base64)
                .build());
        request.setTemperature(0.5);
        var response = client.generateContent(request);

        return response.getFirstChoiceText();
    }
}
