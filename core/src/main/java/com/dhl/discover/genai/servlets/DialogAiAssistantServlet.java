package com.dhl.discover.genai.servlets;

import com.dhl.discover.genai.exception.AiException;
import com.dhl.discover.genai.exception.InvalidRoleException;
import com.dhl.discover.genai.service.DialogAiAssistantService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

@Component(service = Servlet.class)
@SlingServletResourceTypes(
        resourceTypes = "cq/Page",
        methods = HttpConstants.METHOD_POST,
        extensions = "json",
        selectors = "dialogAiAssistant"
)
@Slf4j
public class DialogAiAssistantServlet extends SlingAllMethodsServlet {

    @Reference
    private transient DialogAiAssistantService dialogAiAssistantService;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");

        try {
            JsonObject responseBody = processRequest(request);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(responseBody.toString());
        } catch (AiException e) {
            handleError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Internal Error. " + e.getMessage());
            log.error("Failed to retrieve asset for description generation: {}", e.getMessage(), e);
        } catch (IOException | InvalidRoleException e) {
            handleError(response, HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid request body. " + e.getMessage());
            log.warn("Invalid request body for dialog AI assistant: {}", e.getMessage(), e);
        }
    }

    private JsonObject processRequest(SlingHttpServletRequest request) throws IOException, AiException, InvalidRoleException {
        var jsonResponse = new JsonObject();
        var jsonRequest = getRequestBodyAsJson(request);
        var chatHistory = jsonRequest.getAsJsonArray("messages");
        var resource = request.getResource();
        boolean addFullBodyContext = Boolean.parseBoolean(request.getParameter("addFullBodyContext"));
        if(chatHistory == null) {
            throw new IOException("Missing 'messages' in request body");
        }

        jsonResponse.addProperty("result", dialogAiAssistantService.sendChatMessage(chatHistory, resource, addFullBodyContext));
        jsonResponse.addProperty("status", "Success");
        return jsonResponse;
    }

    private void handleError(SlingHttpServletResponse response, int statusCode, String errorMessage) throws IOException {
        response.setStatus(statusCode);
        var errorResponse = new JsonObject();
        errorResponse.addProperty("status", "Error");
        errorResponse.addProperty("errorMessage", errorMessage);
        response.getWriter().write(errorResponse.toString());
    }

    public JsonObject getRequestBodyAsJson(SlingHttpServletRequest request) throws IOException {
        var requestBody = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }
        }
        return JsonParser.parseString(requestBody.toString()).getAsJsonObject();
    }

}
