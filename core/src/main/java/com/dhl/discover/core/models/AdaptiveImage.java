package com.dhl.discover.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.AssetUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.apache.sling.models.factory.ModelFactory;

import javax.annotation.PostConstruct;

/**
 * Abstract base class for Image components that provides common functionality to inherit Image features
 */

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
@Getter
public class AdaptiveImage {

    @OSGiService
    protected ModelFactory modelFactory;

    @Self
    protected SlingHttpServletRequest request;

    @ScriptVariable
    protected Page currentPage;

    @OSGiService
    protected AssetUtilService assetUtilService;

    @ChildResource
    protected Resource desktopImage;

    @ChildResource
    protected Resource mobileImage;

    @ChildResource
    protected Resource tabletImage;

    @Self
    private Image defaultImageModel;

    protected Image mobileImageModel;
    protected Image tabletImageModel;
    protected Image desktopImageModel;

    @PostConstruct
    protected void initialize() {
        initImageModels();
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
