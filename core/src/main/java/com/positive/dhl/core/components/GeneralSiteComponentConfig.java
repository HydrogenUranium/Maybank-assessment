package com.positive.dhl.core.components;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

/*
 *
 */
@ObjectClassDefinition(name = "DHL General Site Component Configuration", description = "DHL General site implementation configuration")
public @interface GeneralSiteComponentConfig {
    /*
     *
     */
    @AttributeDefinition(name = "Disallow crawling/robots", description = "Disallow / de-index all site URLs", defaultValue = "false", type = AttributeType.BOOLEAN)
    String RobotsDisallowAll();

    /*
     *
     */
    @AttributeDefinition(name = "Asset prefix", description = "Asset prefix (for CSS/image URLs in metadata", defaultValue = "", type = AttributeType.STRING)
    String AssetPrefix();
}