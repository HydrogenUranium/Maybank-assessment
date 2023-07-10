/* 9fbef606107a605d69c0edbcd8029e5d */

package com.positive.dhl.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(
        name = "[Akamai Flush agent configuration]",
        description = "This configuration controls the behaviour of the Akamai Flush agent - this agent is used to invalidate urls in Akamai's cache."
)
public @interface AkamaiFlushConfig {

    @AttributeDefinition(
            name = "Client Secret",
            description = "Client Secret is one of the 4 values required by the Akamai HTTP client to sign the request",
            type = AttributeType.STRING
    )
    String clientSecret();

    @AttributeDefinition(
            name = "Access Token",
            description = "Access Token is one of the 4 values required by the Akamai HTTP client to sign the request",
            type = AttributeType.STRING
    )
    String accessToken();

    @AttributeDefinition(
            name = "Client Token",
            description = "Client Token is one of the 4 values required by the Akamai HTTP client to sign the request",
            type = AttributeType.STRING
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
            name = "API base",
            description = "API Base is the starting point of the API endpoint (after host), all other URLs are derived from this value",
            type = AttributeType.STRING
    )
    String apiBase();

    @AttributeDefinition(
            name = "Max number of requests",
            description = "Max number of requests that can be included in one message to Akamai.",
            type = AttributeType.INTEGER
    )
    int chunkSize();

    @AttributeDefinition(
            name = "Delay",
            description = "How long (in seconds) is the Agent going to wait before actually sending the request to Akamai",
            type = AttributeType.LONG
    )
    long delay();

    @AttributeDefinition(
            name = "Allowed content types",
            description = "List of content types which we allow to be flushed on Akamai",
            type = AttributeType.STRING
    )
    String[] allowedContentTypes();

    @AttributeDefinition(
            name = "Allowed content paths",
            description = "List of content paths which we allow to be flushed on Akamai",
            type = AttributeType.STRING
    )
    String[] allowedContentPaths();

}
