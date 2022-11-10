package com.positive.dhl.core.helpers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Class that contains various 'helper' methods that can be leveraged to validate certain aspects of data, such as emails and / or
 * phone numbers.
 */
public class ValidationHelper {

	private static final Logger LOGGER = LoggerFactory.getLogger(ValidationHelper.class);

	private ValidationHelper(){
		throw new IllegalStateException("Not meant to be instantiated");
	}

	/**
	 * Regular expression attempting to validate the phone number; it contains three distinct variants of phone numbers in various formats.
	 * Inspiration: <a href="https://www.baeldung.com/java-regex-validate-phone-numbers">Baeldung article</a>
	 */


	public static final Pattern VALID_PHONE_REGEX = Pattern.compile(
			"^(\\+\\d{1,3}( )?)?((\\(\\d{3,4}\\)( )?)|\\d{3,4}( )?)?[- ./]?( )?\\d{3,4}?( )?[- ./]?( )?\\d{3,4}?( )?$"
			+ "|^(\\+\\d{1,3}( )?)?(\\d{3} ?){2}\\d{3}$"
			+ "|^(\\+\\d{1,3}( )?)?(\\d{3} ?)(\\d{2} ?){2}\\d{2}$"
	);

	public static final Pattern VALID_EMAIL_ADDRESS_REGEX =
		    Pattern.compile("^[A-Z\\d._%+-]+@[A-Z\\d.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

	/**
	 * Attempts to validate that the provided string is an email address using regex {@link ValidationHelper#VALID_EMAIL_ADDRESS_REGEX}
	 * @param email is a String we want to validate
	 * @return boolean {@code true} if validation was successful or {@code false} if not
	 */
	public static boolean isEmailAddressValid(String email) {
        Matcher matcher = VALID_EMAIL_ADDRESS_REGEX .matcher(email);
        return matcher.find();
	}

	/**
	 * Attempts to validate the provided 'phone number' string against a regular expression {@link ValidationHelper#VALID_PHONE_REGEX}
	 * @param phoneNumber is a String that contains the phone number (possibly containing special characters, hence String and not Long)
	 * @return boolean {@code true} if we 'validated' the phone number or {@code false} if not.
	 */
	public static boolean isPhoneNumberValid(String phoneNumber){
		if(null != phoneNumber){
			Matcher matcher = VALID_PHONE_REGEX.matcher(phoneNumber.trim());
			return matcher.find();
		}
		LOGGER.error("Phone number appears to be 'null'. Unable to validate if that is correct, returning " +
				"'false' indicating provided number is not valid, however strictly speaking that may not be " +
				"true");
		return false;
	}
}