package com.positive.dhl.core.models;

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
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("source", "source");
		params.put("lead_originator", "lo");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
        
		ShipNowForm shipNowForm = request.adaptTo(ShipNowForm.class);

		assert shipNowForm != null;
		assertEquals(shipNowForm.getSource(), "source");
		assertEquals(shipNowForm.getLead_originator(), "lo");

		shipNowForm.setSource("src");
		shipNowForm.setLead_originator("lo2");
		shipNowForm.setShipnowmessage("snm");
		shipNowForm.setShipnowurl("snu");
		shipNowForm.setPreselectedcountry("pc");

		assertEquals(shipNowForm.getSource(), "src");
		assertEquals(shipNowForm.getLead_originator(), "lo2");
		assertEquals(shipNowForm.getShipnowmessage(), "snm");
		assertEquals(shipNowForm.getShipnowurl(), "snu");
		assertEquals(shipNowForm.getPreselectedcountry(), "pc");
	}

}
