package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.policies.ContentPolicy;
import com.day.cq.wcm.api.policies.ContentPolicyManager;
import com.positive.dhl.core.injectors.InjectAsset;
import com.positive.dhl.core.services.PathUtilService;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class HeroBanner {
    @Inject
    @Required
    private Page currentPage;

    @Inject
    protected Resource resource;

    @Inject
    @Required
    private ResourceResolver resourceResolver;

    @OSGiService
    @Required
    private PathUtilService pathUtilService;

    @Inject
    @Getter
    private String summaryTitle;

    @ChildResource
    @Named("summaryPoints")
    private Resource pointsMultifield;

    @Getter
    private final List<String> points = new ArrayList<>();

    @InjectAsset
    @Getter
    private String mobileBackgroundImage;

    @InjectAsset
    @Getter
    private String tabletBackgroundImage;

    @InjectAsset
    @Getter
    private String desktopBackgroundImage;

    @Getter
    private boolean inheritImage;

    @Getter
    private boolean keyTakeaways;

    @Getter
    private boolean roundedCorners;

    @Getter
    private boolean margin;

    @PostConstruct
    protected void init() {
        initDesignProperties();
        if(keyTakeaways) {
            initTakeawaysFeature();
        }
        if(inheritImage) {
            initInheritedImage();
        }
    }

    private void initDesignProperties() {
        ValueMap properties = Optional.ofNullable(resourceResolver.adaptTo(ContentPolicyManager.class))
                .map(contentPolicyManager -> contentPolicyManager.getPolicy(resource))
                .map(ContentPolicy::getProperties).orElse(ValueMap.EMPTY);

        margin = properties.get("margin", false);
        inheritImage = properties.get("inheritImage", false);
        keyTakeaways = properties.get("keyTakeaways", false);
        roundedCorners = properties.get("roundedCorners", false);
    }

    private void initTakeawaysFeature() {
        if (pointsMultifield != null) {
            pointsMultifield.listChildren().forEachRemaining(item ->
                    points.add(item.getValueMap().get("text", ""))
            );
        }
    }

    private void initInheritedImage() {
        ValueMap props = currentPage.getProperties();

        mobileBackgroundImage = pathUtilService.resolveAssetPath(props.get("heroimagemob", ""));
        tabletBackgroundImage = pathUtilService.resolveAssetPath(props.get("heroimagetab", ""));
        desktopBackgroundImage = pathUtilService.resolveAssetPath(props.get("heroimagedt", ""));
    }
}
