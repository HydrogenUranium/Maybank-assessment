
package com.positive.dhl.core.config.impl;

import com.positive.dhl.core.config.AkamaiFlushConfig;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.Designate;

@Component(service = AkamaiFlushConfigReaderImpl.class, immediate = true)
@Designate(ocd = AkamaiFlushConfig.class)
public class AkamaiFlushConfigReaderImpl implements AkamaiFlushConfigReader {

    private String clientSecret;
    private String accessToken;
    private String akamaiHost;
    private String clientToken;
    private Long delay;
    private String apiBase;
    private int chunkSize;
    private String[] allowedContentTypes;
    private String[] allowedContentPaths;
    private boolean enabled;

    @Activate
    @Modified
    protected void activate(final AkamaiFlushConfig configReader) {
        this.clientSecret = configReader.clientSecret();
        this.accessToken = configReader.accessToken();
        this.akamaiHost = configReader.akamaiHost();
        this.clientToken = configReader.clientToken();
        this.delay = configReader.delay();
        this.apiBase = configReader.apiBase();
        this.chunkSize = configReader.chunkSize();
        this.allowedContentTypes = configReader.allowedContentTypes();
        this.allowedContentPaths = configReader.allowedContentPaths();
        this.enabled =  configReader.flushEnabled();
    }

    /**
     * Method to provide the Akamai Client Secret
     *
     * @return clientSecret - {@link String}
     */
    public String getClientSecret() {
        return clientSecret;
    }

    /**
     * Method to provide Akamai Host (this would be different for each API user)
     *
     * @return akamai API hostname - {@link String}
     */
    public String getAkamaiHost() {
        return akamaiHost;
    }

    /**
     * Method to provide Akamai access token
     *
     * @return Akamai access token - {@link String}
     */
    public String getAccessToken() {
        return accessToken;
    }

    /**
     * Method to provide Akamai client token
     *
     * @return Client Token - {@link String}
     */
    public String getClientToken() {
        return clientToken;
    }

    /**
     * Method to provide the delay (in seconds)
     *
     * @return delay - {@link Long}
     */
    public Long getDelay() {
        if (delay > 0) {
            return delay;
        }
        return (long) 1;
    }

    /**
     * Method to provide the baseURL (this is the API endpoint used to derive the final URL)
     *
     * @return API endpoint - {@link String}
     */
    public String getBaseUrl() {
        return apiBase;
    }

    /**
     * Method to provide the 'chunk size' - max number of URLs to fit into the Akamai request
     *
     * @return chunk size - int
     */
    public int getChunkSize() {
        return chunkSize;
    }

    /**
     * Method to provide the allowedContentTypes (array of allowed content types that can be flushed)
     *
     * @return allowedContentTypes - {@link String[]}
     */
    public String[] getAllowedContentTypes() {
        return allowedContentTypes;
    }

    /**
     * Method to provide the allowedContentPaths (array of allowed content paths that can be flushed)
     *
     * @return allowedContentPaths - {@link String[]}
     */
    public String[] getAllowedContentPaths() {
        return allowedContentPaths;
    }

    @Override
    public boolean getEnabled() {
        return enabled;
    }

}
