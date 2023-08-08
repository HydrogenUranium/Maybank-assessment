/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services;

import com.positive.dhl.core.dto.marketo.FormInputBase;
import com.positive.dhl.core.dto.marketo.FormSubmissionResponse;
import com.positive.dhl.core.dto.marketo.MarketoConnectionData;
import com.positive.dhl.core.exceptions.HttpRequestException;

import java.util.List;

/**
 * This interface contains methods that deal with http message exchange between AEM and, in theory, any backend.
 */
public interface MarketoCommunication {

	/**
	 * Requests new token from authentication backend. Authentication backend is expected to be provided either via OSGi configuration or
	 * by some *other* means
	 * @return new token string or {@code null} in case anything went wrong
	 */
	String requestNewToken();

	/**
	 * Returns a {@link List} of {@link String}s of all the form fields available in the REST API. This may be required
	 * to map the fields between the javascript & rest API fields (which <strong>may</strong> be different)
	 * @return a {@code List} of {@code String}s, where each item represents the field name. If any {@code problem} occurred
	 * during retrieval of the available field names, this list will be {@code empty}(!)
	 */
	List<String> getAvailableFormFieldNames(String authToken);

	/**
	 * Returns a {@link List} of {@link String}s of all fields available in the form (purpose of this request is to find out which fields
	 * are to be sent to Marketo based on this form ID)
	 * @param authToken is the authentication token
	 * @param formId is a formID where we want to find out the fields
	 * @return list of fields that the form (on Marketo) contains
	 */
	List<String> getFormFields(String authToken, int formId);

	/**
	 * Requests new token from authentication backend using the provided information.
	 *
	 * @param marketoConnectionData@return new token string or {@code null} in case anything went wrong
	 */
	String requestNewToken(MarketoConnectionData marketoConnectionData) throws HttpRequestException;

	/**
	 * Attempts to submit the form body to backend (it is assumed to be Marketo backend, but in reality this method might be re-purposed for
	 * other means as well
	 *
	 * @param form                is an instance of {@link FormInputBase} object, that we want to submit
	 * @param authenticationToken is the token we need to authenticate with to be able to submit the form
	 * @return http response text (it could indicate success or failure)
	 */
	FormSubmissionResponse submitForm(FormInputBase form, String authenticationToken);


}
