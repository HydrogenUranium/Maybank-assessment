/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.servlets;

import com.positive.dhl.core.dto.marketo.FormInputBase;
import com.positive.dhl.core.dto.marketo.FormSubmissionErrors;
import com.positive.dhl.core.dto.marketo.FormSubmissionResponse;
import com.positive.dhl.core.dto.marketo.MarketoSubmissionResult;
import com.positive.dhl.core.services.HttpCommunication;
import com.positive.dhl.core.services.InputParamHelper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@Component(
		service = Servlet.class,
		property ={
				"sling.servlet.resourceTypes=" + "dhl-submit",
				"sling.servlet.selectors=" + "marketo",
				"sling.servlet.extensions=" + "html",
				"sling.servlet.methods=" + HttpConstants.METHOD_POST
		}
)
public class MarketoSubmissionServlet extends SlingAllMethodsServlet {

	private static final Logger LOGGER = LoggerFactory.getLogger(MarketoSubmissionServlet.class);

	@Reference
	private transient InputParamHelper inputParamHelper;

	@Reference
	private transient HttpCommunication httpCommunication;

	@Override
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		int formId = inputParamHelper.getFormId(request);
		String token = httpCommunication.requestNewToken();
		List<String> availableFormFieldNames = httpCommunication.getAvailableFormFieldNames(token);
		List<String> formFields = httpCommunication.getFormFields(token, formId);
		response.setContentType("text/html");
		FormInputBase form = inputParamHelper.buildForm(request, availableFormFieldNames,formFields );

		PrintWriter pw = response.getWriter();

		if(null != token && form.isOk()){
			LOGGER.info("Got authentication token, proceeding to form submission");
			var formSubmissionResponse = httpCommunication.submitForm(form,token );
			provideResponse(formSubmissionResponse, pw);
		} else {
			pw.write("KO");
		}
	}

	private void provideResponse(FormSubmissionResponse formSubmissionResponse, PrintWriter printWriter){
		LOGGER.info("Processing Marketo response");
		if(formSubmissionResponse.getFormSubmissionErrors() == null){
			if(LOGGER.isDebugEnabled()){
			    LOGGER.debug("Form submission to Marketo was received by backend. Response: {}", formSubmissionResponse);
			}
			if(formSubmissionResponse.getMarketoSubmissionResultList() != null){
				for (MarketoSubmissionResult result : formSubmissionResponse.getMarketoSubmissionResultList()){
					String status = result.getStatus();
					long statusCode = result.getId();
					LOGGER.info("Marketo form submission status code: {}, text: {}", statusCode,status);
				}
			}
			printWriter.write("OK");
		} else {
			List<FormSubmissionErrors> errors = formSubmissionResponse.getFormSubmissionErrors();
			for (FormSubmissionErrors formSubmissionErrors : errors){
				LOGGER.error("Error has occurred when submitting Marketo form. Status code: {}, Message: {}", formSubmissionErrors.getCode(), formSubmissionErrors.getMessage());
			}
			printWriter.write("KO");
		}
	}
}
