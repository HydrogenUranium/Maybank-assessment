package com.dhl.discover.core.config.impl;

import com.dhl.discover.core.config.MarketoSubmissionConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MarketoSubmissionConfigReaderImplTest {

    private MarketoSubmissionConfigReaderImpl configReader;
    private MarketoSubmissionConfig config;

    @BeforeEach
    void setUp() {
        configReader = new MarketoSubmissionConfigReaderImpl();
        config = mock(MarketoSubmissionConfig.class);
    }

    @Test
    void testDefaultValues() {
        when(config.getMarketoHostname()).thenReturn(null);
        when(config.getClientId()).thenReturn(null);
        when(config.getSecret()).thenReturn(null);
        when(config.marketoAuthenticationAPIEndpoint()).thenReturn(null);
        when(config.formSubmissionAPIEndpoint()).thenReturn(null);
        when(config.marketoFormDescriptionAPIEndpoint()).thenReturn(null);
        when(config.marketoFormFieldsAPIEndpoint()).thenReturn(null);
        when(config.marketoHiddenFormSubmissionEnabled()).thenReturn(false);
        when(config.validPathsForApiSubmission()).thenReturn(null);

        activateReader(configReader, config);

        assertEquals("https://084-XPW-627.mktorest.com", configReader.getMarketoHost());
        assertEquals("", configReader.getMarketoClientId());
        assertEquals("", configReader.getMarketoClientSecret());
        assertEquals("/identity/oauth/token", configReader.getMarketoAuthenticationAPIEndpoint());
        assertEquals("/rest/v1/leads/submitForm.json", configReader.getMarketoFormSubmissionAPIEndpoint());
        assertEquals("/rest/v1/leads/describe2.json", configReader.getMarketoFormDescriptionAPIEndpoint());
        assertEquals("/rest/asset/v1/form/{0}/fields.json", configReader.getMarketoFormFieldsAPIEndpoint());
        assertFalse(configReader.getMarketoHiddenFormSubmissionEnabled());
        assertEquals(List.of("/content/dhl/global/en-global"), configReader.getAPIAllowedPaths());
    }

    @Test
    void testCustomValues() {
        when(config.getMarketoHostname()).thenReturn("https://custom-host.marketo.com");
        when(config.getClientId()).thenReturn("test-client-id");
        when(config.getSecret()).thenReturn("test-secret");
        when(config.marketoAuthenticationAPIEndpoint()).thenReturn("/custom/auth");
        when(config.formSubmissionAPIEndpoint()).thenReturn("/custom/submit");
        when(config.marketoFormDescriptionAPIEndpoint()).thenReturn("/custom/describe");
        when(config.marketoFormFieldsAPIEndpoint()).thenReturn("/custom/fields");
        when(config.marketoHiddenFormSubmissionEnabled()).thenReturn(true);
        when(config.validPathsForApiSubmission()).thenReturn(new String[]{"/path1", "/path2"});

        activateReader(configReader, config);

        assertEquals("https://custom-host.marketo.com", configReader.getMarketoHost());
        assertEquals("test-client-id", configReader.getMarketoClientId());
        assertEquals("test-secret", configReader.getMarketoClientSecret());
        assertEquals("/custom/auth", configReader.getMarketoAuthenticationAPIEndpoint());
        assertEquals("/custom/submit", configReader.getMarketoFormSubmissionAPIEndpoint());
        assertEquals("/custom/describe", configReader.getMarketoFormDescriptionAPIEndpoint());
        assertEquals("/custom/fields", configReader.getMarketoFormFieldsAPIEndpoint());
        assertTrue(configReader.getMarketoHiddenFormSubmissionEnabled());
        assertEquals(Arrays.asList("/path1", "/path2"), configReader.getAPIAllowedPaths());
    }

    @Test
    void testNullAllowedPaths() {
        when(config.validPathsForApiSubmission()).thenReturn(null);
        activateReader(configReader, config);

        assertEquals(List.of("/content/dhl/global/en-global"), configReader.getAPIAllowedPaths());
    }


    private void activateReader(MarketoSubmissionConfigReaderImpl reader, MarketoSubmissionConfig config) {
        try {
            Method activateMethod = MarketoSubmissionConfigReaderImpl.class.getDeclaredMethod("activate", MarketoSubmissionConfig.class);
            activateMethod.setAccessible(true);
            activateMethod.invoke(reader, config);
        } catch (Exception e) {
            fail("Failed to activate reader: " + e.getMessage());
        }
    }
}
