package com.dhl.discover.genai.api.request;

import com.dhl.discover.genai.api.enums.Role;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RequestTest {

    @Test
    void testAddMessage() {
        GenAiRequest request = new GenAiRequest();
        Message message = new Message(Role.USER, "Test message");
        request.addMessage(message);

        assertEquals(1, request.getMessages().size());
        assertEquals(message, request.getMessages().get(0));
    }

    @Test
    void testGetMessagesJsonArray() {
        GenAiRequest request = new GenAiRequest();
        Message message1 = new Message(Role.USER, "Message 1");
        Message message2 = new Message(Role.ASSISTANT, "Message 2");
        request.addMessage(message1);
        request.addMessage(message2);

        JsonArray jsonArray = request.getMessagesJsonArray();
        assertEquals(2, jsonArray.size());

        JsonObject jsonMessage1 = jsonArray.get(0).getAsJsonObject();
        assertEquals("user", jsonMessage1.get("role").getAsString());
        assertEquals("Message 1", jsonMessage1.get("content").getAsString());

        JsonObject jsonMessage2 = jsonArray.get(1).getAsJsonObject();
        assertEquals("assistant", jsonMessage2.get("role").getAsString());
        assertEquals("Message 2", jsonMessage2.get("content").getAsString());
    }

    @Test
    void testToJson() {
        GenAiRequest request = new GenAiRequest();
        request.setMaxTokens(100);
        request.setTemperature(0.8);
        request.setTopP(0.9);
        request.setFrequencyPenalty(0.1);
        request.setPresencePenalty(0.2);

        Message message = new Message(Role.SYSTEM, "System message");
        request.addMessage(message);

        String json = request.toJson();
        JsonObject jsonObject = new Gson().fromJson(json, JsonObject.class);

        assertEquals(100, jsonObject.get("max_tokens").getAsInt());
        assertEquals(0.8, jsonObject.get("temperature").getAsDouble());
        assertEquals(0.9, jsonObject.get("top_p").getAsDouble());
        assertEquals(0.1, jsonObject.get("frequency_penalty").getAsDouble());
        assertEquals(0.2, jsonObject.get("presence_penalty").getAsDouble());

        JsonArray messages = jsonObject.getAsJsonArray("messages");
        assertEquals(1, messages.size());
        JsonObject jsonMessage = messages.get(0).getAsJsonObject();
        assertEquals("system", jsonMessage.get("role").getAsString());
        assertEquals("System message", jsonMessage.get("content").getAsString());
    }
}