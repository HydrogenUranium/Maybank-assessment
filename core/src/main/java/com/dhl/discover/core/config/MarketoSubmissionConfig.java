package com.dhl.discover.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(
		name = "[DHL] | Marketo Submission Config",
		description = "Configuration related to 'hidden' Marketo form submissions"
)
public @interface MarketoSubmissionConfig {

	@AttributeDefinition(
			name = "Marketo hidden form submissions enabled",
			description = "If checked, marketo hidden form submissions will be sent to Marketo via API (if other criteria are met)",
			type = AttributeType.BOOLEAN
	)
	boolean marketoHiddenFormSubmissionEnabled() default false;

	@AttributeDefinition(
			name = "Marketo Host",
			description = "Hostname where we should send the data from 'hidden form'",
			defaultValue = "https://084-XPW-627.mktorest.com",
			type = AttributeType.STRING
	)
	String getMarketoHostname();

	@AttributeDefinition(
			name = "Client ID",
			description = "One of the values required for generating the bearer token",
			type = AttributeType.PASSWORD
	)
	String getClientId();

	@AttributeDefinition(
			name = "Client secret",
			description = "One of the values required for generating the bearer token",
			type = AttributeType.PASSWORD
	)
	String getSecret();

	@AttributeDefinition(
			name = "Marketo form submission API path",
			description = "Path where form submission endpoint is (value should not include protocol and / or hostname)",
			type = AttributeType.STRING
	)
	String formSubmissionAPIEndpoint() default "/rest/v1/leads/submitForm.json";

	@AttributeDefinition(
			name = "Marketo authentication API path",
			description = "Path where authentication requests are to be sent (value should not include protocol and / or hostname)",
			type = AttributeType.STRING
	)
	String marketoAuthenticationAPIEndpoint() default "/identity/oauth/token";

	@AttributeDefinition(
			name = "Marketo form description API path",
			description = "Path where form description endpoint is on Marketo side.",
			type = AttributeType.STRING
	)
	String marketoFormDescriptionAPIEndpoint() default "/rest/v1/leads/describe2.json";

	@AttributeDefinition(
			name = "Marketo form asset API path",
			description = "Path in Marketo REST API where we can get all the possible fields available in the form",
			type = AttributeType.STRING
	)
	String marketoFormFieldsAPIEndpoint() default "/rest/asset/v1/form/{0}/fields.json";

	@AttributeDefinition(
			name = "API submission required path",
			description = "Configuration that controls the paths (or portions of paths) that are valid for Marketo API submission. If left empty, only 'en-global' paths are valid.",
			type = AttributeType.STRING
	)
	String[] validPathsForApiSubmission() default {"/content/dhl/global/en-global"};
}


