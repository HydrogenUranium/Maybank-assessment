/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services;

import com.positive.dhl.core.dto.marketo.FormInputBase;
import org.apache.sling.api.SlingHttpServletRequest;

import java.util.List;

/**
 * Simple service that ensures the processing of servlet input parameters.
 */
public interface InputParamHelper {

	/**
	 * Provides an instance of {@link FormInputBase} object, that contains all information necessary to send the Marketo submission
	 *
	 * @param request             is an instance of {@link SlingHttpServletRequest} that was received by the servlet
	 * @param permittedFieldNames is a {@link List} of {@link String}s where each item represents a field name that Marketo knows. This is
	 *                            especially important as javascript & SOAP Marketo APIs use different format of the field-names than REST API
	 * @param permittedFields is a {@code List} of {@code String}s where each item represents a form field available in the particular form
	 * @return a new instance of {@code FormInputBase}
	 */
	FormInputBase buildForm(SlingHttpServletRequest request, List<String> permittedFieldNames, List<String> permittedFields);

	/**
	 * Provides a form ID (if present in the request).
	 * @param request is an instance of {@code SlingHttpServletRequest} where we extract the information from
	 * @return an int representing the formID or 0 in case nothing was found
	 */
	int getFormId(SlingHttpServletRequest request);
}
