package com.positive.dhl.core.models;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;

import javax.annotation.PostConstruct;

@Model(adaptables = SlingHttpServletRequest.class)
public class LinkChecker {
    @RequestAttribute
    @Optional
    private String linkPath;

    @Getter
    private boolean internalLink;

    @PostConstruct
    protected void init() {
        internalLink = StringUtils.isNoneBlank(linkPath) && linkPath.startsWith("/content");
    }
}
