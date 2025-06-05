package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.designer.Style;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;

import javax.annotation.PostConstruct;
import java.util.List;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
        defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)

@Getter
public class CtaBannerV2 extends AdaptiveImage {

    @ScriptVariable
    protected Style currentStyle;

    @ValueMapValue
    private String summaryTitle;

    @ChildResource
    private List<Point> summaryPoints;

    @Self
    private Image defaultImageModel;

    @ValueMapValue
    private boolean useVideo;

    @ValueMapValue
    private String video;

    private String videoMimeType;

    private boolean keyTakeAways;

    @PostConstruct
    protected void init() {
        super.initModel();
        
        if (currentStyle != null) {
            keyTakeAways = currentStyle.get("keyTakeAways", false);
        }
        
        if (useVideo && StringUtils.isNoneBlank(video) && assetUtilService != null) {
            videoMimeType = assetUtilService.getMimeType(video);
        }
    }

    @Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
    @Getter
    public static class Point {
        @ValueMapValue
        private String text;
    }
}
