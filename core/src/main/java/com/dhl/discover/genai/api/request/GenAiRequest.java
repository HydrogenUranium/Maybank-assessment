package com.dhl.discover.genai.api.request;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class GenAiRequest {
    private List<Message> messages = new ArrayList<>();
    private int maxTokens = 60;
    private double temperature = 0.7;
    private double topP = 0.95;
    private double frequencyPenalty = 0;
    private double presencePenalty = 0;

    public void addMessage(Message message) {
        messages.add(message);
    }

    public JsonArray getMessagesJsonArray() {
        var array = new JsonArray();
        messages.forEach(m -> array.add(m.asJsonObject()));
        return array;
    }

    public String toJson() {
        var json = new JsonObject();
        json.add("messages", getMessagesJsonArray());
        json.addProperty("temperature", temperature);
        json.addProperty("top_p", topP);
        json.addProperty("frequency_penalty", frequencyPenalty);
        json.addProperty("presence_penalty", presencePenalty);
        json.addProperty("max_tokens", maxTokens);
        return new Gson().toJson(json);
    }
}
