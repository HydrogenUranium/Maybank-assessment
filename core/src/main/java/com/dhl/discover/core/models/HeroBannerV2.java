package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.AssetUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;

import javax.annotation.PostConstruct;
import java.util.List;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class HeroBannerV2 extends AdaptiveImage {
    @OSGiService
    protected AssetUtilService assetUtilService;

    @ValueMapValue
    private String summaryTitle;

    @ScriptVariable
    protected Style currentStyle;

    @ChildResource
    private List<Point> summaryPoints;

    @Self
    private Image defaultImageModel;

    @ValueMapValue
    private boolean useVideo;

    @ValueMapValue
    private String video;

    private String videoMimeType;
    private boolean keyTakeaways;
    private boolean roundedCorners;
    private boolean margin;
    private boolean enableAssetDelivery;

    @PostConstruct
    protected void init() {
        if (currentStyle != null) {
            initDesignProperties();
        }

        if (useVideo && StringUtils.isNoneBlank(video) && assetUtilService != null) {
            videoMimeType = assetUtilService.getMimeType(video);
        }
    }

    private void initDesignProperties() {
        margin = currentStyle.get("margin", false);
        keyTakeaways = currentStyle.get("keyTakeaways", false);
        roundedCorners = currentStyle.get("roundedCorners", false);
        enableAssetDelivery = currentStyle.get("enableAssetDelivery", false);
    }

    @Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
    @Getter
    public static class Point{
        @ValueMapValue
        private String text;
    }

}