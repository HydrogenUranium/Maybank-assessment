package com.positive.dhl.core.models;

import com.positive.dhl.core.components.DotmailerComponent;
import com.positive.dhl.core.exceptions.DiscoverUserExistsException;
import com.positive.dhl.core.exceptions.DiscoverUserNotFoundException;

import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.*;
import java.util.Calendar;
import java.util.Date;

/**
 * 
 */
public class UserAccount {

	private static final String FIRST_NAME = "firstname";
	private static final String LAST_NAME = "lastname";
	private static final String COULD_NOT_BE_FOUND = "' could not be found.";
	
	private static final int TTL = 60;
    private static final SecureRandom random = new SecureRandom();
    
    private boolean authenticated;
	private String username;
	private String name;
	private String surname;
	private String token;
	private String refreshToken;
	private int timeToLive;
	private Boolean fullAccount;

	public boolean isAuthenticated() {
		return authenticated;
	}

	public void setAuthenticated(boolean authenticated) {
		this.authenticated = authenticated;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public int getTimeToLive() {
		return timeToLive;
	}

	public void setTimeToLive(int timeToLive) {
		this.timeToLive = timeToLive;
	}

	public Boolean getFullAccount() {
		return fullAccount;
	}

	public void setFullAccount(Boolean fullAccount) {
		this.fullAccount = fullAccount;
	}

	/**
	 * 
	 */
	public static String generateToken() {
		return new BigInteger(130, random).toString(32);
	}

	/**
	 * 
	 */
    private static byte[] getSalt() throws NoSuchAlgorithmException
    {
        SecureRandom sr = SecureRandom.getInstance("SHA1PRNG");
        byte[] salt = new byte[16];
        sr.nextBytes(salt);
        return salt;
    }

	/**
	 * 
	 */
	public static String hashPassword(String password, byte[] salt) throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance("SHA-512");
        md.update(salt);
        byte[] bytes = md.digest(password.getBytes());
        StringBuilder sb = new StringBuilder();
		for (byte aByte : bytes) {
			sb.append(Integer.toString((aByte & 0xff) + 0x100, 16).substring(1));
		}
        
        return sb.toString();
	}

	/**
	 * 
	 */
	public static boolean checkPassword(String currentHash, String salt, String password) throws NoSuchAlgorithmException {
		byte[] saltBytes = DatatypeConverter.parseBase64Binary(salt);
		String check = hashPassword(password, saltBytes);
		return (check.equals(currentHash));
	}

	/**
	 * 
	 */
	private static UserAccount saveWithNewTokens(Connection connection, UserAccount user) throws SQLException, DiscoverUserNotFoundException {
		String token = generateToken();
		String refreshToken = generateToken();

		Calendar expiry = Calendar.getInstance();
		expiry.add(Calendar.SECOND, TTL);
		
		//save
		int id = findByUsername(connection, user.username);
		if (id == 0) {
			throw new DiscoverUserNotFoundException("User not found by " + user.username);
		}
		
		try (final PreparedStatement updateStatement = connection.prepareStatement("UPDATE shipnow_registrations SET `token` = ?, `refresh_token` = ?, `ttl` = ? where (`id` = ?)")) {
			updateStatement.setString(1, token);
			updateStatement.setString(2, refreshToken);
			updateStatement.setTimestamp(3, new Timestamp(expiry.getTimeInMillis()));
			updateStatement.setInt(4, id);
			updateStatement.executeUpdate();
		}

		boolean fullAccount = false;
		try (final PreparedStatement selectStatement = connection.prepareStatement("SELECT `full` from shipnow_registrations where (`id` = ?)")) {
			selectStatement.setInt(1, id);
			
			try (final ResultSet results = selectStatement.executeQuery()) {
				while (results.next()) {
					fullAccount = (results.getInt("full") == 1);
				}
			}
		}
		
		user.token = token;
		user.refreshToken = refreshToken;
		user.timeToLive = TTL;
		user.fullAccount = fullAccount;
		
		return user;
	}

	/**
	 * 
	 */
	private static int findByUsername(Connection connection, String username) throws SQLException {
		int id = 0;
		
		try (final PreparedStatement statement = connection.prepareStatement("SELECT `id` from shipnow_registrations where `username` = ?")) {
			statement.setString(1, username);
	
			try (final ResultSet results = statement.executeQuery()) {
				while (results.next()) {
					id = results.getInt("id");
				}
			}
		}

		return id;
	}

