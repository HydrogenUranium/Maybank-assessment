package com.dhl.discover.core.components;

/**
 * Reads the Discover OSGi configuration
 */
public interface EnvironmentConfiguration {

    String getAdobeDtmLink();

    String getAssetPrefix();

    /**
     * Returns the configured 'akamai' hostname. This is a hostname that when accessed is served by Akamai CDN.
     * @return a {@link String} representation of 'Akamai' hostname, defaults to 'www.dhl.com'
     */
    String getAkamaiHostname();

    /**
     * Fetches the repository location of country information
     * @return a String representing repository path where the country information is kept
     */
    String getCountryInfoLocation();

    /**
     * Provides the default Marketo formID - to be used in cases where component configuration doesn't define such value
     * @return a {@link String} representing the Marketo FormID
     */
    String getDefaultMarketoFormId();

    /**
     * Provides the default Marketo hidden formID - to be used in cases where component configuration doesn't define such value
     * @return a {@link String} representing the Marketo FormID
     */
    String getDefaultMarketoHiddenFormId();
}
