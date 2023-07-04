package com.positive.dhl.core.components;

/**
 * Reads the Discover OSGi configuration
 */
public interface EnvironmentConfiguration {

    String getAssetPrefix();

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