	/**
	 * 
	 */
	public static UserAccount authenticate(Connection connection, String username, String password) throws SQLException, NoSuchAlgorithmException, DiscoverUserNotFoundException {
		UserAccount user = new UserAccount(username);

		//authenticate here
		boolean authenticated = false;
		int id = findByUsername(connection, username);
		if (id == 0) {
			return null;
			
		} else {
			String currentHash = "";
			String salt = "";
			String firstname = "";
			
			try (final PreparedStatement statement = connection.prepareStatement("SELECT `password`, `salt`, `firstname` FROM shipnow_registrations WHERE (`id` = ?)")) {
				statement.setInt(1, id);
				
				try (final ResultSet results = statement.executeQuery()) {
					while (results.next()) {
						currentHash = results.getString("password");
						salt = results.getString("salt");
						firstname = results.getString(FIRST_NAME);
					}
				}
			}
			
			if (checkPassword(currentHash, salt, password)) {
				authenticated = true;
			}
			
			if (authenticated) {
				user = saveWithNewTokens(connection, user);
				user.authenticated = true;
				user.name = firstname;
			}
		}
		
		return user;
	}

	/**
	 * 
	 */
	public static UserAccount tokenValidate(Connection connection, String username, String token) throws SQLException, DiscoverUserNotFoundException {
		UserAccount user = new UserAccount(username);

		//validate token here
		boolean tokenValid = false;
		int id = findByUsername(connection, username);
		if (id != 0) {
			String firstname = "";
			String lastname = "";
			
			try (final PreparedStatement statement = connection.prepareStatement("SELECT `token`, `ttl`, `firstname`, `lastname` FROM shipnow_registrations WHERE (`id` = ?)")) {
				statement.setInt(1, id);
	
				try (final ResultSet results = statement.executeQuery()) {
					while (results.next()) {
						if (results.getString("token").equals(token)) {
							firstname = results.getString(FIRST_NAME);
							lastname = results.getString(LAST_NAME);
		
							Timestamp tokenExpiry = results.getTimestamp("ttl");
							tokenValid = tokenExpiry.after(new Date());
						}
					}
				}
			}
			
			if (tokenValid) {
				user = saveWithNewTokens(connection, user);
				user.authenticated = true;
				user.name = firstname;
				user.surname = lastname;
			}
		}
		

		return user;
	}

	/**
	 * 
	 */
	public static UserAccount refreshToken(Connection connection, String username, String refreshToken) throws SQLException, DiscoverUserNotFoundException {
		UserAccount user = new UserAccount(username);

		//refresh token here
		boolean tokenValid = false;
		int id = findByUsername(connection, username);
		if (id != 0) {
			String firstname = "";
			String lastname = "";
			
			try (final PreparedStatement statement = connection.prepareStatement("SELECT `refresh_token`, `firstname`, `lastname` FROM shipnow_registrations WHERE (`id` = ?)")) {
				statement.setInt(1, id);
	
				try (final ResultSet results = statement.executeQuery()) {
					while (results.next()) {
						if (results.getString("refresh_token").equals(refreshToken)) {
							tokenValid = true;
							
							firstname = results.getString(FIRST_NAME);
							lastname = results.getString(LAST_NAME);
						}
					}
				}
			}
			
			if (tokenValid) {
				user = saveWithNewTokens(connection, user);
				user.authenticated = true;
				user.name = firstname;
				user.surname = lastname;
			}
		}
		
		return user;
	}

