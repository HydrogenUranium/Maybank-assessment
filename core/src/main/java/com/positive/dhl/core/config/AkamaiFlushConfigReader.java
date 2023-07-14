/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.config;


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
     * Retrieves the value of on/off switch whether to send the flush request or not
     * @return boolean {@code true} if functionality is enabled, or {@code false} if not
     */
    boolean getEnabled();

}
