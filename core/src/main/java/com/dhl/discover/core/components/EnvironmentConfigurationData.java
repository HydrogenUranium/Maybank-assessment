package com.dhl.discover.core.components;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

/**
 * Environment Configuration definition - blueprint for OSGi configuration dialog
 */
@ObjectClassDefinition(
    name = "DHL General Site Component Configuration",
    description = "DHL General site implementation configuration"
)
public @interface EnvironmentConfigurationData {

    /**
     * Method that fetches the 'asset prefix'
     * @return String representing the 'prefix' added to assets etc..
     */
    @AttributeDefinition(
        name = "Asset prefix",
        description = "Asset prefix (for DAM assets)",
        defaultValue = "/discover",
        type = AttributeType.STRING)
    String assetPrefix();

    /**
     * Method that fetches the Akamai hostname
     * @return String representing the hostname that can be used to construct canonical URLs
     */
    @AttributeDefinition(
        name = "Akamai hostname",
        description = "Environment-specific Akamai hostname",
        defaultValue = "www.dhl.com",
        type = AttributeType.STRING)
    String akamaiHostname();

    /**
     * Method that fetches the 'countryInfoLocation' from the OSGi config
     * @return String representing the location of country information
     */
    @AttributeDefinition(
        name = "Country information repository path",
        description = "Repository location of country info (such as international calling code, currency etc..). " +
            "Caution: when changing this value, make sure to also update the repo init scripts",
        defaultValue = "/conf/dhl/appdata/countries"
    )
    String countryInfoLocation();

    @AttributeDefinition(
        name = "Marketo default formID",
        description = "There are only several formIDs we use in Marketo. This provides the option to set the default one to be used in case individual" +
            "Marketo-using components do not define this value in the configuration",
        defaultValue = "1795",
        type = AttributeType.STRING
    )
    String marketoDefaultFormId();

    @AttributeDefinition(
        name = "Marketo default hiddenFormID",
        description = "There are only several hidden formIDs we use in Marketo. This provides the option to set the default one to be used in case individual" +
            "Marketo-using components do not define this value in the configuration",
        defaultValue = "1756",
        type = AttributeType.STRING
    )
    String marketoDefaultHiddenFormId();

    @AttributeDefinition(
            name = "Adobe DTM",
            defaultValue = "https://assets.adobedtm.com/cd52279ef3fa/6b1d49db70e9/launch-f5fe1ed8f4b2-staging.min.js",
            type = AttributeType.STRING
    )
    String adobeDtmLink();

    @AttributeDefinition(
            name = "GTM Delay Enabled",
            description = "By turning on, the GTM script will be delayed by 5s. Setting it off, the original script will be used, no delay is applied",
            defaultValue = "true",
            type = AttributeType.BOOLEAN
    )
    String gtmDelayEnabled();

    @AttributeDefinition(
            name = "Environment name",
            type = AttributeType.STRING
    )
    String environmentName();


    @AttributeDefinition(
            name = "AEM Env Name",
            type = AttributeType.STRING
    )
    String aemEnvName();
}
