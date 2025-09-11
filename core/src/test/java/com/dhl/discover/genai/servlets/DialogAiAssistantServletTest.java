package com.dhl.discover.genai.servlets;

import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.exception.InvalidRoleException;
import com.dhl.discover.genai.service.DialogAiAssistantService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.PrintWriter;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class DialogAiAssistantServletTest {

    @Mock
    private DialogAiAssistantService dialogAiAssistantService;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private SlingHttpServletResponse response;

    @Mock
    private PrintWriter printWriter;

    @InjectMocks
    private DialogAiAssistantServlet servlet;

    private JsonObject validRequestBody;

    @BeforeEach
    void setUp() throws Exception {
        validRequestBody = new JsonObject();
        JsonArray messages = new JsonArray();
        JsonObject message = new JsonObject();
        message.addProperty("role", "user");
        message.addProperty("content", "Hello");
        messages.add(message);
        validRequestBody.add("messages", messages);

        when(request.getReader()).thenReturn(new java.io.BufferedReader(new java.io.StringReader(validRequestBody.toString())));
        when(response.getWriter()).thenReturn(printWriter);
    }

    @Test
    void testDoPostWithValidRequest() throws Exception {
        when(dialogAiAssistantService.sendChatMessage(any(JsonArray.class), any(), eq(false)))
                .thenReturn("Generated response");

        servlet.doPost(request, response);

        verify(response).setStatus(SlingHttpServletResponse.SC_OK);
        verify(printWriter).write(contains("\"status\":\"Success\""));
        verify(printWriter).write(contains("\"result\":\"Generated response\""));
    }

    @Test
    void testDoPostWithMissingMessages() throws Exception {
        when(request.getReader()).thenReturn(new java.io.BufferedReader(new java.io.StringReader("{}")));

        servlet.doPost(request, response);

        verify(response).setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
        verify(printWriter).write(contains("\"status\":\"Error\""));
        verify(printWriter).write(contains("\"errorMessage\":\"Invalid request body. Missing 'messages' in request body\""));
    }

    @Test
    void testDoPostWithInvalidRoleException() throws Exception {
        when(dialogAiAssistantService.sendChatMessage(any(JsonArray.class), any(), eq(false)))
                .thenThrow(new InvalidRoleException("Invalid role"));

        servlet.doPost(request, response);

        verify(response).setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
        verify(printWriter).write(contains("\"status\":\"Error\""));
        verify(printWriter).write(contains("\"errorMessage\":\"Invalid request body. Invalid role\""));
    }

    @Test
    void testDoPostWithAiException() throws Exception {
        when(dialogAiAssistantService.sendChatMessage(any(JsonArray.class), any(), eq(false)))
                .thenThrow(new AiException("AI processing error"));

        servlet.doPost(request, response);

        verify(response).setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        verify(printWriter).write(contains("\"status\":\"Error\""));
        verify(printWriter).write(contains("\"errorMessage\":\"Internal Error. AI processing error\""));
    }
}