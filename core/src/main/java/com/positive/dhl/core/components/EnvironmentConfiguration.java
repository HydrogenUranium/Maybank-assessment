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
}
