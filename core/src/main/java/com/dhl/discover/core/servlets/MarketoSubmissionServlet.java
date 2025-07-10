package com.dhl.discover.core.servlets;

import com.dhl.discover.core.services.InputParamHelper;
import com.dhl.discover.core.services.MarketoCommunication;
import com.dhl.discover.core.config.MarketoSubmissionConfigReader;
import com.dhl.discover.core.dto.marketo.FormInputBase;
import com.dhl.discover.core.dto.marketo.FormSubmissionErrors;
import com.dhl.discover.core.dto.marketo.FormSubmissionResponse;
import com.dhl.discover.core.dto.marketo.MarketoSubmissionResult;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletPrefix;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component(
		service = {Servlet.class})
@SlingServletPrefix("/apps/")
@SlingServletResourceTypes(
		resourceTypes = {
				"dhl/components/content/inlineshipnowmarketoconfigurable",
				"dhl/components/content/download",
				"dhl/components/content/marketoForm"
		},
		methods = HttpConstants.METHOD_POST,
		extensions = "html",
		selectors = "form"
)
public class MarketoSubmissionServlet extends SlingAllMethodsServlet{

	private static final String INVALID_RESPONSE_STATUS = "skipped";

	@Reference
	private transient InputParamHelper inputParamHelper;

	@Reference
	private transient MarketoCommunication marketoCommunication;

	@Reference
	private transient MarketoSubmissionConfigReader configReader;

	@Override
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
		boolean canProceed = canProceed(request);

		if(canProceed){
			log.info("OSGi configuration sets Marketo Hidden form submission to 'enabled'. Proceeding ...");
			int formId = inputParamHelper.getFormId(request);
			String token = marketoCommunication.requestNewToken();
			List<String> availableFormFieldNames = marketoCommunication.getAvailableFormFieldNames(token);
			List<String> formFields = marketoCommunication.getFormFields(token, formId);
			response.setContentType("text/html");
			FormInputBase form = inputParamHelper.buildForm(request, availableFormFieldNames,formFields );

			PrintWriter pw = response.getWriter();

			if(null != token && form.isOk()){
				log.info("Got authentication token, proceeding to form submission");
				var formSubmissionResponse = marketoCommunication.submitForm(form,token );
				provideResponse(formSubmissionResponse, pw);
			} else {
				log.error("The Marketo hidden form submission was failed");
				pw.write(escapeHtml("KO"));
				canProceed = false;
			}
		} else {
			log.error("OSGi and/or Environment configuration don't allow submit hidden form. Not doing anything...");
		}
		response.setStatus(canProceed ? 202 : 403);
	}

	private void provideResponse(FormSubmissionResponse formSubmissionResponse, PrintWriter printWriter){
		log.info("Processing Marketo response");
		if (formSubmissionResponse.getFormSubmissionErrors() == null) {
			if (log.isDebugEnabled()) {
				log.debug("Form submission to Marketo was received by backend. Response: {}", formSubmissionResponse);
			}
			if (formSubmissionResponse.getMarketoSubmissionResultList() != null) {
				for (MarketoSubmissionResult result : formSubmissionResponse.getMarketoSubmissionResultList()){
					String status = result.getStatus();
					long statusCode = result.getId();
					if (INVALID_RESPONSE_STATUS.equals(status)) {
						log.error("Second Marketo request was sent, " +
								"but the response from the Marketo shows that the second request was not accepted " +
								"because the sender used IPv6 address");
					}
					log.info("Marketo form submission status code: {}, text: {}", statusCode, escapeHtml(status));
				}
			}
			printWriter.write(escapeHtml("OK"));
		} else {
			List<FormSubmissionErrors> errors = formSubmissionResponse.getFormSubmissionErrors();
			for (FormSubmissionErrors formSubmissionErrors : errors) {
				log.error("Error has occurred when submitting Marketo form. Status code: {}, Message: {}",
						escapeHtml(formSubmissionErrors.getCode()), escapeHtml(formSubmissionErrors.getMessage()));
			}
			printWriter.write(escapeHtml("KO"));
		}
	}

	private String escapeHtml(String input) {
		if (input == null) return "";
		return input.replace("&", "&amp;")
				.replace("<", "&lt;")
				.replace(">", "&gt;")
				.replace("\"", "&quot;")
				.replace("'", "&#x27;");
	}

	/**
	 * Simple check to verify if the functionality is enabled in OSGi configuration of the form submissions. Additionally, it also checks if the path to the form matches the allowed paths
	 * @return boolean {@code true} if functionality is enabled (and hostname, clientId & secretId values are present in OSGi configuration)
	 * or {@code false} if the functionality is disabled or any of the critical values is missing
	 */
	private boolean canProceed(SlingHttpServletRequest request){
		boolean functionalityEnabled = configReader.getMarketoHiddenFormSubmissionEnabled();
		String hostname = configReader.getMarketoHost();
		String clientId = configReader.getMarketoClientId();
		String secretId = configReader.getMarketoClientSecret();

		boolean host = hostname != null && !hostname.isEmpty();
		boolean client = clientId != null && !clientId.isEmpty();
		boolean secret = secretId != null && !secretId.isEmpty();

		boolean isPathValid = isPathValid(request);

		return functionalityEnabled && host && client && secret && isPathValid;
	}

	/**
	 * Validates that the provided 'path' of the request is valid for API submission. This is controlled by OSGi configuration.
	 * @param request SlingHttpServletRequest representing the request
	 * @return a boolean {@code true} if provided 'path' is valid for API submission or {@code false} if it's not
	 */
	private boolean isPathValid(SlingHttpServletRequest request){
		String formStart = inputParamHelper.getRequestParameter(request, "formStart");
		if(null != formStart){
			Optional<String> pathOK = configReader.getAPIAllowedPaths().stream()
					.filter(formStart::contains)
					.findFirst();
			return pathOK.isPresent();
		}
		return false;
	}

}
