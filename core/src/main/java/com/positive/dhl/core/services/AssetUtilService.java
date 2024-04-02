package com.positive.dhl.core.services;

import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.mime.MimeTypeService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Component(service = AssetUtilService.class)
@Slf4j
public class AssetUtilService {

    public static final String DEFAULT_DELIVERY_QUALITY = "82";

    protected AssetDelivery assetDelivery;

    @Reference(cardinality = ReferenceCardinality.OPTIONAL, policy = ReferencePolicy.DYNAMIC)
    public synchronized void bindAssetDelivery(AssetDelivery assetDelivery) {
        this.assetDelivery = assetDelivery;
    }

    public synchronized void unbindAssetDelivery(AssetDelivery assetDelivery) {
        this.assetDelivery = null;
    }

    @Reference
    protected MimeTypeService mimeTypeService;

    @Reference
    protected PathUtilService pathUtilService;

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    public String getMappedDeliveryUrl(String assetPath, Map<String, Object> props) {
        return pathUtilService.map(getDeliveryURL(assetPath, props));
    }


    public String getDeliveryURL(String assetPath) {
        return getDeliveryURL(assetPath, null);
    }

    public String getDeliveryURL(String assetPath, Map<String, Object> props) {
        if(StringUtils.isBlank(assetPath)) {
            log.debug("Path is empty, return empty resolved path");
            return StringUtils.EMPTY;
        }

        if (assetDelivery == null) {
            log.debug("Image is not optimized because assetDelivery is not injected");
            return assetPath;
        }

        try(ResourceResolver resolver = resourceResolverHelper.getReadResourceResolver()) {
            Resource imageResource = resolver.getResource(pathUtilService.decodePath(assetPath));
            Asset asset = Optional.ofNullable(imageResource).map(resource -> resource.adaptTo(Asset.class)).orElse(null);
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
                .map(name -> name.replaceAll("[^a-zA-Z0-9%]", ""))
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
