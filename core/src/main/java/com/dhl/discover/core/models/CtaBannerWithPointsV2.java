package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import javax.inject.Named;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CtaBannerWithPointsV2 extends AbstractBanner {

    @ChildResource
    @Named("points")
    @Optional
    private Resource pointsMultifield;

    @Getter
    private List<String> points = new ArrayList<>();

    @PostConstruct
    protected void init() {
        super.initBase();
        points = extractPoints(pointsMultifield);
    }

    List<String> extractPoints(Resource pointsMultifield) {
        List<String> list = new ArrayList<>();
        if (pointsMultifield == null) {
            return list;
        }

        Iterator<Resource> multifieldItems = pointsMultifield.listChildren();
        while (multifieldItems.hasNext()) {
            var properties = multifieldItems.next().getValueMap();
            list.add(properties.get("text", ""));
        }
        return list;
    }
}
