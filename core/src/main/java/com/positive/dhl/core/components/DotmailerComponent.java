package com.positive.dhl.core.components;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

import com.positive.dhl.core.exceptions.DotmailerFailureException;
import org.apache.http.HttpHost;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.metatype.annotations.Designate;
import org.scribe.services.Base64Encoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 */
@Component(service = DotmailerComponent.class,configurationPolicy=ConfigurationPolicy.OPTIONAL)
@Designate(ocd = DotmailerComponentConfig.class)
public class DotmailerComponent {
	private final Logger log = LoggerFactory.getLogger(getClass());

	private DotmailerComponentConfig config;

    /**
	 * 
	 */
	@Activate
	public void activate(DotmailerComponentConfig config) {
		this.config = config;
	}
	
    /**
	 * 
	 */
	public boolean ExecuteWelcome(String firstname, String username) throws IOException {
		String campaignId = this.config.CampaignID_Welcome();
		StringEntity params = new StringEntity("{ toAddresses: [\"" + username + "\"], campaignId: \"" + campaignId + "\", personalizationValues: [{ Name: \"FIRSTNAME\", Value: \"" + firstname + "\" }] }");
		
		return submit(params);
	}
	
    /**
	 * 
	 */
	public boolean ExecuteShipNowWelcome(String firstname, String username) throws IOException {
		String campaignId = this.config.CampaignID_ShipnowWelcome();
		StringEntity params = new StringEntity("{ toAddresses: [\"" + username + "\"], campaignId: \"" + campaignId + "\", personalizationValues: [{ Name: \"FIRSTNAME\", Value: \"" + firstname + "\" }] }");
		
		return submit(params);
	}

    /**
	 * 
	 */
	public boolean ExecutePasswordReset(String path, String firstname, String username, String token) throws IOException {
		String campaignId = this.config.CampaignID_ResetPwd();
		StringEntity params = new StringEntity("{ toAddresses: [\"" + username + "\"], campaignId: \"" + campaignId + "\", personalizationValues: [{ Name: \"FIRSTNAME\", Value: \"" + firstname + "\" }, { Name: \"RESET_USERNAME\", Value: \"" + username + "\" }, { Name: \"RESET_TOKEN\", Value: \"" + token + "\" }] }");
		
		return submit(params);
	}
	
    /**
	 * 
	 */
	public boolean ExecutePasswordResetConfirm(String firstname, String username) throws IOException {
		String campaignId = this.config.CampaignID_ResetPwdConfirm();
		StringEntity params = new StringEntity("{ toAddresses: [\"" + username + "\"], campaignId: \"" + campaignId + "\", personalizationValues: [{ Name: \"FIRSTNAME\", Value: \"" + firstname + "\" }] }");
		
		return submit(params);
	}
	
    /**
	 * 
	 */
	public boolean ExecuteDeleteAccount(String firstname, String username) throws IOException {
		String campaignId = this.config.CampaignID_AccountDeleted();
		StringEntity params = new StringEntity("{ toAddresses: [\"" + username + "\"], campaignId: \"" + campaignId + "\", personalizationValues: [{ Name: \"FIRSTNAME\", Value: \"" + firstname + "\" }] }");
		
		return submit(params);
	}
	
    /**
	 * 
	 */
	private boolean submit(StringEntity params) {
        HttpHost target = new HttpHost("r1-api.dotmailer.com", 443, "https");
        HttpPost request = new HttpPost("/v2/email/triggered-campaign");

        String apiUsername = this.config.APIUsername();
        String apiPassword = this.config.APIPwd();

		String auth = Base64Encoder.getInstance().encode(apiUsername.concat(":").concat(apiPassword).getBytes(StandardCharsets.US_ASCII));
		request.addHeader("content-type", "application/json");
		request.addHeader("Authorization", "Basic " + auth);
		request.setEntity(params);

		StringBuilder responseText = new StringBuilder();
		try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
			CloseableHttpResponse response = httpClient.execute(target, request);
			BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));

			String output;
			while ((output = br.readLine()) != null) {
				responseText.append(output);
			}

			if ((responseText.toString().trim().length() > 0) || (response.getStatusLine().getStatusCode() != 200)) {
				throw new DotmailerFailureException(responseText.toString());
			}

			return true;

		} catch (IOException | DotmailerFailureException ex) {
			log.error("An error occurred attempting dotmailer send", ex);
		}
		 
		return false;
	}
}