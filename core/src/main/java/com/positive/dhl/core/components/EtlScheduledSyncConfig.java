package com.positive.dhl.core.components;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

/*
 * 
 */
@ObjectClassDefinition(name = "DHL ETL Sheduler Sync Component Configuration", description = "DHL ETL scheduler sync configuration")
public @interface EtlScheduledSyncConfig {

	/*
	 * 
	 */
	@AttributeDefinition(name = "ETL Sync Enabled", description = "ETL Sync Enabled", defaultValue = "false", type = AttributeType.BOOLEAN)
	boolean EtlSyncEnabled() default false;

	/*
	 * 
	 */
	@AttributeDefinition(name = "ETL Sync Schedule Name", description = "ETL Sync Shedule Name", defaultValue = "ETL Sync Scheduled Task")
	String EtlSyncScheduleName();

	/*
	 * 
	 */
	@AttributeDefinition(name = "ETL Sync Schedule", description = "ETL Sync Shedule", defaultValue = "0 0/5 * 1/1 * ? *")
	String EtlSyncSchedule();

	/*
	 * 
	 */
	@AttributeDefinition(name = "ETL Server IP Address", description = "ETL Server IP Address", defaultValue = "198.141.243.222")
	String EtlAddress();

	/*
	 * 
	 */
	@AttributeDefinition(name = "ETL Server Username", description = "ETL Server Username", defaultValue = "sftp_slpt")
	String EtlUsername();

	/*
	 * 
	 */
	@AttributeDefinition(name = "ETL Server Remote Path", description = "ETL Server Remote Path", defaultValue = "/interface/comet_slpt/FTP_IN/DISCOVER/")
	String EtlRemotePath();

	/*
	 * 
	 */
	@AttributeDefinition(name = "ETL SSH Key", description = "ETL SSH Key", defaultValue = "")
	String EtlSshKey();
}