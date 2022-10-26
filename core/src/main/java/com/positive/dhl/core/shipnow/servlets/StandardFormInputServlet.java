package com.positive.dhl.core.shipnow.servlets;

import com.google.gson.JsonObject;
import com.positive.dhl.core.shipnow.models.ValidatedRequestEntry;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import java.io.IOException;

public abstract class StandardFormInputServlet extends SlingAllMethodsServlet {

    private static final String STATUS = "status";

    protected abstract ValidatedRequestEntry getValidatedRequestEntry(SlingHttpServletRequest request);
    protected abstract Boolean saveResponse(ValidatedRequestEntry entry);
    protected void addAdditionalHeaders(SlingHttpServletRequest request, SlingHttpServletResponse response) {

    }
    protected void performActionAfterSave(ValidatedRequestEntry entry) {

    }

    @Override
    public final void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        JsonObject responseJson = new JsonObject();

        ValidatedRequestEntry entry = this.getValidatedRequestEntry(request);
        if (!entry.validate()) {
            responseJson.addProperty(STATUS, "ko");
            responseJson.addProperty("error", "Please check the inputs and try again");
            responseJson.add("fields", entry.getErrors());

        } else {
            boolean result = this.saveResponse(entry);
            if (!result) {
                responseJson.addProperty(STATUS, "ko");
                responseJson.addProperty("error", "The record could not be saved");

            } else {
                responseJson.addProperty(STATUS, "OK");
                responseJson.addProperty("email", entry.get("email").toString());

                this.performActionAfterSave(entry);
            }
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        this.addAdditionalHeaders(request, response);

        response.getWriter().write(responseJson.toString());
    }
}
