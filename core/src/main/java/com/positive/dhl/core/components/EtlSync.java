package com.positive.dhl.core.components;

import com.day.commons.datasource.poolservice.DataSourcePool;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Designate(ocd=EtlSync.Config.class)
@Component(service=Runnable.class)
public class EtlSync implements Runnable {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    /**
     *
     */
    @ObjectClassDefinition(name="ETL Sync job", description = "ETL Sync job - test")
    public static @interface Config {
        @AttributeDefinition(name = "Cron-job expression")
        String scheduler_expression() default "0 * * * * ?";

        @AttributeDefinition(name = "Concurrent task", description = "Whether or not to schedule this task concurrently")
        boolean scheduler_concurrent() default false;

        /*
         *
         */
        @AttributeDefinition(name = "ETL Sync Enabled", description = "ETL Sync Enabled", defaultValue = "false", type = AttributeType.BOOLEAN)
        boolean EtlSyncEnabled() default false;

        /*
         *
         */
        @AttributeDefinition(name = "ETL Server IP Address", description = "ETL Server IP Address", defaultValue = "198.141.243.222")
        String EtlAddress();

        /*
         *
         */
        @AttributeDefinition(name = "ETL Server Port", description = "ETL Server IP Address", defaultValue = "22")
        String EtlPort();

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

    /**
     *
     */
    @Reference
    private DataSourcePool dataSourcePool;

    private boolean etlSyncEnabled;
    private String etlAddress;
    private String etlPort;
    private String etlUsername;
    private String etlRemotePath;
    private String etlSshKey;

    /**
     *
     * @param config
     */
    @Activate
    protected void activate(final Config config) {
        etlSyncEnabled = config.EtlSyncEnabled();
        etlAddress = config.EtlAddress();
        etlPort = config.EtlPort();
        etlUsername = config.EtlUsername();
        etlRemotePath = config.EtlRemotePath();
        etlSshKey = config.EtlSshKey();
    }

    /**
     *
     */
    @Override
    public void run() {
        logger.debug("EtlSync is now running, etlAddress='{}'", etlAddress);
    }
}
