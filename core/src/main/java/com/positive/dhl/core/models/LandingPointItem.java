package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectAsset;
import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.util.UUID;

@Getter
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LandingPointItem {
	@Inject
    private String title;

    @Inject
    private String content;

	@InjectAsset
	private String icon;


    private final String id = "landingPoint_" + UUID.randomUUID();

}