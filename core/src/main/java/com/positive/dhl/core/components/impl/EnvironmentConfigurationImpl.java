package com.positive.dhl.core.components.impl;

import com.positive.dhl.core.components.EnvironmentConfigurationData;
import com.positive.dhl.core.components.EnvironmentConfiguration;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(
        service = EnvironmentConfiguration.class,
        immediate = true,
        property = {
                Constants.SERVICE_ID + "=Environment Configuration Service",
                Constants.SERVICE_DESCRIPTION + "=This service reads values from Environment Configuration"
        })
@Designate(ocd = EnvironmentConfigurationData.class)
public class EnvironmentConfigurationImpl implements EnvironmentConfiguration {
    private static final String TAG = EnvironmentConfigurationImpl.class.getSimpleName();
    private static final Logger LOGGER = LoggerFactory.getLogger(EnvironmentConfigurationImpl.class);

    private EnvironmentConfigurationData environmentConfigurationData;

    /**
     *
     * @param environmentConfigurationData
     */
    @Activate
    protected void activate(EnvironmentConfigurationData environmentConfigurationData) {
        this.environmentConfigurationData = environmentConfigurationData;
    }

    /**
     *
     * @return
     */
    @Override
    public String getAssetprefix() {
        return this.environmentConfigurationData.AssetPrefix();
    }
}
