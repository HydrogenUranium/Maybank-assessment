package com.positive.dhl.core.models;

import com.positive.dhl.core.injectors.InjectHomeProperty;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PathUtilService;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import javax.inject.Named;

@Model(adaptables = { Resource.class, SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class Video {

    @OSGiService
    @Required
    private PathUtilService pathUtilService;

    @OSGiService
    @Required
    private AssetUtilService assetUtilService;

    @ValueMapValue
    private String videoPath;

    private String mimeType;

    @ValueMapValue
    private String poster;

    @ValueMapValue
    private int maxWidth;

    @ValueMapValue
    private int maxHeight;

    @ValueMapValue
    private String align;

    @ValueMapValue
    @Default(booleanValues = false)
    private boolean controls;

    @ValueMapValue
    @Default(booleanValues = false)
    private boolean autoplay;

    @ValueMapValue
    @Default(booleanValues = false)
    private boolean loop;

    @ValueMapValue
    @Default(booleanValues = false)
    private boolean muted;

    @ValueMapValue
    @Default(booleanValues = false)
    private boolean fullWidth;

    @InjectHomeProperty
    @Named("video-unsupportedMessage")
    @Default(values = "Your browser does not support the video playback.")
    private String unsupportedMessage;

    @PostConstruct
    protected void init() {
        mimeType = assetUtilService.getMimeType(videoPath);
    }
}
