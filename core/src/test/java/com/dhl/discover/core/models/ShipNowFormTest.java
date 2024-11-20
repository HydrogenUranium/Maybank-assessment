package com.dhl.discover.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class ShipNowFormTest {
    private final AemContext ctx = new AemContext();

	@BeforeEach
	void setUp() throws Exception {
	    ctx.addModelsForClasses(ShipNowForm.class);
	}

	@Test
	void test() {
		Map<String, Object> params = new HashMap<>();
		params.put("source", "source");
		params.put("lead_originator", "lo");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
        
		ShipNowForm shipNowForm = request.adaptTo(ShipNowForm.class);

		assert shipNowForm != null;
		assertEquals("source", shipNowForm.getSource());
		assertEquals("lo", shipNowForm.getLeadOriginator());

		shipNowForm.setSource("src");
		shipNowForm.setLeadOriginator("lo2");
		shipNowForm.setShipnowmessage("snm");
		shipNowForm.setShipnowurl("snu");
		shipNowForm.setPreselectedcountry("pc");

		assertEquals("src", shipNowForm.getSource());
		assertEquals("lo2", shipNowForm.getLeadOriginator());
		assertEquals("snm", shipNowForm.getShipnowmessage());
		assertEquals("snu", shipNowForm.getShipnowurl());
		assertEquals("pc", shipNowForm.getPreselectedcountry());
	}

}
