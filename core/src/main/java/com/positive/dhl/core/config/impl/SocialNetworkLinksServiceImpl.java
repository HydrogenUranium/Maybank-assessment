package com.positive.dhl.core.config.impl;

import com.positive.dhl.core.config.SocialNetworkLinksService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@Component(service = SocialNetworkLinksService.class, configurationPolicy = ConfigurationPolicy.OPTIONAL)
@Designate(ocd = SocialNetworkLinksServiceImpl.Config.class)
public class SocialNetworkLinksServiceImpl implements SocialNetworkLinksService {

    private Config config;

    @Activate
    @Modified
    public void activate(Config config) {
        this.config = config;
    }

    @Override
    public String getHeadCodeInclusion() {
        return config.headCodeInclusion();
    }

    @Override
    public String getSocialNetworkLinksInclusion() {
        return config.socialNetworkLinksInclusion();
    }

    @ObjectClassDefinition(
            name = "Social Network Links Configuration",
            description = "Contains code injections to include and use Social Network Links")
    @interface Config {
        @AttributeDefinition(name = "Script for HEAD section", description = "JavaScript for inclusion in HEAD section of HTML-markup to initialize the Social Network Link UI", type = AttributeType.STRING)
        String headCodeInclusion();

        @AttributeDefinition(name = "Markup for Social Network Links", description = "HTML-code for inclusion in HTML-markup where you’d like your Social Network Links to appear on your site", type = AttributeType.STRING)
        String socialNetworkLinksInclusion();
    }
}
