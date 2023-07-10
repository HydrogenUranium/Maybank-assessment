/* 9fbef606107a605d69c0edbcd8029e5d */

package com.positive.dhl.core.config.impl;

import com.positive.dhl.core.config.AkamaiFlushConfig;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import org.osgi.framework.InvalidSyntaxException;
import org.osgi.service.cm.Configuration;
import org.osgi.service.cm.ConfigurationAdmin;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component(service = AkamaiFlushConfigReader.class, immediate = true)
@Designate(ocd = AkamaiFlushConfig.class)
public class AkamaiFlushConfigReaderImpl implements AkamaiFlushConfigReader{

    private static final Logger LOGGER = LoggerFactory.getLogger(AkamaiFlushConfigReaderImpl.class);
    private String clientSecret;
    private String accessToken;
    private String akamaiHost;
    private String clientToken;
    private Long delay;
    private String apiBase;
    private int chunkSize;
    private String[] allowedContentTypes;
    private String[] allowedContentPaths;
    @Reference
    private ConfigurationAdmin configurationAdmin;

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
    public Configuration[] getGNFOsgiConfigs(String persistenceId){
        try {

            String filter = "(" + ConfigurationAdmin.SERVICE_FACTORYPID + "=" + persistenceId + ")";
            Configuration[] foundConfigs = configurationAdmin.listConfigurations(filter);
            if(foundConfigs.length > 0){
                return configurationAdmin.listConfigurations(filter);
            }

        } catch (InvalidSyntaxException | IOException e) {
            LOGGER.error(e.getMessage());
        }

        return new Configuration[0];
    }
}
