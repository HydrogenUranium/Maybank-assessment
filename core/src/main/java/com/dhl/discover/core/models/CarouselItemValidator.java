package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class CarouselItemValidator {
    private static final String GHOST_RESOURCE_TYPE = "wcm/msm/components/ghost";

    @SlingObject
    private ResourceResolver resourceResolver;

    @RequestAttribute
    private Resource resource;

    protected boolean isPathExist(String nodePath) {
        if(StringUtils.isBlank(nodePath)) {
            return false;
        }
        var pageResource = resourceResolver.getResource(nodePath);
        return pageResource != null;
    }

    public boolean isValid() {
        if(resource == null) {
            return false;
        }
        var isGhost = GHOST_RESOURCE_TYPE.equals(resource.getResourceType());
        var isTeaserExist = isPathExist(resource.getValueMap().get("linkURL", ""));

        return !isGhost && isTeaserExist;
    }
}
