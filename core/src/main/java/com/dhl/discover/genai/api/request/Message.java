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

    public static class MessageBuilder {
        private Role role = Role.USER;
        private final JsonArray jsonArrayContent = new JsonArray();

        public MessageBuilder setRole(Role role) {
            this.role = role;
            return this;
        }

        public MessageBuilder addText(String text) {
            JsonObject textObject = new JsonObject();
            textObject.addProperty("type", "text");
            textObject.addProperty("text", text);
            jsonArrayContent.add(textObject);
            return this;
        }

        public MessageBuilder addImage(String base64) {
            JsonObject imageObject = new JsonObject();
            imageObject.addProperty("type", "image_url");

            JsonObject imageUrl = new JsonObject();
            imageUrl.addProperty("url", base64);

            imageObject.add("image_url", imageUrl);
            jsonArrayContent.add(imageObject);
            return this;
        }

        public Message build() {
            if (role == null) {
                throw new IllegalStateException("Role must be specified");
            }
            return new Message(role, jsonArrayContent);
        }
    }
}
