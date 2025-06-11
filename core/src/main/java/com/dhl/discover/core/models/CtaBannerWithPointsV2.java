package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import java.util.List;

@Getter
@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CtaBannerWithPointsV2 extends AdaptiveImage {

    @ChildResource
    private List<Point> points;

    @ValueMapValue
    protected String buttonName;

    @ValueMapValue
    protected String buttonLink;

    @PostConstruct
    protected void init() {
        super.initModel();
    }

    @Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
    @Getter
    public static class Point{
        @ValueMapValue
        private String text;
    }
}
