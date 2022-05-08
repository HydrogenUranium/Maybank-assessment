package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.positive.dhl.core.helpers.ValidationHelper;

class ValidationHelperTest {

	@BeforeEach
	public void setUp() throws Exception {
		ValidationHelper helper = new ValidationHelper();
	}

	@Test
	public void testEmailAddressValid() {
		assertTrue(ValidationHelper.EmailAddressValid("test@email.com"));
	}

	@Test
	public void testEmailAddressInvalid() {
		assertFalse(ValidationHelper.EmailAddressValid("test"));
	}
}
