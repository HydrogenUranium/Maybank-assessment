package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RegistrationTest {
	private Registration registration = new Registration();
	
	@BeforeEach
	void setUp() throws Exception {
		registration.setFirstname("firstname");
		registration.setLastname("lastname");
		registration.setEmail("email");
		registration.setNewemail("new-email");
		registration.setPassword("password");
		registration.setSalt("salt");
		registration.setNewpassword("new-password");
		registration.setPosition("position");
		registration.setContactNumber("contact-number");
		registration.setBusinessSize("business-size");
		registration.setBusinessSector("business-sector");
		registration.setIslinkedin(true);
		registration.setInterest_categories("interest-categories");
		registration.setFullAccount(true);
		registration.setTcAgree(true);
	}

	@Test
	void testGetFirstname() {
		assertEquals("firstname", registration.getFirstname());
	}

	@Test
	void testGetLastname() {
		assertEquals("lastname", registration.getLastname());
	}

	@Test
	void testGetEmail() {
		assertEquals("email", registration.getEmail());
	}

	@Test
	void testGetNewemail() {
		assertEquals("new-email", registration.getNewemail());
	}

	@Test
	void testGetPassword() {
		assertEquals("password", registration.getPassword());
	}

	@Test
	void testGetSalt() {
		assertEquals("salt", registration.getSalt());
	}

	@Test
	void testGetNewpassword() {
		assertEquals("new-password", registration.getNewpassword());
	}

	@Test
	void testGetPosition() {
		assertEquals("position", registration.getPosition());
	}

	@Test
	void testGetContactNumber() {
		assertEquals("contact-number", registration.getContactNumber());
	}

	@Test
	void testGetBusinessSize() {
		assertEquals("business-size", registration.getBusinessSize());
	}

	@Test
	void testGetBusinessSector() {
		assertEquals("business-sector", registration.getBusinessSector());
	}

	@Test
	void testIsIslinkedin() {
		assertTrue(registration.isIslinkedin());
	}

	@Test
	void testGetInterest_categories() {
		assertEquals("interest-categories", registration.getInterest_categories());
	}

	@Test
	void testIsFullAccount() {
		assertTrue(registration.isFullAccount());
	}

	@Test
	void testIsTcAgree() {
		assertTrue(registration.isTcAgree());
	}

}
