package com.positive.dhl.core.components;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

/*
 * 
 */
@ObjectClassDefinition(name = "DHL Dotmailer Component Configuration", description = "DHL Dotmailer implementation configuration")
public @interface DotmailerComponentConfig {

	/*
	 * 
	 */
	@AttributeDefinition(name = "API Username", description = "Dotmailer API Username", defaultValue = "apiuser-c961db801bfc@apiconnector.com")
	String APIUsername();

	/*
	 * 
	 */
	@AttributeDefinition(name = "API Pwd", description = "Dotmailer API Pwd", defaultValue = "", type = AttributeType.PASSWORD)
	String APIPwd();

	/*
	 * 
	 */
	@AttributeDefinition(name = "Bypass DHL Proxy", description = "Bypass DHL Proxy", defaultValue = "false", type = AttributeType.BOOLEAN)
	String BypassProxy();

	/*
	 * 
	 */
	@AttributeDefinition(name = "Default from address", description = "Default 'from' address", defaultValue = "discover@dhl-news.com")
	String DefaultFromAddress();

	/*
	 * 
	 */
	@AttributeDefinition(name = "Campaign ID Welcome", description = "Campaign ID - Welcome email", defaultValue = "484515")
	String CampaignID_Welcome();

	/*
	 * 
	 */
	@AttributeDefinition(name = "Campaign ID Shipnow Welcome", description = "Campaign ID - Shipnow Welcome email", defaultValue = "881571")
	String CampaignID_ShipnowWelcome();

	/*
	 * 
	 */
	@AttributeDefinition(name = "Campaign ID Reset Pwd", description = "Campaign ID - Reset Pwd email", defaultValue = "239982")
	String CampaignID_ResetPwd();

	/*
	 * 
	 */
	@AttributeDefinition(name = "Campaign ID Reset Pwd Confirm", description = "Campaign ID - Reset Pwd Confirm email", defaultValue = "239984")
	String CampaignID_ResetPwdConfirm();
	
	/*
	 * 
	 */
	@AttributeDefinition(name = "Campaign ID Account Deleted", description = "Campaign ID - Account Deleted email", defaultValue = "239979")
	String CampaignID_AccountDeleted();
}