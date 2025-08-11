package com.dhl.discover.genai.service;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageContentExtractorService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.genai.api.GenAiClient;
import com.dhl.discover.genai.api.enums.Role;
import com.dhl.discover.genai.api.request.GenAiRequest;
import com.dhl.discover.genai.api.request.Message;
import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.exception.InvalidRoleException;
import com.dhl.discover.genai.prompt.PromptProvider;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.ArrayList;
import java.util.List;

@Component(service = DialogAiAssistantService.class)
public class DialogAiAssistantService {
    private static final int DEFAULT_MAX_TOKENS = 1000;
    private static final String JSON_ROLE = "role";
    private static final String JSON_CONTENT = "content";
    private static final String PAGE_CONTEXT_FORMAT = """
            - Page Title: %s
            - Page Description: %s
            - Page Language: %s
            """;

    @Reference
    private GenAiClient client;

    @Reference
    private PageUtilService pageUtilService;

    @Reference
    private PageContentExtractorService pageContentExtractorService;

    public String sendChatMessage(JsonArray chatHistory, Resource resource, boolean addFullBodyContext) throws InvalidRoleException, AiException {
        List<Message> chatMessages = mapChatHistoryToMessages(chatHistory);

        var request = new GenAiRequest();
        request.setMaxTokens(DEFAULT_MAX_TOKENS);
        request.addMessage(Message.system(PromptProvider.DIALOG_AI_ASSISTANT_SYSTEM_INSTRUCTION));
        request.addMessages(getContextMessages(resource, addFullBodyContext));
        request.addMessages(chatMessages);
        var response = client.generateContent(request);

        return response.getFirstChoiceText();
    }

    private List<Message> getContextMessages(Resource resource, boolean addFullBodyContext) {
        List<Message> messages = new ArrayList<>();

        var page = pageUtilService.getPage(resource);
        if (page == null) {
            return messages;
        }
        messages.add(Message.system(getPageContext(page)));

        if (addFullBodyContext) {
            String pageContent = pageContentExtractorService.extract(page);
            messages.add(Message.user(pageContent));
        }

        return messages;
    }

    private String getPageContext(Page page) {
        return String.format(PAGE_CONTEXT_FORMAT,
                page.getTitle(),
                page.getDescription(),
                page.getLanguage());
    }

    public List<Message> mapChatHistoryToMessages(JsonArray chatHistory) throws InvalidRoleException {
        List<Message> messages = new ArrayList<>();
        if (chatHistory == null || chatHistory.isEmpty()) {
            return messages;
        }

        for(JsonElement element : chatHistory) {
            var entry = element.getAsJsonObject();
            var roleValue = entry.get(JSON_ROLE).getAsString();
            var content = entry.get(JSON_CONTENT).getAsString();

            var role = Role.fromString(roleValue);

            messages.add(new Message(role, content));
        }

        return messages;
    }
}
