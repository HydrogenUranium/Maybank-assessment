package com.dhl.discover.genai.exception;

/**
 * Exception thrown when an unsupported language is encountered.
 * This can be used to indicate that a specific language is not supported
 * by the AI model or service being used.
 */
public class UnsupportedLanguageException extends Exception {
    public UnsupportedLanguageException(String message) {
        super(message);
    }
}
