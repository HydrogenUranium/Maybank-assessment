package com.positive.dhl.core.models;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * 
 */
public class CompetitionEntry {
	private String path;
	private ArrayList<String> answers;
	private String firstname;
	private String lastname;
	private String email;
	private String position;
	private String contactNumber;
	private String businessSize;
	private String businessSector;

    /**
	 * 
	 */
	public String getPath() {
		return path;
	}

    /**
	 * 
	 */
	public void setPath(String path) {
		this.path = path;
	}

    /**
	 * 
	 */
	public ArrayList<String> getAnswers() {
		return new ArrayList<String>(answers);
	}

    /**
	 * 
	 */
	public void setAnswers(ArrayList<String> answers) {
		this.answers = new ArrayList<String>(answers);
	}

    /**
	 * 
	 */
	public String getFirstname() {
		return firstname;
	}

    /**
	 * 
	 */
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

    /**
	 * 
	 */
	public String getLastname() {
		return lastname;
	}

    /**
	 * 
	 */
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

    /**
	 * 
	 */
	public String getEmail() {
		return email;
	}

    /**
	 * 
	 */
	public void setEmail(String email) {
		this.email = email;
	}

    /**
	 * 
	 */
	public String getPosition() {
		return position;
	}

    /**
	 * 
	 */
	public void setPosition(String position) {
		this.position = position;
	}

    /**
	 * 
	 */
	public String getContactNumber() {
		return contactNumber;
	}

    /**
	 * 
	 */
	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

    /**
	 * 
	 */
	public String getBusinessSize() {
		return businessSize;
	}

    /**
	 * 
	 */
	public void setBusinessSize(String businessSize) {
		this.businessSize = businessSize;
	}

    /**
	 * 
	 */
	public String getBusinessSector() {
		return businessSector;
	}

    /**
	 * 
	 */
	public void setBusinessSector(String businessSector) {
		this.businessSector = businessSector;
	}

	/**
	 * 
	 */
	public boolean enter(Connection connection) throws SQLException {
		try (final PreparedStatement statement = connection.prepareStatement("INSERT INTO `competitions` (`competitionpath`, `firstname`, `lastname`, `email`, `position`, `contact`, `sector`, `size`, `answer`, `answer2`, `answer3`, `answer4`, `answer5`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")) {
			statement.setString(1, path);
			
			statement.setString(2, firstname);
			statement.setString(3, lastname);
			statement.setString(4, email);
			
			statement.setString(5, position);
			statement.setString(6, contactNumber);
			statement.setString(7, businessSize);
			statement.setString(8, businessSector);
	
			for (int i = 0; i < answers.size(); i++) {
				statement.setString((9 + i), answers.get(i));
			}
	
	    	statement.executeUpdate();
		}
    	
		return true;
	}
}