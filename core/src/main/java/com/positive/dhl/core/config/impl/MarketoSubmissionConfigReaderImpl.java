/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.config.impl;

import com.positive.dhl.core.config.MarketoSubmissionConfig;
import com.positive.dhl.core.config.MarketoSubmissionConfigReader;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.osgi.service.metatype.annotations.Designate;

@Component(
		service = MarketoSubmissionConfigReader.class,
		configurationPolicy = ConfigurationPolicy.REQUIRE
)
@Designate(ocd = MarketoSubmissionConfig.class)
@ServiceDescription("[DHL] | Configuration entries for Marketo form submissions")
public class MarketoSubmissionConfigReaderImpl implements MarketoSubmissionConfigReader {

	private String marketoHostname;
	private String marketoClientId;
	private String marketoSecretId;
	private String marketoAuthEndpoint;
	private String marketoFormSubmissionEndpoint;
	private String marketoFormDescriptionEndpoint;
	private String marketoFormFieldsEndpoint;
	private boolean marketoHiddenFormSubmissionsEnabled;

	@Activate
	@Modified
	private void activate(MarketoSubmissionConfig marketoSubmissionConfig){
		marketoHostname = PropertiesUtil.toString(marketoSubmissionConfig.getMarketoHostname(),"https://084-XPW-627.mktorest.com");
		marketoClientId = PropertiesUtil.toString(marketoSubmissionConfig.getClientId(), "");
		marketoSecretId = PropertiesUtil.toString(marketoSubmissionConfig.getSecret(),"");
		marketoAuthEndpoint = PropertiesUtil.toString(marketoSubmissionConfig.marketoAuthenticationAPIEndpoint(),"/identity/oauth/token");
		marketoFormSubmissionEndpoint = PropertiesUtil.toString(marketoSubmissionConfig.formSubmissionAPIEndpoint(),"/rest/v1/leads/submitForm.json");
		marketoFormDescriptionEndpoint = PropertiesUtil.toString(marketoSubmissionConfig.marketoFormDescriptionAPIEndpoint(),"/rest/v1/leads/describe2.json");
		marketoFormFieldsEndpoint = PropertiesUtil.toString(marketoSubmissionConfig.marketoFormFieldsAPIEndpoint(), "/rest/asset/v1/form/{0}/fields.json");
		marketoHiddenFormSubmissionsEnabled = PropertiesUtil.toBoolean(marketoSubmissionConfig.marketoHiddenFormSubmissionEnabled(),false);
	}

	@Override
	public boolean getMarketoHiddenFormSubmissionEnabled() {
		return marketoHiddenFormSubmissionsEnabled;
	}

	@Override
	public String getMarketoHost() {
		return marketoHostname;
	}

	@Override
	public String getMarketoClientId() {
		return marketoClientId;
	}

	@Override
	public String getMarketoClientSecret() {
		return marketoSecretId;
	}

	@Override
	public String getMarketoAuthenticationAPIEndpoint() {
		return marketoAuthEndpoint;
	}

	@Override
	public String getMarketoFormSubmissionAPIEndpoint() {
		return marketoFormSubmissionEndpoint;
	}

	@Override
	public String getMarketoFormDescriptionAPIEndpoint() {
		return marketoFormDescriptionEndpoint;
	}

	@Override
	public String getMarketoFormFieldsAPIEndpoint() {
		return marketoFormFieldsEndpoint;
	}
}
