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
import org.apache.sling.servlets.annotations.SlingServletPrefix;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.List;

@Component(
		service = {Servlet.class})
@SlingServletPrefix("/apps/")
@SlingServletResourceTypes(
		resourceTypes = "dhl/components/content/inlineshipnowmarketoconfigurable",
		methods = HttpConstants.METHOD_POST,
		extensions = "html",
		selectors = "form"
)
public class MarketoSubmissionServlet extends SlingAllMethodsServlet{

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

		if(response.isCommitted()){
			LOGGER.info("Servlet response is committed");
		} else {
			LOGGER.info("Servlet response is not (YET) committed");
		}

		if(null != token && form.isOk()){
			LOGGER.info("Got authentication token, proceeding to form submission");
			var formSubmissionResponse = httpCommunication.submitForm(form,token );
			provideResponse(formSubmissionResponse);
		} else {
			LOGGER.error("Unable to get the authentication token from Marketo or there was a problem with the provided data");
		}
	}

	private void provideResponse(FormSubmissionResponse formSubmissionResponse){
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
			LOGGER.info("Marketo form submission: OK");
		} else {
			List<FormSubmissionErrors> errors = formSubmissionResponse.getFormSubmissionErrors();
			for (FormSubmissionErrors formSubmissionErrors : errors){
				LOGGER.error("Error has occurred when submitting Marketo form. Status code: {}, Message: {}", formSubmissionErrors.getCode(), formSubmissionErrors.getMessage());
			}
		}
	}

}
