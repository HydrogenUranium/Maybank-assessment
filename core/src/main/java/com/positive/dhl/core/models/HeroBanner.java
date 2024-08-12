package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.positive.dhl.core.services.AssetUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class HeroBanner {

    @OSGiService
    @Required
    private AssetUtilService assetUtilService;

    @Inject
    @Required
    private Page currentPage;

    @ScriptVariable
    protected Style currentStyle;

    @Inject
    private String summaryTitle;

    @ChildResource
    @Named("summaryPoints")
    private Resource pointsMultifield;

    private final List<String> points = new ArrayList<>();

    @Inject
    private String mobileBackgroundImage;

    @Inject
    private String tabletBackgroundImage;

    @Inject
    private String desktopBackgroundImage;

    @Inject
    private String backgroundImageAltText;

    @Inject
    private boolean useVideo;

    @Inject
    private String video;

    private String videoMimeType;

    private boolean inheritImage;
    private boolean keyTakeaways;
    private boolean roundedCorners;
    private boolean margin;
    private boolean enableAssetDelivery;

    @PostConstruct
    protected void init() {
        initDesignProperties();
        if(keyTakeaways) {
            initTakeawaysFeature();
        }
        if(inheritImage) {
            initInheritedImage();
        }
        if(useVideo && StringUtils.isNotBlank(video)) {
            videoMimeType = assetUtilService.getMimeType(video);
        }
    }

    private void initDesignProperties() {
        margin = currentStyle.get("margin", false);
        inheritImage = currentStyle.get("inheritImage", false);
        keyTakeaways = currentStyle.get("keyTakeaways", false);
        roundedCorners = currentStyle.get("roundedCorners", false);
        enableAssetDelivery = currentStyle.get("enableAssetDelivery", false);
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

        mobileBackgroundImage = props.get("heroimagemob", "");
        tabletBackgroundImage = props.get("heroimagetab", "");
        desktopBackgroundImage = props.get("heroimagedt", "");
        backgroundImageAltText = props.get("heroimageAltText", summaryTitle);
    }

    public String getBackgroundImageAltText() {
        return StringUtils.defaultIfBlank(backgroundImageAltText, summaryTitle);
    }
}
