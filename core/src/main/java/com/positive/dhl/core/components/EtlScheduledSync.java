package com.positive.dhl.core.components;

import java.io.File;
import java.io.FileWriter;
import java.net.URL;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.jcr.RepositoryException;
import javax.sql.DataSource;

import com.day.commons.datasource.poolservice.DataSourceNotFoundException;
import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.helpers.DatabaseHelpers;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jcraft.jsch.*;

import com.positive.dhl.core.shipnow.servlets.ShipNowServlet;

@SuppressWarnings("all")
@Component(immediate = true, service = EtlScheduledSync.class)
@Designate(ocd = EtlScheduledSyncConfig.class)
public class EtlScheduledSync implements Runnable {
	
	/**
	 * Logger
	 */
	private static final Logger log = LoggerFactory.getLogger(EtlScheduledSync.class);

	
	/**
	 * Id of the scheduler based on its name
	 */
	private int schedulerId;
	
	/**
	 *
	 */
	private EtlScheduledSyncConfig config;
	
	/**
	 * Scheduler instance injected
	 */
	@Reference
	private Scheduler scheduler;

    /**
	 * 
	 */
	@Reference
	private DataSourcePool dataSourcePool;
	
	/**
	 * Activate method to initialize stuff
	 * 
	 * @param config
	 */
	@Activate
	protected void activate(EtlScheduledSyncConfig config) {
		this.config = config;
		
		/**
		 * Getting the scheduler id
		 */
		schedulerId = config.EtlSyncScheduleName().hashCode();
		
		/**
		 * Again adding the scheduler
		 */
		addScheduler(config);
	}

	
	/**
	 * Modifies the scheduler id on modification
	 * 
	 * @param config
	 */
	@Modified
	protected void modified(EtlScheduledSyncConfig config) {
		this.config = config;
		
		/**
		 * Removing the scheduler
		 */
		removeScheduler();
		
		/**
		 * Updating the scheduler id
		 */
		schedulerId = config.EtlSyncScheduleName().hashCode();
		
		/**
		 * Again adding the scheduler
		 */
		addScheduler(config);
	}

	
	/**
	 * This method deactivates the scheduler and removes it
	 * @param config
	 */
	@Deactivate
	protected void deactivate(EtlScheduledSyncConfig config) {
		this.config = config;
		
		/**
		 * Removing the scheduler
		 */
		removeScheduler();
	}
	
	/**
	 * This method removes the scheduler
	 */
	private void removeScheduler() {
		
		log.info("Removing scheduler: {}", schedulerId);
		
		/**
		 * Unscheduling/removing the scheduler
		 */
		scheduler.unschedule(String.valueOf(schedulerId));
	}
	
	/**
	 * This method adds the scheduler
	 * 
	 * @param config
	 */
	private void addScheduler(EtlScheduledSyncConfig config) {
		if (config == null) {
			log.info("config is null - return");
			return;
		}
		
		/**
		 * Check if the scheduler is enabled
		 */
		if (config.EtlSyncEnabled()) {
			String expr = config.EtlSyncSchedule();
			log.info("Set up " + config.EtlSyncScheduleName() + " based on; " + expr);
			
			/**
			 * Scheduler option takes the cron expression as a parameter and run accordingly
			 */
			ScheduleOptions scheduleOptions = scheduler.EXPR(expr);
			
			/**
			 * Adding some parameters
			 */
			scheduleOptions.name(config.EtlSyncScheduleName());
			scheduleOptions.canRunConcurrently(false);
			
			/**
			 * Scheduling the job
			 */
			scheduler.schedule(this, scheduleOptions);
			
			log.info("Scheduler " + config.EtlSyncScheduleName() + " added");
			
		} else {
			log.info("Scheduler " + config.EtlSyncScheduleName() + " is disabled");
		}
	}

