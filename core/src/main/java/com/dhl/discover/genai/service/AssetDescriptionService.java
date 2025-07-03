package com.dhl.discover.genai.service;


import com.day.cq.dam.api.Asset;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.genai.api.GenAiClient;
import com.dhl.discover.genai.api.request.Message;
import com.dhl.discover.genai.api.request.GenAiRequest;
import com.dhl.discover.genai.api.response.Choice;
import com.dhl.discover.genai.api.response.GenAiResponse;
import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.exception.UnsupportedLanguageException;
import com.dhl.discover.genai.prompt.PromptProvider;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.List;

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

    public String generateDescription(Asset asset, Resource location) throws UnsupportedLanguageException, AiException {
        String prompt = promptProvider.getAssetDescriptionPrompt(location);
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

        return extractDescription(response);
    }

    private String extractDescription(GenAiResponse response) throws AiException {
        List<Choice> choices = response.getChoices();
        if (choices == null || choices.isEmpty()) {
            throw new AiException("No choices returned from AI response");
        }

        return choices.getFirst().getText();
    }
}
