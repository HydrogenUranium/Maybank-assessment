package com.positive.dhl.core.components;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
import com.day.commons.datasource.poolservice.DataSourcePool;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.positive.dhl.core.helpers.DatabaseHelpers;
import org.apache.commons.io.IOUtils;
import org.apache.felix.scr.annotations.Property;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.*;

@Designate(ocd=EtlSync.Config.class)
@Component(service=Runnable.class)
@Property(name="scheduler.runOn", value="LEADER")
public class EtlSync implements Runnable {
    private final Logger log = LoggerFactory.getLogger(getClass());

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
        log.debug("EtlSync is now running, etlAddress='{}'", etlAddress);

        if (!etlSyncEnabled) {
            return;
        }

        List<Integer> ids = new ArrayList<>();
        HashMap<String, ArrayList<HashMap<String, String>>> allRecords = new HashMap<>();
        String sql = "SELECT `id`, `country`, `countrycode`, `currency`, `company`, `firstname`, `lastname`, `email`, `phone`, `address`, `postcode`, `city`, `lo` FROM `shipnow_registrations` WHERE (synced = 0)";

        if (dataSourcePool != null) {
            try {
                DataSource dataSource = (DataSource)dataSourcePool.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);

                try (Connection connection = dataSource.getConnection()) {
                    try (Statement statement = connection.createStatement()) {
                        try (ResultSet results = statement.executeQuery(sql)) {
                            while (results.next()) {
                                ids.add(results.getInt("id"));

                                String countryCode = results.getString("countrycode");
                                HashMap<String, String> record = new HashMap<>();

                                record.put("country", results.getString("country"));
                                record.put("currency", results.getString("currency"));

                                record.put("id", "DISCOVERDHL_APAC_" + results.getInt("id"));
                                record.put("company", results.getString("company"));
                                record.put("firstname", results.getString("firstname"));
                                record.put("lastname", results.getString("lastname"));
                                record.put("email", results.getString("email"));

                                record.put("phone", results.getString("phone"));
                                record.put("address", results.getString("address"));
                                record.put("postcode", results.getString("postcode"));
                                record.put("city", results.getString("city"));

                                String lo = results.getString("lo");
                                if ((lo == null) || (lo.trim().length() == 0)) {
                                    lo = "E-commerce";
                                }
                                record.put("lo", lo);

                                if (!allRecords.containsKey(countryCode)) {
                                    allRecords.put(countryCode, new ArrayList<>());
                                }

                                allRecords.get(countryCode).add(record);
                            }
                        }
                    }
                }

            } catch (DataSourceNotFoundException | SQLException ex) {
                log.error("An error occurred attempting initial query", ex);
            }
        }

        boolean result = false;
        for (Map.Entry<String, ArrayList<HashMap<String, String>>> entry : allRecords.entrySet()) {
            String code = entry.getKey();
            String dat = this.prepareDatFor(code, entry.getValue());
            if (dat.length() > 0) {
                log.info("DAT file has content, send to ETL (country code: '" + code + "')");
                try {
                    result = this.executeSync(code, dat);
                } catch (Exception ex) {
                    log.error("An error occurred attempting executeSync for '" + code + "'", ex);
                }
            }
        }

        if (result && (dataSourcePool != null) && (!ids.isEmpty())) {
            try {
                DataSource dataSource = (DataSource) dataSourcePool.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);

                // set 'synced' on the records
                try (Connection connection = dataSource.getConnection()) {
                    StringBuilder builder = new StringBuilder();
                    for (int i = 0; i < ids.size(); i++) {
                        builder.append("?,");
                    }
                    String placeholders = builder.deleteCharAt( builder.length() -1 ).toString();
                    String statement = "UPDATE `shipnow_registrations` set `synced` = 1 where `id` in (" + placeholders + ")";
                    try (PreparedStatement updateStatement = connection.prepareStatement(statement)) {
                        int i = 1;
                        for (int id: ids) {
                            updateStatement.setInt(i++, id);
                        }

                        updateStatement.executeUpdate();
                    }
                }

            } catch (DataSourceNotFoundException | SQLException ex) {
                log.error("An error occurred attempting initial query", ex);
            }
        }
    }

    /**
     *
     * @param code
     * @param records
     * @return
     */
    private String prepareDatFor(String code, ArrayList<HashMap<String, String>> records) {
        StringBuilder dat = new StringBuilder();

        for (HashMap<String, String> record: records) {
            String country = record.get("country");
            String currency = record.get("currency");
            String id = record.get("id");
            String company = record.get("company");
            String firstname = record.get("firstname");
            String lastname = record.get("lastname");
            String email = record.get("email");
            String phone = record.get("phone");
            String address = record.get("address");
            String postcode = record.get("postcode");
            String city = record.get("city");
            String lo = record.get("lo");

            // there are 185 fields in the 'dat' file, pipe-delimited
            String[] fields = new String[185];
            Arrays.fill(fields, "");
            fields[0] = id;
            fields[1] = company;
            fields[3] = "For Qualification";
            fields[4] = "Main";
            fields[5] = address;
            fields[13] = city;
            fields[16] = postcode;
            fields[17] = country;
            fields[18] = phone;
            fields[75] = "Campaign";
            fields[76] = lo;
            fields[78] = "WEB – Discover";
            fields[79] = "High";
            fields[80] = "Liveball";
            fields[92] = currency;
            fields[93] = id;
            fields[94] = lastname;
            fields[95] = "Main";
            fields[96] = firstname;
            fields[98] = phone;
            fields[100] = email;
            fields[102] = "Phone";
            fields[104] = "N";
            fields[108] = "N";
            fields[112] = ("Lead form info: Customer (" + firstname + " " + lastname + ").  Please validate if customer details are up to date as customer provide the following: " + firstname + " " + lastname + ", " + address + ", " + postcode + ", " + city + ", " + country + ", , ");
            fields[136] = ("discover.dhl.com Open Account - ");
            fields[137] = (id + " - - ");
            fields[153] = ("Export - Mixed");
            fields[183] = ("Lead originating from discover.dhl.com site");

            dat.append(String.join("|", fields)).append("\n");
        }

        return dat.toString();
    }

    /**
     *
     * @param countryCode
     * @param datFileContents
     * @return
     * @throws Exception
     */
    private boolean executeSync(String countryCode, String datFileContents) {
        String address = etlAddress;
        int port = Integer.parseInt(etlPort);
        String username = etlUsername;
        String remotePath = etlRemotePath;
        String sshkey = etlSshKey;

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Date now = new Date();
        String remoteFile = "discover_" + countryCode + "_" + sdf.format(now) + ".dat";

        try {
            JSch jsch = new JSch();
            jsch.addIdentity("", sshkey.getBytes(StandardCharsets.UTF_8), null, null);

            com.jcraft.jsch.Session session = jsch.getSession(username, address, port);
            java.util.Properties config = new java.util.Properties();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.connect();

            ChannelSftp channel = (ChannelSftp)session.openChannel("sftp");

            channel.connect();
            try (InputStream stream = IOUtils.toInputStream(datFileContents, StandardCharsets.UTF_8)) {
                channel.put(stream, remotePath + remoteFile);
            }
            channel.exit();

            return true;

        } catch (Exception ex) {
            log.error("ETL Sync Scheduler sync produced an error attempting to connect/sync to etl.", ex);
        }

        return false;
    }
}