	/**
	 * 
	 */
	public static UserAccount Register(Connection connection, Registration registration) throws SQLException, NoSuchAlgorithmException, DiscoverUserExistsException, DiscoverUserNotFoundException {
		//save user details
		int id = findByUsername(connection, registration.getEmail());
		if (id != 0) {
			int full = 0;
			
			try (final PreparedStatement statement = connection.prepareStatement("SELECT `full` FROM shipnow_registrations WHERE (`id` = ?)")) {
				statement.setInt(1, id);
				
				try (final ResultSet results = statement.executeQuery()) {
					while (results.next()) {
						full = results.getInt("full");
					}
				}
				
				if (full == 1) {
					throw new DiscoverUserExistsException("User with email address '" + registration.getEmail() + "' already exists");
				}
			}
			
			try (final PreparedStatement updateStatement = connection.prepareStatement("UPDATE shipnow_registrations SET `username` = ?, `firstname` = ?, `lastname` = ?, `password` = ?, `salt` = ?, `islinkedin` = ?, `position` = ?, `contact` = ?, `size` = ?, `sector` = ?, `full` = ?, `tcagree` = ? WHERE (`id` = ?)")) {
				updateStatement.setString(1, registration.getEmail());
				updateStatement.setString(2, registration.getFirstname());
				updateStatement.setString(3, registration.getLastname());
				updateStatement.setString(4, registration.getPosition());
				updateStatement.setString(5, registration.getContactNumber());
				updateStatement.setString(6, registration.getBusinessSize());
				updateStatement.setString(7, registration.getBusinessSector());
				updateStatement.setInt(8, 1);
				updateStatement.setInt(9, (registration.isTcAgree() ? 1 : 0));
				updateStatement.setInt(10, id);
				updateStatement.executeUpdate();
			}
			
			return authenticate(connection, registration.getEmail(), registration.getPassword());
		}
		
		try (final PreparedStatement insertStatement = connection.prepareStatement("INSERT INTO shipnow_registrations (`firstname`, `lastname`, `username`, `password`, `salt`, `sector`, `size`, `position`, `contact`, `islinkedin`, `full`, `tcagree`, `interest_categories`, `datecreated`, `token`, `refresh_token`) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?, ?)")) {
			insertStatement.setString(1, registration.getFirstname());
			insertStatement.setString(2, registration.getLastname());
			insertStatement.setString(3, registration.getEmail());
	
			byte[] salt = getSalt();
			insertStatement.setString(4, hashPassword(registration.getPassword(), salt));
			insertStatement.setString(5, DatatypeConverter.printBase64Binary(salt));
	
			insertStatement.setString(6, (registration.getBusinessSector() == null) ? "" : registration.getBusinessSector());
			insertStatement.setString(7, (registration.getBusinessSize() == null) ? "" : registration.getBusinessSize());
			insertStatement.setString(8, (registration.getPosition() == null) ? "" : registration.getPosition());
			insertStatement.setString(9, (registration.getContactNumber() == null) ? "" : registration.getContactNumber());
	
			insertStatement.setInt(10, (registration.isIslinkedin() ? 1 : 0));
			insertStatement.setInt(11, 1);
			insertStatement.setInt(12, (registration.isTcAgree() ? 1 : 0));
	
			insertStatement.setString(13, "");
			insertStatement.setString(14, "");
			insertStatement.setString(15, "");
			insertStatement.executeUpdate();
		}
		
		return authenticate(connection, registration.getEmail(), registration.getPassword());
	}

	/**
	 * 
	 */
	public static Registration getAllDetails(Connection connection, String username) throws SQLException {
		Registration registration = new Registration();

		int id = findByUsername(connection, username);
		if (id != 0) {
			try (final PreparedStatement statement = connection.prepareStatement("SELECT `firstname`, `lastname`, `username`, `password`, `salt`, `sector`, `size`, `position`, `contact`, `interest_categories`, `islinkedin`, `full`, `tcagree` FROM shipnow_registrations WHERE (`id` = ?)")) {
				statement.setInt(1, id);
				
				try (final ResultSet results = statement.executeQuery()) {
					while (results.next()) {
						registration.setFirstname(results.getString(FIRST_NAME));
						registration.setLastname(results.getString(LAST_NAME));
						registration.setEmail(results.getString("username"));
						registration.setPassword(results.getString("password"));
						registration.setSalt(results.getString("salt"));
						
						registration.setBusinessSector(results.getString("sector"));
						registration.setBusinessSize(results.getString("size"));
						registration.setPosition(results.getString("position"));
						registration.setContactNumber(results.getString("contact"));
						
						registration.setInterest_categories(results.getString("interest_categories"));
						
						registration.setIslinkedin(results.getInt("islinkedin") == 1);
						registration.setFullAccount(results.getInt("full") == 1);
						registration.setTcAgree(results.getInt("tcagree") == 1);
					}
				}
			}
		}
		
		return registration;
	}

