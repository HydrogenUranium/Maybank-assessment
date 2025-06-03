package com.dhl.discover.core.components;

import com.dhl.discover.core.components.impl.EnvironmentConfigurationImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EnvironmentConfigurationImplTest {

    @InjectMocks
    EnvironmentConfigurationImpl config;

    @Test
    void shouldSetAllConfigurationValuesCorrectlyOnActivation() {
        EnvironmentConfigurationData configData = mock(EnvironmentConfigurationData.class);
        when(configData.countryInfoLocation()).thenReturn("/custom/path");
        when(configData.assetPrefix()).thenReturn("/custom-prefix");
        when(configData.akamaiHostname()).thenReturn("custom.dhl.com");
        when(configData.marketoDefaultFormId()).thenReturn("2000");
        when(configData.marketoDefaultHiddenFormId()).thenReturn("2001");
        when(configData.adobeDtmLink()).thenReturn("https://custom-dtm.js");
        when(configData.gtmDelayEnabled()).thenReturn("false");
        when(configData.environmentName()).thenReturn("prod");
        when(configData.aemEnvName()).thenReturn("prod-aem");

        config.activate(configData);
        assertEquals("/custom/path", config.getCountryInfoLocation());
        assertEquals("/custom-prefix", config.getAssetPrefix());
        assertEquals("custom.dhl.com", config.getAkamaiHostname());
        assertEquals("2000", config.getDefaultMarketoFormId());
        assertEquals("2001", config.getDefaultMarketoHiddenFormId());
        assertEquals("https://custom-dtm.js", config.getAdobeDtmLink());
        assertEquals("false", config.getGtmDelayEnabled());
        assertEquals("prod", config.getEnvironmentName());
        assertEquals("prod-aem", config.getAemEnvName());
    }


}
