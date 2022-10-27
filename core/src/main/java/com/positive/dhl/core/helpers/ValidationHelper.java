package com.positive.dhl.core.helpers;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidationHelper {

	private ValidationHelper(){
		throw new IllegalStateException("Not meant to be instantiated");
	}
	public static final Pattern VALID_PHONE_REGEX = Pattern.compile("^(\\+\\d{1,3}( )?)?((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4}$"
			+ "|^(\\+\\d{1,3}( )?)?(\\d{3} ?){2}\\d{3}$"
			+ "|^(\\+\\d{1,3}( )?)?(\\d{3} ?)(\\d{2} ?){2}\\d{2}$");
	public static final Pattern VALID_EMAIL_ADDRESS_REGEX =
		    Pattern.compile("^[A-Z\\d._%+-]+@[A-Z\\d.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);
	
	/**
	 *
	 */
	public static boolean isEmailAddressValid(String email) {
        Matcher matcher = VALID_EMAIL_ADDRESS_REGEX .matcher(email);
        return matcher.find();
	}

	public static boolean isPhoneNumberValid(String phoneNumber){
		Matcher matcher = VALID_PHONE_REGEX.matcher(phoneNumber);
		return matcher.find();
	}
}