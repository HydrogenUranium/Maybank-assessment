package com.positive.dhl.core.servlets;

import com.positive.dhl.core.config.MarketoSubmissionConfigReader;
import com.positive.dhl.core.dto.marketo.FormInputBase;
import com.positive.dhl.core.dto.marketo.FormSubmissionErrors;
import com.positive.dhl.core.dto.marketo.FormSubmissionResponse;
import com.positive.dhl.core.dto.marketo.MarketoSubmissionResult;
import com.positive.dhl.core.services.MarketoCommunication;
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
import java.io.PrintWriter;
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
	private transient MarketoCommunication marketoCommunication;

	@Reference
	private transient MarketoSubmissionConfigReader configReader;

	@Override
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		boolean canProceed = canProceed();
		if(canProceed){
			LOGGER.info("OSGi configuration sets Marketo Hidden form submission to 'enabled'. Proceeding ...");
			int formId = inputParamHelper.getFormId(request);
			String token = marketoCommunication.requestNewToken();
			List<String> availableFormFieldNames = marketoCommunication.getAvailableFormFieldNames(token);
			List<String> formFields = marketoCommunication.getFormFields(token, formId);
			response.setContentType("text/html");
			FormInputBase form = inputParamHelper.buildForm(request, availableFormFieldNames,formFields );

			PrintWriter pw = response.getWriter();

			if(null != token && form.isOk()){
				LOGGER.info("Got authentication token, proceeding to form submission");
				var formSubmissionResponse = marketoCommunication.submitForm(form,token );
				provideResponse(formSubmissionResponse, pw);
			} else {
				pw.write("KO");
			}
		} else {
			LOGGER.warn("OSGi configuration sets the Marketo hidden form submission to 'disabled'. Not doing anything...");
		}
		response.setStatus(202);
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

	/**
	 * Simple check to verify if the functionality is enabled in OSGi configuration of the form submissions.
	 * @return boolean {@code true} if functionality is enabled (and hostname, clientId & secretId values are present in OSGi configuration)
	 * or {@code false} if the functionality is disabled or any of the critical values is missing
	 */
	private boolean canProceed(){
		boolean functionalityEnabled = configReader.getMarketoHiddenFormSubmissionEnabled();
		String hostname = configReader.getMarketoHost();
		String clientId = configReader.getMarketoClientId();
		String secretId = configReader.getMarketoClientSecret();

		boolean host = hostname != null && !hostname.isEmpty();
		boolean client = clientId != null && !clientId.isEmpty();
		boolean secret = secretId != null && !secretId.isEmpty();

		return functionalityEnabled && host && client && secret;
	}

}
