package com.dhl.discover.genai.api.response;

import com.dhl.discover.genai.exception.AiException;
import com.google.gson.JsonObject;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class GenAiResponse {
    private final String id;
    private final String object;
    private final String model;
    private final long created;
    private final List<Choice> choices = new ArrayList<>();

    public GenAiResponse(JsonObject response) {
        this.id = response.get("id").getAsString();
        this.object = response.get("object").getAsString();
        this.created = response.get("created").getAsLong();
        this.model = response.get("model").getAsString();

        if (response.has("choices")) {
            response.getAsJsonArray("choices").forEach(
                choice -> choices.add(new Choice(choice.getAsJsonObject())));

        }
    }

    public String getFirstChoiceText() throws AiException {
        if (choices == null || choices.isEmpty()) {
            throw new AiException("No choices returned from AI response");
        }

        return choices.getFirst().getText();
    }
}
