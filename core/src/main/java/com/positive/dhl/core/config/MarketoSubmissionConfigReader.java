package com.positive.dhl.core.config;

public interface MarketoSubmissionConfigReader {

	/**
	 * Provides the Marketo hostname available in the OSGi config
	 * @return String representing the hostname
	 */
	String getMarketoHost();

	/**
	 * Provides the Marketo clientId, one of the credential values
	 * @return String representing the client ID
	 */
	String getMarketoClientId();

	/**
	 * Provides the Marketo client secret, one of the credential values
	 * @return String representing the client secret
	 */
	String getMarketoClientSecret();

	/**
	 * Provides Marketo Authentication end-point
	 * @return String representing the API path where we can send authentication requests. Should never be empty or {@code null}
	 */
	String getMarketoAuthenticationAPIEndpoint();

	/**
	 * Provides Marketo form submission end-point
	 * @return String representing the API path where we can send the form submissions. Should never be empty or {@code null}
	 */
	String getMarketoFormSubmissionAPIEndpoint();

	/**
	 * Provides Marketo form description end-point
	 * @return String representing the API path where we can get the available form fields. Should never be empty or {@code null}
	 */
	String getMarketoFormDescriptionAPIEndpoint();

	/**
	 * Provides Marketo form fields end-point
	 * @return String representing the API path where we can get available fields for an individual form. Should never be empty or {@code null}
	 */
	String getMarketoFormFieldsAPIEndpoint();
}