	/**
	 * Overridden run method to execute Job
	 */
	public void run() {
		if (config == null) {
			log.info("config is null - return");
			return;
		}

		/**
		 * Check if the scheduler is enabled
		 */
		if (!config.EtlSyncEnabled()) {
			return;
		}

		BundleContext context = FrameworkUtil.getBundle(ShipNowServlet.class).getBundleContext();
		if (context == null) {
			log.error("Scheduler" + config.EtlSyncScheduleName() + " has no valid context. Cannot continue.");
			return;
		}

		log.info("Executing " + config.EtlSyncScheduleName());

		String ids = "";
		HashMap<String, ArrayList<HashMap<String, String>>> allRecords = new HashMap<>();
		String sql = "SELECT `id`, `country`, `countrycode`, `currency`, `company`, `firstname`, `lastname`, `email`, `phone`, `address`, `postcode`, `city`, `lo` FROM `shipnow_registrations` WHERE (synced = 0)";

		if (dataSourcePool != null) {
			try {
				DataSource dataSource = (DataSource)dataSourcePool.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);

				try (Connection connection = dataSource.getConnection()) {
					try (Statement statement = connection.createStatement()) {
						try (ResultSet results = statement.executeQuery(sql)) {
							while (results.next()) {
								if (ids != "") {
									ids += ",";
								}
								ids += results.getInt("id");

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
			if (dat != null && dat.length() > 0) {
				log.info("DAT file has content, send to ETL (country code: '" + code + "')");
				try {
					result = this.executeSync(context, code, dat);
				} catch (Exception ex) {
					log.error("An error occurred attempting executeSync for '" + code + "'", ex);
				}
			}
		}

		if ((result == true) && (dataSourcePool != null) && (ids.length() > 0)) {
			try {
				DataSource dataSource = (DataSource) dataSourcePool.getDataSource(DatabaseHelpers.DATA_SOURCE_NAME);

				// set 'synced' on the records
				try (Connection connection = dataSource.getConnection()) {
					try (final Statement updateStatement = connection.createStatement()) {
						updateStatement.executeUpdate("UPDATE `shipnow_registrations` set `synced` = 1 where `id` in (" + ids + ")");
					}
				}

			} catch (DataSourceNotFoundException | SQLException ex) {
				log.error("An error occurred attempting initial query", ex);
			}
		}
	}
	
	/**
	 *
	 * @param countryCode
	 * @param searchResult
	 * @return
	 * @throws RepositoryException 
	 */
	private String prepareDatFor(String code, ArrayList<HashMap<String, String>> records) {
		String dat = "";

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

			dat += String.join("|", fields) + "\n";
		}
		
		return dat;
	}
	
	/**
	 * 
	 * @param context
	 * @param countryCode
	 * @param datFileContents
	 * @return
	 * @throws Exception
	 */
	private boolean executeSync(BundleContext context, String countryCode, String datFileContents) throws Exception {
		String address = this.config.EtlAddress();
		String username = this.config.EtlUsername();
		String remotePath = this.config.EtlRemotePath();
		String sshkey = this.config.EtlSshKey();

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Date now = new Date();
		String remoteFile = "discover_" + countryCode + "_" + sdf.format(now) + ".dat";

		try {
			URL sshKeyUrl = writeFile(context, "id_rsa", sshkey);
			URL dataFileUrl = writeFile(context, "data", datFileContents);
			
            JSch jsch = new JSch();
            jsch.addIdentity(sshKeyUrl.getPath());
            
            com.jcraft.jsch.Session session = jsch.getSession(username, address, 22);
            java.util.Properties config = new java.util.Properties(); 
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.connect();
            
            ChannelSftp channel = (ChannelSftp)session.openChannel("sftp");
            
            channel.connect();
            channel.put(dataFileUrl.getPath(), remotePath + remoteFile);
            channel.exit();
		    
		    return true;
		    
		} catch (Exception ex) {
			log.error("Scheduler" + config.EtlSyncScheduleName() + " sync produced an error attempting to connect/sync to etl.", ex);
		}
		
		return false;
	}
	
	/**
	 * 
	 * @param context
	 * @param filename
	 * @param content
	 * @return
	 */
	private URL writeFile(BundleContext context, String filename, String content) throws Exception {
		URL file = context.getDataFile(filename).toURL();
		if (file != null) {
			// check if file exists and delete if so
			File check = new File(file.getPath());
			if (check.exists()) {
				check.delete();
			}
			
			FileWriter writer = new FileWriter(file.getPath());
			writer.write(content);
			writer.close();
			
			return file;
		}
		
		throw new Exception("File with name '" + filename + "' couldn't be set up");
	}
}
