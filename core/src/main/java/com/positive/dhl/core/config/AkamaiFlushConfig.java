package com.positive.dhl.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import static com.day.cq.commons.jcr.JcrConstants.NT_FILE;

import static com.day.cq.dam.api.DamConstants.NT_DAM_ASSET;
import static com.day.cq.wcm.api.constants.NameConstants.NT_PAGE;

@ObjectClassDefinition(
        name = "[DHL] | Akamai Flush configuration",
        description = "This configuration controls the behaviour of the Akamai Flush agent - this agent is used to invalidate urls in Akamai's cache."
)
public @interface AkamaiFlushConfig {

    @AttributeDefinition(
        name = "Akamai Flush enabled",
        description = "On / Off switch that either sets the configuration enabled or disabled. " +
            "If disabled, replication events would still be listened to, but not acted on.",
        type = AttributeType.BOOLEAN
    )
    boolean flushEnabled() default false;

    @AttributeDefinition(
            name = "Client Secret",
            description = "Client Secret is one of the 4 values required by the Akamai HTTP client to sign the request",
            type = AttributeType.PASSWORD
    )
    String clientSecret();

    @AttributeDefinition(
            name = "Access Token",
            description = "Access Token is one of the 4 values required by the Akamai HTTP client to sign the request",
            type = AttributeType.PASSWORD
    )
    String accessToken();

    @AttributeDefinition(
            name = "Client Token",
            description = "Client Token is one of the 4 values required by the Akamai HTTP client to sign the request",
            type = AttributeType.PASSWORD
    )
    String clientToken();

    @AttributeDefinition(
            name = "Akamai Host",
            description = "Akamai Host is one of the 4 values required by the Akamai HTTP client to sign the request. Additinoally," +
                    "it's also the API endpoint",
            type = AttributeType.STRING
    )
    String akamaiHost();

    @AttributeDefinition(
            name = "Delay",
            description = "How long (in seconds) is the Agent going to wait before actually sending the request to Akamai",
            type = AttributeType.LONG
    )
    long delay() default 1;

    @AttributeDefinition(
            name = "Allowed content types",
            description = "List of content types which we allow to be flushed on Akamai",
            type = AttributeType.STRING
    )
    String[] allowedContentTypes() default {NT_PAGE, NT_DAM_ASSET, NT_FILE};

    @AttributeDefinition(
            name = "Allowed content paths",
            description = "List of content paths which we allow to be flushed on Akamai",
            type = AttributeType.STRING
    )
    String[] allowedContentPaths() default {"/content", "/etc.clientlibs"};

    @AttributeDefinition(
        name = "Akamai purge api path",
        description = "API path where the invalidation requests are to be sent (https://techdocs.akamai.com/purge-cache/reference/invalidate-url)",
        type = AttributeType.STRING,
        defaultValue = "/ccu/v3/invalidate/url/{0}"
    )
    String flushApiPath() default "/ccu/v3/invalidate/url/{0}";
}
