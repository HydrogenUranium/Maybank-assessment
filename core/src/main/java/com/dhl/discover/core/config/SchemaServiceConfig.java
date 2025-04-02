package com.dhl.discover.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Schema Service Configuration")
public @interface SchemaServiceConfig {

    @AttributeDefinition(
            name = "Breadcrumb Template Path",
            description = "Path to the breadcrumb template structure root"
    )
    String breadcrumbTemplatePath() default "/structure/jcr:content";
}
