package com.positive.dhl.core.injectors;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.spi.Injector;

public abstract class AbstractInjector implements Injector {
    protected Resource getResource(Object adaptable) {
        if (adaptable instanceof Resource) {
            return (Resource) adaptable;
        } else if (adaptable instanceof SlingHttpServletRequest) {
            return ((SlingHttpServletRequest) adaptable).getResource();
        }

        return null;
    }
}
