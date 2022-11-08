package com.positive.dhl.core.components.impl;

import com.positive.dhl.core.components.EnvironmentConfigurationData;
import com.positive.dhl.core.components.EnvironmentConfiguration;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.osgi.service.metatype.annotations.Designate;

/**
 * Reads various configuration entries of the Discover application from the OSGi
 */
@Component(
        service = EnvironmentConfiguration.class,
        immediate = true,
        property = {
                Constants.SERVICE_ID + "=Environment Configuration Service",
                Constants.SERVICE_DESCRIPTION + "=This service reads values from Environment Configuration"
        })
@Designate(ocd = EnvironmentConfigurationData.class)
@ServiceDescription("Discover environment configuration")
public class EnvironmentConfigurationImpl implements EnvironmentConfiguration {

    private EnvironmentConfigurationData environmentConfigurationData;
    private String countryInfoLocation;


    /**
     *
     * @param environmentConfigurationData is an instance of {@link EnvironmentConfigurationData} object, this object represents the entry visible in AEM's config manager
     */
    @Activate
    protected void activate(EnvironmentConfigurationData environmentConfigurationData) {
        countryInfoLocation = PropertiesUtil.toString(environmentConfigurationData.countryInfoLocation(),"/conf/dhl/appdata/countries");
        this.environmentConfigurationData = environmentConfigurationData;
    }

    @Override
    public String getAssetPrefix() {
        return this.environmentConfigurationData.assetPrefix();
    }

    @Override
    public String getCountryInfoLocation() {
        return countryInfoLocation;
    }
}
