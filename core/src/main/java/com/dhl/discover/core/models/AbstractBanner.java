package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dhl.discover.core.services.AssetUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.apache.sling.models.factory.ModelFactory;
import org.osgi.annotation.versioning.ConsumerType;
import java.util.UUID;

/**
 * Abstract base class for Banner components that provides common functionality
 */

@ConsumerType
@Getter
public abstract class AbstractBanner {

    @OSGiService
    @Optional
    protected ModelFactory modelFactory;

    @Self
    protected SlingHttpServletRequest request;

    @ScriptVariable
    @Optional
    protected Page currentPage;

    @ScriptVariable
    @Optional
    protected Style currentStyle;

    @OSGiService
    @Optional
    protected AssetUtilService assetUtilService;

    @ValueMapValue
    @Optional
    protected String title;

    @ChildResource
    @Optional
    protected Resource desktopImage;

    @ChildResource
    @Optional
    protected Resource mobileImage;

    @ChildResource
    @Optional
    protected Resource tabletImage;

    @ValueMapValue
    @Optional
    protected String desktopBackgroundImage;

    @ValueMapValue
    @Optional
    protected String mobileBackgroundImage;

    @ValueMapValue
    @Optional
    protected String tabletBackgroundImage;

    @ValueMapValue
    @Optional
    protected String buttonName;

    @ValueMapValue
    @Optional
    protected String buttonLink;

    protected final String id = "cta-banner_" + UUID.randomUUID();

    protected Image mobileImageModel;
    protected Image tabletImageModel;
    protected Image desktopImageModel;

    protected boolean roundedCorners;
    protected boolean margin;
    protected boolean enableAssetDelivery;

    /**
     * Common initialization for banner components.
     * Should be called from the init() method of subclasses.
     */
    protected void initBase() {
        if (currentStyle != null) {
            initDesignProperties();
        }
        initImageModels();
    }

    /**
     * Initialize design-related properties from the component's style
     */
    protected void initDesignProperties() {
        margin = currentStyle.get("margin", false);
        roundedCorners = currentStyle.get("roundedCorners", false);
        enableAssetDelivery = currentStyle.get("enableAssetDelivery", false);
    }

    /**
     * Initialize image models based on resource references
     */
    protected void initImageModels() {
        mobileImageModel = getImageModel(mobileImage);
        tabletImageModel = getImageModel(tabletImage);
        desktopImageModel = getImageModel(desktopImage);
    }

    /**
     * Create an Image model from a resource
     * @param resource The image resource
     * @return Image model if resource has a file reference, null otherwise
     */
    protected Image getImageModel(Resource resource) {
        if (!hasFileReference(resource)) {
            return null;
        }
        return modelFactory != null ? 
            modelFactory.createModelFromWrappedRequest(request, resource, Image.class) : null;
    }

    /**
     * Check if a resource has a file reference
     * @param resource The resource to check
     * @return true if the resource has a file reference, false otherwise
     */
    protected boolean hasFileReference(Resource resource) {
        return resource != null && StringUtils.isNotBlank(resource.getValueMap().get("fileReference", String.class));
    }
}
