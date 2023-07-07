package com.positive.dhl.core.models;

import com.positive.dhl.core.config.SocialNetworkLinksService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

@Model(adaptables= SlingHttpServletRequest.class)
public class SocialNetworkLinksModel {

    @OSGiService
    private SocialNetworkLinksService socialNetworkLinksService;

    public String getHeadCodeInclusion() {
        return socialNetworkLinksService.getHeadCodeInclusion();
    }

    public String getSocialNetworkLinksInclusion() {
        return socialNetworkLinksService.getSocialNetworkLinksInclusion();
    }
}
