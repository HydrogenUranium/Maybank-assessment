package com.dhl.discover.genai.api.response;

import com.google.gson.JsonObject;
import lombok.Getter;

@Getter
public class Choice {
    private final String text;

    public Choice(JsonObject choice) {
        this.text = choice.get("message").getAsJsonObject().get("content").getAsString();
    }
}
