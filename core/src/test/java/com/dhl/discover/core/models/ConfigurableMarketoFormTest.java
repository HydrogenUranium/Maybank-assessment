package com.dhl.discover.core.models;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ConfigurableMarketoFormTest {
    @Mock
    private Resource resource;

    private ConfigurableMarketoForm model;
    private Map<String, Object> properties;

    @BeforeEach
    void setUp() {
        properties = new HashMap<>();

        properties.put("marketoid", "123456");
        properties.put("marketoformid", "form-123");
        properties.put("marketohiddenformid", "hidden-form-123");
        properties.put("marketohost", "https://test.dhl.com");
        properties.put("thanksurl", "/thank-you");
        properties.put("formtitle", "Test Form");
        properties.put("shipnowtitle", "Ship Now");
        properties.put("shipnowcontent", "Ship content text");
        properties.put("googleConversionActionId", "987654");

        when(resource.adaptTo(ConfigurableMarketoForm.class)).thenAnswer(invocation -> {
            ConfigurableMarketoForm form = new ConfigurableMarketoForm();
            form.marketoid = (String) properties.get("marketoid");
            form.marketoformid = (String) properties.get("marketoformid");
            form.marketohiddenformid = (String) properties.get("marketohiddenformid");
            form.marketohost = (String) properties.get("marketohost");
            form.thanksurl = (String) properties.get("thanksurl");
            form.formtitle = (String) properties.get("formtitle");
            form.shipnowtitle = (String) properties.get("shipnowtitle");
            form.shipnowcontent = (String) properties.get("shipnowcontent");
            form.googleConversionActionId = (String) properties.get("googleConversionActionId");
            return form;
        });

        model = resource.adaptTo(ConfigurableMarketoForm.class);
    }

    @Test
    void testProperties() {
        assertEquals("123456", model.marketoid);
        assertEquals("form-123", model.marketoformid);
        assertEquals("hidden-form-123", model.marketohiddenformid);
        assertEquals("https://test.dhl.com", model.marketohost);
        assertEquals("/thank-you", model.thanksurl);
        assertEquals("Test Form", model.formtitle);
        assertEquals("Ship Now", model.shipnowtitle);
        assertEquals("Ship content text", model.shipnowcontent);
        assertEquals("987654", model.googleConversionActionId);
    }

    @Test
    void testGetVisibleFormHost_WithValidValues() {
        assertEquals("https://test.dhl.com", model.getVisibleFormHost());
    }

    @Test
    void testGetVisibleFormHost_WithBlankHost() {
        properties.put("marketohost", "");
        model = resource.adaptTo(ConfigurableMarketoForm.class);

        assertEquals("https://express-resource.dhl.com", model.getVisibleFormHost());
    }

    @Test
    void testGetVisibleFormHost_WithBlankFormId() {
        properties.put("marketoformid", "");
        model = resource.adaptTo(ConfigurableMarketoForm.class);

        assertEquals("https://express-resource.dhl.com", model.getVisibleFormHost());
    }

    @Test
    void testGetVisibleFormHost_WithNullValues() {

        properties.put("marketohost", null);
        properties.put("marketoformid", null);
        model = resource.adaptTo(ConfigurableMarketoForm.class);

        assertEquals("https://express-resource.dhl.com", model.getVisibleFormHost());
    }

    @Test
    void testOptionalFields() {
        properties.clear();
        model = resource.adaptTo(ConfigurableMarketoForm.class);

        assertNull(model.marketoid);
        assertNull(model.marketoformid);
        assertNull(model.marketohiddenformid);
        assertNull(model.marketohost);
        assertNull(model.thanksurl);
        assertNull(model.formtitle);
        assertNull(model.shipnowtitle);
        assertNull(model.shipnowcontent);
        assertNull(model.googleConversionActionId);

        assertEquals("https://express-resource.dhl.com", model.getVisibleFormHost());
    }
}
