package com.dhl.discover.genai.api.request;

import com.dhl.discover.genai.api.enums.Role;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MessageBuilderTest {

    @Test
    void testAddImage() {
        String imageUrl = "http://example.com/image.jpg";
        Message.MessageBuilder builder = new Message.MessageBuilder();
        builder.addImage(imageUrl);

        Message message = builder.build();
        JsonArray content = message.asJsonObject().get("content").getAsJsonArray();

        assertEquals(1, content.size());
        JsonObject imageEntry = content.get(0).getAsJsonObject();
        assertEquals("image_url", imageEntry.get("type").getAsString());
        assertEquals(imageUrl, imageEntry.getAsJsonObject("image_url").get("url").getAsString());
    }

    @Test
    void testAddText() {
        String text = "This is a test message.";
        Message.MessageBuilder builder = new Message.MessageBuilder();
        builder.addText(text);

        Message message = builder.build();
        JsonArray content = message.asJsonObject().get("content").getAsJsonArray();

        assertEquals(1, content.size());
        JsonObject textEntry = content.get(0).getAsJsonObject();
        assertEquals("text", textEntry.get("type").getAsString());
        assertEquals(text, textEntry.get("text").getAsString());
    }

    @Test
    void testSetRole() {
        Message.MessageBuilder builder = new Message.MessageBuilder();
        builder.setRole(Role.ASSISTANT);

        Message message = builder.build();
        assertEquals("assistant", message.asJsonObject().get("role").getAsString());
    }

    @Test
    void testBuildWithMultipleEntries() {
        String imageUrl = "http://example.com/image.jpg";
        String text = "This is a test message.";
        Message.MessageBuilder builder = new Message.MessageBuilder();
        builder.addImage(imageUrl).addText(text).setRole(Role.SYSTEM);

        Message message = builder.build();
        JsonArray content = message.asJsonObject().get("content").getAsJsonArray();

        assertEquals(2, content.size());

        JsonObject imageEntry = content.get(0).getAsJsonObject();
        assertEquals("image_url", imageEntry.get("type").getAsString());
        assertEquals(imageUrl, imageEntry.getAsJsonObject("image_url").get("url").getAsString());

        JsonObject textEntry = content.get(1).getAsJsonObject();
        assertEquals("text", textEntry.get("type").getAsString());
        assertEquals(text, textEntry.get("text").getAsString());

        assertEquals("system", message.asJsonObject().get("role").getAsString());
    }

}