package com.dhl.discover.core.components.impl;

import com.dhl.discover.core.components.EnvironmentConfigurationData;
import com.dhl.discover.core.components.EnvironmentConfiguration;
import lombok.Getter;
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
@Getter
public class EnvironmentConfigurationImpl implements EnvironmentConfiguration {

    private String countryInfoLocation;
    private String assetPrefix;
    private String akamaiHostname;
    private String defaultMarketoFormId;
    private String defaultMarketoHiddenFormId;
    private String adobeDtmLink;
    private String gtmDelayEnabled;
    private String environmentName;
    private String aemEnvName;

    /**
     *
     * @param environmentConfigurationData is an instance of {@link EnvironmentConfigurationData} object, this object represents the entry visible in AEM's config manager
     */
    @Activate
    protected void activate(EnvironmentConfigurationData environmentConfigurationData) {
        countryInfoLocation = PropertiesUtil.toString(environmentConfigurationData.countryInfoLocation(), "/conf/dhl/appdata/countries");
        assetPrefix = PropertiesUtil.toString(environmentConfigurationData.assetPrefix(), "/discover");
        akamaiHostname = PropertiesUtil.toString(environmentConfigurationData.akamaiHostname(), "www.dhl.com");
        defaultMarketoFormId = PropertiesUtil.toString(environmentConfigurationData.marketoDefaultFormId(),"1795");
        defaultMarketoHiddenFormId = PropertiesUtil.toString(environmentConfigurationData.marketoDefaultHiddenFormId(),"1756");
        adobeDtmLink = PropertiesUtil.toString(environmentConfigurationData.adobeDtmLink(), "https://assets.adobedtm.com/cd52279ef3fa/6b1d49db70e9/launch-f5fe1ed8f4b2-staging.min.js");
        gtmDelayEnabled = PropertiesUtil.toString(environmentConfigurationData.gtmDelayEnabled(), "true");
        environmentName = PropertiesUtil.toString(environmentConfigurationData.environmentName().toUpperCase(), "local");
        aemEnvName = PropertiesUtil.toString(environmentConfigurationData.aemEnvName(), "local-aem-env");
    }
}