	/**
	 * 
	 */
	public static boolean updateDetails(Connection connection, Registration registration) throws SQLException, NoSuchAlgorithmException, DiscoverUserNotFoundException {
		int id = findByUsername(connection, registration.getEmail());
		if (id == 0) {
			throw new DiscoverUserNotFoundException("The user with username '" + registration.getEmail() + COULD_NOT_BE_FOUND);
		}

		if (registration.getNewpassword() != null && registration.getNewpassword().length() > 0) {
			byte[] salt = getSalt();

			try (final PreparedStatement updateStatement = connection.prepareStatement("UPDATE shipnow_registrations SET `username` = ?, `firstname` = ?, `lastname` = ?, `password` = ?, `salt` = ?, `islinkedin` = ?, `position` = ?, `contact` = ?, `size` = ?, `sector` = ?, `tcagree` = ?, `interest_categories` = ? WHERE (`id` = ?)")) {
				updateStatement.setString(1, registration.getNewemail());
				updateStatement.setString(2, registration.getFirstname());
				updateStatement.setString(3, registration.getLastname());
				updateStatement.setString(4, hashPassword(registration.getNewpassword(), salt));
				updateStatement.setString(5, DatatypeConverter.printBase64Binary(salt));
				updateStatement.setInt(6, 0);
				updateStatement.setString(7, registration.getPosition());
				updateStatement.setString(8, registration.getContactNumber());
				updateStatement.setString(9, registration.getBusinessSize());
				updateStatement.setString(10, registration.getBusinessSector());
				updateStatement.setInt(11, (registration.isTcAgree() ? 1 : 0));
				updateStatement.setString(12, registration.getInterest_categories());
				updateStatement.setInt(13, id);
				updateStatement.executeUpdate();
			}
			
		} else {
			try (final PreparedStatement updateStatement = connection.prepareStatement("UPDATE shipnow_registrations SET `username` = ?, `firstname` = ?, `lastname` = ?, `position` = ?, `contact` = ?, `size` = ?, `sector` = ?, `tcagree` = ?, `interest_categories` = ? WHERE (`id` = ?)")) {
				updateStatement.setString(1, registration.getNewemail());
				updateStatement.setString(2, registration.getFirstname());
				updateStatement.setString(3, registration.getLastname());
				updateStatement.setString(4, registration.getPosition());
				updateStatement.setString(5, registration.getContactNumber());
				updateStatement.setString(6, registration.getBusinessSize());
				updateStatement.setString(7, registration.getBusinessSector());
				updateStatement.setInt(8, (registration.isTcAgree() ? 1 : 0));
				updateStatement.setString(9, registration.getInterest_categories());
				updateStatement.setInt(10, id);
				updateStatement.executeUpdate();
			}
		}
		
		return true;
	}

	/**
	 * 
	 */
	public static boolean updateCategories(Connection connection, String username, String categories) throws SQLException, DiscoverUserNotFoundException {
		int id = findByUsername(connection, username);
		if (id == 0) {
			throw new DiscoverUserNotFoundException("The user with username '" + username + COULD_NOT_BE_FOUND);
		}

		try (final PreparedStatement updateStatement = connection.prepareStatement("UPDATE shipnow_registrations SET `interest_categories` = ? WHERE (`id` = ?)")) {
			updateStatement.setString(1, categories);
			updateStatement.setInt(2, id);
			updateStatement.executeUpdate();
		}
		
		return true;
	}

	/**
	 * 
	 */
	public static boolean accountExists(Connection connection, String username) throws SQLException {
		int id = findByUsername(connection, username);
		if (id != 0) {
			int full = 0;
			try (final PreparedStatement statement = connection.prepareStatement("SELECT `full` FROM shipnow_registrations WHERE (`id` = ?)")) {
				statement.setInt(1, id);
				
				try (final ResultSet results = statement.executeQuery()) {
					while (results.next()) {
						full = results.getInt("full");
					}
				}
			}
			
			return (full == 1);
		}
		
		return false;
	}

	/**
	 * 
	 */
	public static boolean setPassword(Connection connection, String username, String password) throws SQLException, NoSuchAlgorithmException {
		int id = findByUsername(connection, username);
		if (id == 0) {
			return false;
		}

		byte[] salt = getSalt();
		try (final PreparedStatement updateStatement = connection.prepareStatement("UPDATE shipnow_registrations SET `password` = ?, `salt` = ?, `islinkedin` = ?, `full` = ?, `password_reset_token` = ? WHERE (`id` = ?)")) {
			updateStatement.setString(1, hashPassword(password, salt));
			updateStatement.setString(2, DatatypeConverter.printBase64Binary(salt));
			updateStatement.setInt(3, 0);
			updateStatement.setInt(4, 1);
			updateStatement.setString(5, "");
			updateStatement.setInt(6, id);
			updateStatement.executeUpdate();
		}
		
		return true;
	}

