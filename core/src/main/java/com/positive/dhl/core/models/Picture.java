package com.positive.dhl.core.models;

import com.adobe.cq.wcm.spi.AssetDelivery;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PathUtilService;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;

import javax.annotation.PostConstruct;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class Picture {
    @OSGiService(injectionStrategy = InjectionStrategy.REQUIRED)
    protected AssetUtilService assetUtilService;

    @OSGiService(injectionStrategy = InjectionStrategy.REQUIRED)
    protected PathUtilService pathUtilService;

    @OSGiService(
            injectionStrategy = InjectionStrategy.OPTIONAL
    )
    protected AssetDelivery assetDelivery;

    @RequestAttribute
    protected String image;

    @RequestAttribute
    protected String desktopImage;

    @RequestAttribute
    protected String tabletImage;

    @RequestAttribute
    protected String mobileImage;

    @Default(booleanValues = false)
    @RequestAttribute
    protected boolean useWebOptimized;

    @Default(booleanValues = false)
    @RequestAttribute
    protected boolean forceMap;

    protected List<Map.Entry<String, String>> images = new ArrayList<>();
    protected List<Map.Entry<String, String>> mobileImages = new ArrayList<>();
    protected List<Map.Entry<String, String>> tabletImages = new ArrayList<>();
    protected List<Map.Entry<String, String>> desktopImages = new ArrayList<>();
    protected String alt;

    @PostConstruct
    protected void init() {
        initDefaultImage();
    }

    protected void initDefaultImage() {
        if(image == null) {
            image = StringUtils.firstNonBlank(mobileImage, desktopImage, tabletImage);
        }
        alt = assetUtilService.getAltText(image);

        images = getImageWithMimeType(image, useWebOptimized);
        mobileImages = getImageWithMimeType(mobileImage, useWebOptimized);
        tabletImages = getImageWithMimeType(tabletImage, useWebOptimized);
        desktopImages = getImageWithMimeType(desktopImage, useWebOptimized);

        if(forceMap) {
            image = pathUtilService.map(image);
            mobileImage = pathUtilService.map(mobileImage);
            tabletImage = pathUtilService.map(tabletImage);
            desktopImage = pathUtilService.map(desktopImage);
        }
    }

    protected boolean isInternalAsset(String path) {
        return path.startsWith("/content/dam");
    }

    protected List<Map.Entry<String, String>> getImageWithMimeType(String assetPath, boolean useWebOptimized) {
        if(assetPath == null) {
            return new ArrayList<>();
        }
        return useWebOptimized && isInternalAsset(assetPath) && assetDelivery != null
                ? getOptimizedImagesWithMimeTypes(assetPath)
                : getImageWithMimeType(assetPath);
    }

    protected List<Map.Entry<String, String>> getImageWithMimeType(String assetPath) {
        return List.of(new AbstractMap.SimpleEntry<>(assetPath, assetUtilService.getMimeType(assetPath)));
    }

    protected List<Map.Entry<String, String>> getOptimizedImagesWithMimeTypes(String assetPath) {
        String webpImage = assetUtilService.getDeliveryURL(assetPath, assetDelivery);
        String defaultImage = assetUtilService.getDeliveryURL(assetPath, Map.of("preferwebp", "false"), assetDelivery);
        if(forceMap) {
            webpImage = pathUtilService.map(webpImage);
            defaultImage = pathUtilService.map(defaultImage);
        }

        return List.of(
                new AbstractMap.SimpleEntry<>(webpImage, "image/webp"),
                new AbstractMap.SimpleEntry<>(defaultImage, assetUtilService.getMimeType(assetPath))
        );
    }
}
