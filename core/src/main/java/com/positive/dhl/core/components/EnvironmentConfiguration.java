package com.positive.dhl.core.components;

public interface EnvironmentConfiguration {
    String getAssetprefix();

    /**
     * Fetches the repository location of country information
     * @return a String representing repository path where the country information is kept
     */
    String getCountryInfoLocation();
}
