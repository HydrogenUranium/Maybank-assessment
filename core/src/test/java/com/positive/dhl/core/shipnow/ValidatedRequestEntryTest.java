package com.positive.dhl.core.shipnow;

import static org.junit.jupiter.api.Assertions.*;


import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.positive.dhl.core.shipnow.models.ValidatedRequestEntry;
import com.positive.dhl.core.shipnow.models.ValidationType;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ValidatedRequestEntryTest {
  private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

	ValidatedRequestEntry underTest;

	@BeforeEach
	public void init(){
		underTest = new ValidatedRequestEntry();
	}

	@Test
	void testEmailValidation(){
		ctx.request().addRequestParameter("email", "test.email@dhl.com");

		underTest.addRequiredField("email", ctx.request(), ValidationType.EMAIL);

		boolean validationResult = underTest.validate();
		assertTrue(validationResult);
	}

	@Test
	void testEmailValidationBad(){
		ctx.request().addRequestParameter("email", "test.email#dhl.com");

		underTest.addRequiredField("email", ctx.request(), ValidationType.EMAIL);

		boolean validationResult = underTest.validate();
		assertFalse(validationResult);
	}

	@Test
	void testNonEmptyValidation(){
		ctx.request().addRequestParameter("firstName", "Dummy First Name");

		underTest.addRequiredField("firstName",ctx.request(),ValidationType.NOT_EMPTY);

		boolean validationResult = underTest.validate();
		assertTrue(validationResult);
	}

	@Test
	void testPhoneValidationNoCountryCode(){
		ctx.request().addRequestParameter("phone", "420123123123");

		underTest.addRequiredField("phone",ctx.request(),ValidationType.PHONE);

		boolean validationResult = underTest.validate();
		assertFalse(validationResult);
	}

	@Test
	void testPhoneValidationBracketsBad(){
		ctx.request().addRequestParameter("phone", "42012312(3123)");

		underTest.addRequiredField("phone",ctx.request(),ValidationType.PHONE);

		boolean validationResult = underTest.validate();
		assertFalse(validationResult);
	}

	@Test
	void testPhoneValidationBrackets(){
		ctx.request().addRequestParameter("phone", "+420(123)123123");

		underTest.addRequiredField("phone",ctx.request(),ValidationType.PHONE);

		boolean validationResult = underTest.validate();
		assertTrue(validationResult);
	}
}