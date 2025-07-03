package com.dhl.discover.genai.api.enums;

/**
 * Enum representing the roles used in GenAI API interactions.
 * <p>
 * This enum defines three roles: USER, ASSISTANT, and SYSTEM, each with a corresponding string value.
 * These roles are typically used to differentiate between the user input, the AI assistant's responses,
 * and system messages in a conversation.
 */
public enum Role {
    USER("user"),
    ASSISTANT("assistant"),
    SYSTEM("system");

    private final String value;

    Role(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}
