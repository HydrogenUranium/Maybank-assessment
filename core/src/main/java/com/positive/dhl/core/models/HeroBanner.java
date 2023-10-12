package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.AssetUtilService;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class HeroBanner {
    @Inject
    @Required
    private Page currentPage;

    @OSGiService
    @Required
    private AssetUtilService assetUtils;

    @Inject
    @Getter
    private String summaryTitle;

    @ChildResource
    @Named("summaryPoints")
    private Resource pointsMultifield;

    @Getter
    private final List<String> points = new ArrayList<>();

    @Getter
    private String mobileBackgroundImage;

    @Getter
    private String tabletBackgroundImage;

    @Getter
    private String desktopBackgroundImage;

    @Getter
    private final String id = "hero_" + UUID.randomUUID();

    @PostConstruct
    protected void init() {
        if (pointsMultifield != null) {
            Iterator<Resource> multifieldItems = pointsMultifield.listChildren();
            while (multifieldItems.hasNext()) {
                var properties = multifieldItems.next().getValueMap();
                String text = properties.get("text", "");
                points.add(text);
            }
        }
        ValueMap props = currentPage.getProperties();

        String defaultMobileBackgroundImage = props.get("heroimagemob", "");
        mobileBackgroundImage = assetUtils.resolvePath(defaultMobileBackgroundImage);

        String defaultTabletBackgroundImage = props.get("heroimagetab", "");
        tabletBackgroundImage = assetUtils.resolvePath(defaultTabletBackgroundImage);

        String defaultDesktopBackgroundImage = props.get("heroimagedt", "");
        desktopBackgroundImage = assetUtils.resolvePath(defaultDesktopBackgroundImage);
    }
}