	/**
	 * 
	 */
	public static boolean requestPassword(Connection connection, DotmailerComponent dotmailerComponent, String page, String username) throws SQLException, IOException {
		int id = findByUsername(connection, username);
		if (id == 0) {
			return false;
		}

		String firstname = "";
		try (final PreparedStatement statement = connection.prepareStatement("SELECT `firstname` FROM shipnow_registrations WHERE (`id` = ?)")) {
			statement.setInt(1, id);
			
			try (final ResultSet results = statement.executeQuery()) {
				while (results.next()) {
					firstname = results.getString(FIRST_NAME);
				}
			}
		}
		
		String passwordResetToken = generateToken();
		try (final PreparedStatement updateStatement = connection.prepareStatement("UPDATE shipnow_registrations SET `password_reset_token` = ? WHERE (`id` = ?)")) {
			updateStatement.setString(1, passwordResetToken);
			updateStatement.setInt(2, id);
			updateStatement.executeUpdate();
		}
		
		return dotmailerComponent.ExecutePasswordReset(page, firstname, username, passwordResetToken);
	}

	/**
	 * 
	 */
	public static boolean resetPassword(Connection connection, DotmailerComponent dotmailerComponent, String username, String token, String password) throws SQLException, IOException, NoSuchAlgorithmException {
		int id = findByUsername(connection, username);
		if (id == 0) {
			return false;
		}
		
		String firstname = "";
		String returnedToken = "";
		
		try (final PreparedStatement statement = connection.prepareStatement("SELECT `firstname`, `password_reset_token` FROM shipnow_registrations WHERE (`id` = ?)")) {
			statement.setInt(1, id);
			
			try (final ResultSet results = statement.executeQuery()) {
				while (results.next()) {
					firstname = results.getString(FIRST_NAME);
					returnedToken = results.getString("password_reset_token");
				}
			}
		}
		
		if (!returnedToken.equals(token)) {
			return false;
		}

		byte[] salt = getSalt();
		try (final PreparedStatement updateStatement = connection.prepareStatement("UPDATE shipnow_registrations SET `password` = ?, `salt` = ?, `islinkedin` = ?, `full` = ?, `password_reset_token` = ? WHERE (`id` = ?)")) {
			updateStatement.setString(1, hashPassword(password, salt));
			updateStatement.setString(2, DatatypeConverter.printBase64Binary(salt));
			updateStatement.setInt(3, 0);
			updateStatement.setInt(4, 1);
			updateStatement.setString(5, "");
			updateStatement.setInt(6, id);
			updateStatement.executeUpdate();
		}
		
		return dotmailerComponent.ExecutePasswordResetConfirm(firstname, username);
	}

	/**
	 * 
	 */
	public static boolean deleteAccount(Connection connection, DotmailerComponent dotmailerComponent, String username) throws SQLException, IOException, DiscoverUserNotFoundException {
		int id = findByUsername(connection, username);
		if (id == 0) {
			throw new DiscoverUserNotFoundException("An account with the email address '" + username + COULD_NOT_BE_FOUND);
		}
		
		String firstname = "";
		
		try (final PreparedStatement statement = connection.prepareStatement("SELECT `firstname` FROM shipnow_registrations WHERE (`id` = ?)")) {
			statement.setInt(1, id);
			
			try (final ResultSet results = statement.executeQuery()) {			
				while (results.next()) {
					firstname = results.getString(FIRST_NAME);
				}
			}
		}

		try (final PreparedStatement deleteStatement = connection.prepareStatement("DELETE FROM shipnow_registrations WHERE (`id` = ?)")) {
			deleteStatement.setInt(1, id);
			deleteStatement.executeUpdate();
		}
		
		return dotmailerComponent.ExecuteDeleteAccount(firstname, username);
	}

	/**
	 * 
	 */
	private UserAccount(String username) {
		this.authenticated = false;
		this.username = username;
		this.name = "";
		this.surname = "";
		this.token = "";
		this.refreshToken = "";
		this.timeToLive = 0;
	}
}