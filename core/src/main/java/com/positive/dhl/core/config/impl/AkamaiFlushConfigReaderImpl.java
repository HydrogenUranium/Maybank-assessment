
package com.positive.dhl.core.config.impl;

import com.positive.dhl.core.config.AkamaiFlushConfig;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import lombok.Getter;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.Designate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
@Component(service = AkamaiFlushConfigReader.class, immediate = true)
@Designate(ocd = AkamaiFlushConfig.class)
public class AkamaiFlushConfigReaderImpl implements AkamaiFlushConfigReader {

    private String clientSecret;
    private String accessToken;
    private String akamaiHost;
    private String clientToken;
    private Long delay;
    private String[] allowedContentTypes;
    private String[] allowedContentPaths;
    private boolean enabled;
    private String apiPath;

    @Activate
    @Modified
    protected void activate(final AkamaiFlushConfig configReader) {
        this.clientSecret = configReader.clientSecret();
        this.accessToken = configReader.accessToken();
        this.akamaiHost = configReader.akamaiHost();
        this.clientToken = configReader.clientToken();
        this.delay = configReader.delay();
        this.allowedContentTypes = configReader.allowedContentTypes();
        this.allowedContentPaths = configReader.allowedContentPaths();
        this.enabled =  configReader.flushEnabled();
        this.apiPath = configReader.flushApiPath();
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
     * Method to provide the allowedContentTypes (array of allowed content types that can be flushed)
     *
     * @return allowedContentTypes - {@link String[]}
     */
    public List<String> getAllowedContentTypes() {
        if(null != allowedContentTypes){
            return Arrays.asList(allowedContentTypes);
        }
        return new ArrayList<>();
    }

    /**
     * Method to provide the allowedContentPaths (array of allowed content paths that can be flushed)
     *
     * @return allowedContentPaths - {@link List} of {@link String}s
     */
    public List<String> getAllowedContentPaths() {
        if(null != allowedContentPaths){
            return Arrays.asList(allowedContentPaths);
        }
        return new ArrayList<>();
    }

}
