package com.dhl.discover.genai.api.request;

import com.dhl.discover.genai.api.enums.Role;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class Message {
    private final JsonObject jsonObject = new JsonObject();

    public Message(Role role, String content) {
        jsonObject.addProperty("role", role.getValue());
        jsonObject.addProperty("content", content);
    }
    public Message(Role role, JsonArray content) {
        jsonObject.addProperty("role", role.getValue());
        jsonObject.add("content", content);
    }

    public static Message system(String content) {
        return new Message(Role.SYSTEM, content);
    }

    public static MessageBuilder getBuilder() {
        return new MessageBuilder();
    }

    public JsonObject asJsonObject() {
        return jsonObject.deepCopy();
    }
}
