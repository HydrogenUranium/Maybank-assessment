package com.dhl.discover.core.services.schema;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;

import java.util.Arrays;

public abstract class AbstractSchemaAdapter implements SchemaAdapter {

    protected boolean hasFields(Resource resource, String... names) {
        if(resource == null) {
            return false;
        }

        var properties = resource.getValueMap();
        return Arrays.stream(names).allMatch(s -> StringUtils.isNotBlank(properties.get(s, "")));
    }
}
