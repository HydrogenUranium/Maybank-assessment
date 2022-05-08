package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ShipNowUserTest {
	private ShipNowUser user = new ShipNowUser();

	@BeforeEach
	void setUp() throws Exception {
		user.setFirstname("firstname");
		user.setLastname("lastname");
		user.setEmail("email");
		user.setCompany("company");
		user.setPhone("phone");
		user.setAddress("address");
		user.setPostcode("postcode");
		user.setCity("city");
		user.setCountry("country");
		user.setSource("source");
		user.setLo("lo");
	}

	@Test
	void testGetFirstname() {
		assertEquals("firstname", user.getFirstname());
	}

	@Test
	void testGetLastname() {
		assertEquals("lastname", user.getLastname());
	}

	@Test
	void testGetEmail() {
		assertEquals("email", user.getEmail());
	}

	@Test
	void testGetCompany() {
		assertEquals("company", user.getCompany());
	}

	@Test
	void testGetPhone() {
		assertEquals("phone", user.getPhone());
	}

	@Test
	void testGetAddress() {
		assertEquals("address", user.getAddress());
	}

	@Test
	void testGetPostcode() {
		assertEquals("postcode", user.getPostcode());
	}

	@Test
	void testGetCity() {
		assertEquals("city", user.getCity());
	}

	@Test
	void testGetCountry() {
		assertEquals("country", user.getCountry());
	}

	@Test
	void testGetSource() {
		assertEquals("source", user.getSource());
	}

	@Test
	void testGetLo() {
		assertEquals("lo", user.getLo());
	}

}
