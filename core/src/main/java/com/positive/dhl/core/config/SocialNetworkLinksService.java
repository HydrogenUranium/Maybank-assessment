package com.positive.dhl.core.config;

public interface SocialNetworkLinksService {
    /**
     * Provides the JS available in the OSGi config
     * @return String with JS for inclusion in HEAD section of HTML-markup to initialize the Social Network Link UI
     */
    String getHeadCodeInclusion();

    /**
     * Provides the HTML-code available in the OSGi config
     * @return String with HTML-code for inclusion in HTML-markup where you’d like your Social Network Links to appear on your site
     */
    String getSocialNetworkLinksInclusion();
}
