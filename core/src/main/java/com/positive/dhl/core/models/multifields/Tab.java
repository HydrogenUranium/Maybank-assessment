package com.positive.dhl.core.models.multifields;

import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class Tab {

    @Inject
    private String image;

    @Inject
    private String title;

    @Inject
    private String body;

    private String id;

    @PostConstruct
    private void init(){
        id = title != null ? title.replaceAll("[^a-zA-Z0-9%]", "") : "";
    }
}
