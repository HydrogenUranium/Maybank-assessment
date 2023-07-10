/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.config;

import org.osgi.service.cm.Configuration;

public interface AkamaiFlushConfigReader {

    /**
     * Method to provide the Akamai Client Secret
     *
     * @return clientSecret - {@link String}
     */
    String getClientSecret();

    /**
     * Method to provide Akamai Host (this would be different for each API user)
     *
     * @return akamai API hostname - {@link String}
     */
    String getAkamaiHost();

    /**
     * Method to provide Akamai access token
     *
     * @return Akamai access token - {@link String}
     */
    String getAccessToken();

    /**
     * Method to provide Akamai client token
     *
     * @return Client Token - {@link String}
     */
    String getClientToken();

    /**
     * Method to provide the delay (in seconds)
     *
     * @return delay - {@link Long}
     */
    Long getDelay();

    /**
     * Method to provide the baseURL (this is the API endpoint used to derive the final URL)
     *
     * @return API endpoint - {@link String}
     */
    String getBaseUrl();

    /**
     * Method to provide the 'chunk size' - max number of URLs to fit into the Akamai request
     *
     * @return chunk size - int
     */
    int getChunkSize();

    /**
     * Method to provide the allowedContentTypes (array of allowed content types that can be flushed)
     *
     * @return allowedContentTypes - {@link String[]}
     */
    String[] getAllowedContentTypes();

    /**
     * Method to provide the allowedContentPaths (array of allowed content paths that can be flushed)
     *
     * @return allowedContentPaths - {@link String[]}
     */
    String[] getAllowedContentPaths();

    /**
     * Method to provide array of {@code Configuration} that can be found under the provided PID
     * @return an array of {@link Configuration}s, each item in the array matches the OSGi configuration
     * entry with this persistence id. If nothing was found, empty array is returned
     * @param persistenceId is the name of persistenceId (that can be found in OSGi console)
     */
    Configuration[] getGNFOsgiConfigs(String persistenceId);
}
