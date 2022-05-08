package com.positive.dhl.core.shipnow;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;


import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
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

	@Test
	void test() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("email", "test@email.com");
		params.put("firstname", "user-firstname");
		params.put("lastname", "user-lastname");

		params.put("company", "user-company");
		params.put("phone", "user-phone");
		params.put("address", "user-address");
		params.put("postcode", "user-postcode");
		params.put("city", "user-city");
		params.put("country", "user-country");

		params.put("source", "user-source");
		params.put("lo", "user-lo");

        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
        
		ValidatedRequestEntry entry = new ValidatedRequestEntry();
		entry.AddRequiredField("email", request, ValidationType.Email);
		entry.AddRequiredField("firstname", request);
		entry.AddRequiredField("lastname", request);

		entry.AddRequiredField("company", request);
		entry.AddRequiredField("phone", request);
		entry.AddRequiredField("address", request);
		entry.AddRequiredField("postcode", request);
		entry.AddRequiredField("city", request);
		entry.AddRequiredField("country", request);

		entry.AddOptionalField("source", request);
		entry.AddOptionalField("lo", request);
		
		assertTrue(entry.Validate());
		assertEquals(0, entry.getErrors().size());
		assertEquals(entry.get("email"), "test@email.com");
		assertEquals(entry.get("firstname"), "user-firstname");
		assertEquals(entry.get("lastname"), "user-lastname");

		assertEquals(entry.get("company"), "user-company");
		assertEquals(entry.get("phone"), "user-phone");
		assertEquals(entry.get("address"), "user-address");
		assertEquals(entry.get("postcode"), "user-postcode");
		assertEquals(entry.get("city"), "user-city");
		assertEquals(entry.get("country"), "user-country");

		assertEquals(entry.get("source"), "user-source");
		assertEquals(entry.get("lo"), "user-lo");
	}
}