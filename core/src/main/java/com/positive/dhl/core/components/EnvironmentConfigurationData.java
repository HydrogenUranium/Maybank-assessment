package com.positive.dhl.core.components;

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
        description = "Asset prefix (for CSS/image URLs in metadata",
        defaultValue = "",
        type = AttributeType.STRING)
    String assetPrefix();

    /**
     * Method that fetches the 'countryInfoLocation' from the OSGi config
     * @return String representing the location of country information
     */
    @AttributeDefinition(
        name = "Country information repository path",
        description = "Repository location of country info (such as international calling code, currency etc..). " +
            "Caution: when changing this value, make sure to also update the repo init scripts in" +

            " the configuration",
        defaultValue = "/conf/dhl/appdata/countries"
    )
    String countryInfoLocation();
}
