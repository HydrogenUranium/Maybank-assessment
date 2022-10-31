package com.positive.dhl.core.helpers;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class ValidationHelperTest {

	@DisplayName("Parametrized positive email validation tests")
	@ParameterizedTest(name = "{index} => email=''{0}''")
	@ValueSource(strings = {
			"firstname.lastname@dhl.com",
			"lastname@dhl.com",
			"a@a.com",
			"TEST@D.EU"
	})
	void isEmailAddressValid(String email) {
		boolean isEmailValid = ValidationHelper.isEmailAddressValid(email);
		assertTrue(isEmailValid);
	}

	@DisplayName("Parametrized negative email validation tests")
	@ParameterizedTest(name = "{index} => email=''{0}''")
	@ValueSource(strings = {
			"firstname.lastname@a",
			"lastname#dhl.com",
			"@dhl.com"
	})
	void isEmailAddressInvalid(String email) {
		boolean isEmailValid = ValidationHelper.isEmailAddressValid(email);
		assertFalse(isEmailValid);
	}

	@DisplayName("Parametrized positive phone validation tests")
	@ParameterizedTest(name = "{index}) phone=''{0}''")
	@ValueSource(strings = {
			"2055550125",
			"202 555 0125",
			"(202) 555-0125",
			"+111 (202) 555-0125",
			"636 856 789",
			"+111 636 856 789",
			"636 85 67 89",
			"+111 636 85 67 89",
			"+49 123456",
			"+65 123456789",
			"+65 (123) - 456 / 789"
	})
	void isPhoneValid(String phone) {
		boolean isPhoneValid = ValidationHelper.isPhoneNumberValid(phone);
		assertTrue(isPhoneValid);
	}

	@DisplayName("Parametrized negative phone validation tests")
	@ParameterizedTest(name = "{index}) phone=''{0}''")
	@ValueSource(strings = {
			"+49 123",
			"+49 1234567891234567891234567891234",
			"+49 abced12345",
			"+49 12345ABCDE",
			"+49 123+45",
			"42012312(3123)"
	})
	void isPhoneInvalid(String phone) {
		boolean isPhoneValid = ValidationHelper.isPhoneNumberValid(phone);
		assertFalse(isPhoneValid);
	}
}