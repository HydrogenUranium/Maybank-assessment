package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class ShipNowRegistrationTest {
	@Test
	void test() throws Exception {
		ShipNowUser user = new ShipNowUser();
		user.setFirstname("firstname");
		user.setLastname("lastname");
		user.setEmail("email");
		user.setCompany("company");
		user.setPhone("phone");
		user.setAddress("address");
		user.setPostcode("postcode");
		user.setCity("city");
		user.setCountry("australia|au|AUD");
		user.setSource("source");
		user.setLo("lo");

		assertEquals("firstname", user.getFirstname());
	}
}
