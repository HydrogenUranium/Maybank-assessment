package com.dhl.discover.core.resource;


import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceWrapper;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.apache.sling.models.annotations.Exporter;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ExporterConstants;

/**
 * Resource wrapper allowing for the change of resource type, properties, and children.
 */
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME , extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CoreResourceWrapper extends ResourceWrapper {

    /**
     * The properties for this resource wrapper.
     */
    private final ValueMap valueMap;

    /**
     * The resource type for this resource.
     */
    private final String overriddenResourceType;


    /**
     * Construct a resource wrapper.
     *
     * @param resource The resource to be wrapped.
     * @param overriddenResourceType The new resource type.
     * @param hiddenProperties Properties to hide.
     * @param overriddenProperties Properties to add/override.
     */
    public CoreResourceWrapper(@NotNull final Resource resource,
                               @NotNull final String overriddenResourceType,
                               @Nullable final List<String> hiddenProperties,
                               @Nullable final Map<String, Object> overriddenProperties) {
        super(resource);
        if (StringUtils.isEmpty(overriddenResourceType)) {
            throw new IllegalArgumentException("The " + CoreResourceWrapper.class.getName() + " needs to override the resource type of " +
                    "the wrapped resource, but the resourceType argument was null or empty.");
        }
        this.overriddenResourceType = overriddenResourceType;
        HashMap<String, Object> properties = new HashMap<>(resource.getValueMap());
        properties.put(ResourceResolver.PROPERTY_RESOURCE_TYPE, overriddenResourceType);
        if (overriddenProperties != null) {
            properties.putAll(overriddenProperties);
        }
        if (hiddenProperties != null) {
            for (String property : hiddenProperties) {
                properties.remove(property);
            }
        }
        // wrapped to prevent external modification of the underlying map
        this.valueMap = new ValueMapDecorator(Collections.unmodifiableMap(properties));
    }

    @Override
    public <AdapterType> AdapterType adaptTo(Class<AdapterType> type) {
        if (type == ValueMap.class) {
            return (AdapterType) valueMap;
        }
        return super.adaptTo(type);
    }

    @Override
    @NotNull
    public ValueMap getValueMap() {
        return valueMap;
    }

    @Override
    @NotNull
    public String getResourceType() {
        return overriddenResourceType;
    }

    @Override
    public boolean isResourceType(String resourceType) {
        return this.getResourceResolver().isResourceType(this, resourceType);
    }
}
