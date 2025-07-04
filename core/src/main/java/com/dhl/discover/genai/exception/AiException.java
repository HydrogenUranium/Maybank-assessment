package com.dhl.discover.genai.exception;

/**
 * Custom exception class for AI-related errors.
 * This exception can be thrown when there are issues related to AI operations,
 * such as API errors, invalid responses, or other unexpected conditions.
 */
public class AiException extends Exception {
    public AiException(String message) {
        super(message);
    }
}
