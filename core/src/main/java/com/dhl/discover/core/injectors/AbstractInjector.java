package com.dhl.discover.core.injectors;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.spi.Injector;

public abstract class AbstractInjector implements Injector {
    protected Resource getResource(Object adaptable) {
        if (adaptable instanceof Resource resource) {
            return resource;
        } else if (adaptable instanceof SlingHttpServletRequest request) {
            return request.getResource();
        }

        return null;
    }
}
