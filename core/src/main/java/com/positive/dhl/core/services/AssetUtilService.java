package com.positive.dhl.core.services;

import com.adobe.acs.commons.dam.RenditionPatternPicker;
import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.dam.api.Rendition;
import com.day.cq.dam.api.RenditionPicker;
import com.day.cq.wcm.api.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.mime.MimeTypeService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Component(service = AssetUtilService.class)
@Slf4j
public class AssetUtilService {

    public static final String DEFAULT_DELIVERY_QUALITY = "82";
    public static final RenditionPicker THUMBNAIL_PICKER = new RenditionPatternPicker("cq5dam.thumbnail.140.100.png");

    @Reference
    protected MimeTypeService mimeTypeService;

    @Reference
    protected PathUtilService pathUtilService;

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    public String getMappedDeliveryUrl(String assetPath, Map<String, Object> props, AssetDelivery assetDelivery) {
        return pathUtilService.map(getDeliveryURL(assetPath, props, assetDelivery));
    }


    public String getDeliveryURL(String assetPath, AssetDelivery assetDelivery) {
        return getDeliveryURL(assetPath, null, assetDelivery);
    }

    public String getDeliveryURL(String assetPath, Map<String, Object> props, AssetDelivery assetDelivery) {
        if(StringUtils.isBlank(assetPath)) {
            log.debug("Path is empty, return empty resolved path");
            return StringUtils.EMPTY;
        }

        if (assetDelivery == null) {
            log.debug("Image is not optimized because assetDelivery is not injected");
            return assetPath;
        }

        try(ResourceResolver resolver = resourceResolverHelper.getReadResourceResolver()) {
            Resource imageResource = getAssetResource(assetPath, resolver);
            Asset asset = adaptToAsset(imageResource);
            if(asset != null) {
                Map<String, Object> defaultProps = getDefaultProperties(asset);

                if(props != null) {
                    defaultProps.putAll(props);
                }
                String deliveryUrl = assetDelivery.getDeliveryURL(imageResource, defaultProps);

                return deliveryUrl != null ? deliveryUrl : assetPath;
            } else {
                log.error("Failed to optimize image because of image: {} and asset: {}.", imageResource, asset);
            }
        } catch(Exception e) {
            log.error("Failed to optimize image", e);
        }

        return assetPath;
    }

    private Resource getAssetResource(String assetPath, ResourceResolver resolver) {
        if(null == assetPath) {
            return null;
        }
        return resolver.getResource(pathUtilService.decodePath(assetPath));
    }

    private Asset getAsset(String assetPath, ResourceResolver resolver) {
        return adaptToAsset(getAssetResource(assetPath, resolver));
    }

    private Asset adaptToAsset(Resource imageResource) {
        return Optional.ofNullable(imageResource).map(resource -> resource.adaptTo(Asset.class)).orElse(null);
    }

    public String getThumbnailLink(String assetPath) {
        try(var resolver = resourceResolverHelper.getReadResourceResolver()) {
            var asset = getAsset(assetPath, resolver);
            if(asset == null) {
                return "";
            }
            var rendition = asset.getRendition(THUMBNAIL_PICKER);
            return pathUtilService.map(rendition.getPath());
        }
    }

    private Map<String, Object> getDefaultProperties(Asset asset){
        String mimeType = PropertiesUtil.toString(asset.getMimeType(), "image/jpeg").split(";")[0];
        String extension = mimeTypeService.getExtension(mimeType);
        return new HashMap<>(Map.of(
                "quality", DEFAULT_DELIVERY_QUALITY,
                "path", asset.getPath(),
                "seoname", getSeoName(asset),
                "format", extension,
                "preferwebp", "true"
        ));
    }

    private String getSeoName(Asset asset) {
        return Optional.of(asset)
                .map(Asset::getName)
                .map(FilenameUtils::removeExtension)
                .map(pathUtilService::encodePath)
                .map(name -> name.replaceAll("[^a-zA-Z0-9%\\-]", ""))
                .orElse("");
    }

    public String getMimeType(String path) {
        return getAssetInfo(path, Asset::getMimeType);
    }

    public String getAltText(String path) {
        return getAssetInfo(path, asset -> asset.getMetadataValue(DamConstants.DC_DESCRIPTION));
    }

    private String getAssetInfo(String path, Function<Asset, String> func) {
        try(ResourceResolver resourceResolver = resourceResolverHelper.getReadResourceResolver()) {
            return Optional.ofNullable(resourceResolver)
                    .map(resolver -> resolver.getResource(path))
                    .map(resource -> resource.adaptTo(Asset.class))
                    .map(func)
                    .orElse("");
        }
    }
}
