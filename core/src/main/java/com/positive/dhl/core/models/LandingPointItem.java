package com.positive.dhl.core.models;

import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import java.util.UUID;

@Getter
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LandingPointItem {
	@ValueMapValue
    private String title;

    @ValueMapValue
    private String content;

	@ValueMapValue
	private String icon;


    private final String id = "landingPoint_" + UUID.randomUUID();

}