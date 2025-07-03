package com.dhl.discover.genai.api.request;

import com.dhl.discover.genai.api.enums.Role;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class MessageBuilder {
    private final JsonArray content = new JsonArray();
    private Role role = Role.USER;

    public MessageBuilder addImage(String imageUrl) {
        var entry = new JsonObject();
        var url = new JsonObject();
        url.addProperty("url", imageUrl);
        entry.addProperty("type", "image_url");
        entry.add("image_url", url);
        content.add(entry);
        return this;
    }

    public MessageBuilder addText(String text) {
        var entry = new JsonObject();
        entry.addProperty("type", "text");
        entry.addProperty("text", text);
        content.add(entry);
        return this;
    }

    public MessageBuilder setRole(Role role) {
        this.role = role;
        return this;
    }

    public Message build() {
        return new Message(role, content);
    }
}
