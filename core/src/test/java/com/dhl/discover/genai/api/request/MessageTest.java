package com.dhl.discover.genai.api.request;

import com.dhl.discover.genai.api.enums.Role;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MessageTest {

    @Test
    void testMessageWithStringContent() {
        String content = "This is a test message.";
        Message message = new Message(Role.USER, content);

        JsonObject jsonObject = message.asJsonObject();
        assertEquals("user", jsonObject.get("role").getAsString());
        assertEquals(content, jsonObject.get("content").getAsString());
    }

    @Test
    void testMessageWithJsonArrayContent() {
        JsonArray content = new JsonArray();
        content.add("Item 1");
        content.add("Item 2");

        Message message = new Message(Role.ASSISTANT, content);

        JsonObject jsonObject = message.asJsonObject();
        assertEquals("assistant", jsonObject.get("role").getAsString());
        assertEquals(content, jsonObject.get("content").getAsJsonArray());
    }

    @Test
    void testSystemMessage() {
        String content = "System instruction message.";
        Message message = Message.system(content);

        JsonObject jsonObject = message.asJsonObject();
        assertEquals("system", jsonObject.get("role").getAsString());
        assertEquals(content, jsonObject.get("content").getAsString());
    }

    @Test
    void testAsJsonObjectReturnsDeepCopy() {
        String content = "Original content.";
        Message message = new Message(Role.USER, content);

        JsonObject jsonObject1 = message.asJsonObject();
        JsonObject jsonObject2 = message.asJsonObject();

        assertNotSame(jsonObject1, jsonObject2);
        assertEquals(jsonObject1, jsonObject2);
    }
}