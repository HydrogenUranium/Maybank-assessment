package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.AssetUtilService;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.apache.sling.models.factory.ModelFactory;

import javax.annotation.PostConstruct;
import java.util.List;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class HeroBannerV2 {

    @OSGiService
    private ModelFactory modelFactory;

    @Self
    private SlingHttpServletRequest request;

    @OSGiService
    @Required
    @Getter(AccessLevel.NONE)
    private AssetUtilService assetUtilService;

    @ScriptVariable
    @Required
    @Getter(AccessLevel.NONE)
    private Page currentPage;

    @ScriptVariable
    @Getter(AccessLevel.NONE)
    protected Style currentStyle;

    @ValueMapValue
    private String summaryTitle;

    @ChildResource
    private List<Point> summaryPoints;

    @ChildResource
    private Resource desktopImage;

    @ChildResource
    private Resource mobileImage;

    @ChildResource
    private Resource tabletImage;

    @Self
    private Image defaultImageModel;
    private Image mobileImageModel;
    private Image tabletImageModel;
    private Image desktopImageModel;

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
        initDesignProperties();
        if(!useVideo) {
            initImageModels();
        }
        if(useVideo && StringUtils.isNotBlank(video)) {
            videoMimeType = assetUtilService.getMimeType(video);
        }
    }

    private void initImageModels() {
        mobileImageModel = getImageModel(mobileImage);
        tabletImageModel = getImageModel(tabletImage);
        desktopImageModel = getImageModel(desktopImage);
    }

    private void initDesignProperties() {
        margin = currentStyle.get("margin", false);
        keyTakeaways = currentStyle.get("keyTakeaways", false);
        roundedCorners = currentStyle.get("roundedCorners", false);
        enableAssetDelivery = currentStyle.get("enableAssetDelivery", false);
    }

    private Image getImageModel(Resource resource) {
        if (!hasFileReference(resource)) {
            return null;
        }
        return modelFactory.createModelFromWrappedRequest(request, resource, Image.class);
    }

    private boolean hasFileReference(Resource resource) {
        return resource != null &&
                StringUtils.isNotBlank(resource.getValueMap().get("fileReference", String.class));
    }

    @Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
    @Getter
    public static class Point{
        @ValueMapValue
        private String text;
    }

}
