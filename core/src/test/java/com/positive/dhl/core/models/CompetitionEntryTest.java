package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

import javax.jcr.Session;

import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.wcm.testing.mock.aem.junit5.AemContext;

class CompetitionEntryTest {
	@Test
	void test() throws Exception {
		CompetitionEntry entry = new CompetitionEntry();
		entry.setPath("path");
		entry.setFirstname("firstname");
		entry.setLastname("lastname");
		entry.setEmail("email@email.com");
		entry.setPosition("position");
		entry.setContactNumber("contact-number");
		entry.setBusinessSize("business-size");
		entry.setBusinessSector("business-sector");
		
		ArrayList<String> answers = new ArrayList<String>();
		answers.add("answer1");
		answers.add("answer2");
		answers.add("answer3");
		answers.add("answer4");
		answers.add("answer5");
		entry.setAnswers(answers);

		assertEquals("path", entry.getPath());
		assertEquals("firstname", entry.getFirstname());
		assertEquals("lastname", entry.getLastname());
		assertEquals("email@email.com", entry.getEmail());
		assertEquals("position", entry.getPosition());
		assertEquals("contact-number", entry.getContactNumber());
		assertEquals("business-size", entry.getBusinessSize());
		assertEquals("business-sector", entry.getBusinessSector());
		assertEquals(5, entry.getAnswers().size());
	}
}
