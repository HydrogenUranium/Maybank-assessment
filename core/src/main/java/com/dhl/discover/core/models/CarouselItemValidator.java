package com.dhl.discover.core.models;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Slf4j
@Getter
public class CarouselItemValidator {

    static final String PAGE_PATH="nodePath";

    @SlingObject
    private ResourceResolver resourceResolver;

    @Self
    private SlingHttpServletRequest slingRequest;

    @RequestAttribute
    private String nodePath;

    private boolean nodeExists;

    @PostConstruct
    protected void init() {
        //nodePath = (String) slingRequest.getAttribute(PAGE_PATH);
        if (nodePath != null && !nodePath.isEmpty()) {
            Resource resource = resourceResolver.getResource(nodePath);
            nodeExists = (resource != null);
        } else {
            nodeExists = false;
        }
    }

    public void setResourceResolver(ResourceResolver resourceResolver) {
        this.resourceResolver = resourceResolver;
    }
}
