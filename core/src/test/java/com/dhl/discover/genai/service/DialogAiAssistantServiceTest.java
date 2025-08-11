package com.dhl.discover.genai.service;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageContentExtractorService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.genai.api.GenAiClient;
import com.dhl.discover.genai.api.request.GenAiRequest;
import com.dhl.discover.genai.api.request.Message;
import com.dhl.discover.genai.api.response.GenAiResponse;
import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.exception.InvalidRoleException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DialogAiAssistantServiceTest {

    @Mock
    private GenAiClient client;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private PageContentExtractorService pageContentExtractorService;

    @Mock
    private Resource resource;

    @Mock
    private GenAiResponse response;

    @Mock
    private Page page;

    @InjectMocks
    private DialogAiAssistantService dialogAiAssistantService;

    private JsonArray chatHistory;

    @BeforeEach
    void setUp() {
        chatHistory = new JsonArray();

        JsonObject message1 = new JsonObject();
        message1.addProperty("role", "user");
        message1.addProperty("content", "Hello");
        chatHistory.add(message1);

        JsonObject message2 = new JsonObject();
        message2.addProperty("role", "assistant");
        message2.addProperty("content", "Hi there!");
        chatHistory.add(message2);
    }

    @Test
    void testMapChatHistoryToMessages() throws InvalidRoleException {
        List<Message> messages = dialogAiAssistantService.mapChatHistoryToMessages(chatHistory);

        assertEquals(2, messages.size());
        assertEquals("{\"role\":\"user\",\"content\":\"Hello\"}", messages.get(0).asJsonObject().toString());
        assertEquals("{\"role\":\"assistant\",\"content\":\"Hi there!\"}", messages.get(1).asJsonObject().toString());
    }

    @Test
    void testMapChatHistoryToMessagesInvalidRole() {
        JsonObject invalidMessage = new JsonObject();
        invalidMessage.addProperty("role", "invalid");
        invalidMessage.addProperty("content", "Invalid role");
        chatHistory.add(invalidMessage);

        assertThrows(InvalidRoleException.class, () -> dialogAiAssistantService.mapChatHistoryToMessages(chatHistory));
    }

    @Test
    void testSendChatMessage() throws InvalidRoleException, AiException {
        when(pageUtilService.getPage(any(Resource.class))).thenReturn(page);
        when(page.getTitle()).thenReturn("Test Page");
        when(page.getDescription()).thenReturn("This is a test page.");
        when(page.getLanguage()).thenReturn(Locale.forLanguageTag("en"));
        when(pageContentExtractorService.extract(any(Page.class))).thenReturn("Full body content of the page.");
        when(client.generateContent(any(GenAiRequest.class))).thenReturn(response);
        when(response.getFirstChoiceText()).thenReturn("Generated response");

        String result = dialogAiAssistantService.sendChatMessage(chatHistory, resource, true);

        assertEquals("Generated response", result);
        verify(client).generateContent(any(GenAiRequest.class));
    }
}