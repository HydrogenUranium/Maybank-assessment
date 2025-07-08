/* 9fbef606107a605d69c0edbcd8029e5d */
package com.dhl.discover.core.config;


import java.util.List;

/**
 * Configuration class providing access AEM configuration of Akamai flush functionality.
 */
public interface AkamaiFlushConfigReader {

    /**
     * Method to provide the authentication credential
     *
     * @return authentication credential - {@link String}
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
     * Method to provide the allowedContentTypes (array of allowed content types that can be flushed)
     *
     * @return allowedContentTypes - {@link String[]}
     */
    List<String> getAllowedContentTypes();

    /**
     * Method to provide the allowedContentPaths (array of allowed content paths that can be flushed)
     *
     * @return allowedContentPaths - {@link String[]}
     */
    List<String> getAllowedContentPaths();

    /**
     * Retrieves the value of on/off switch whether to send the flush request or not
     * @return boolean {@code true} if functionality is enabled, or {@code false} if not
     */
    boolean isEnabled();

    /**
     * Provides the Akamai invalidate request API path
     * @return String representation of the path where invalidation requests are to be sent
     */
    String getApiPath();

}
