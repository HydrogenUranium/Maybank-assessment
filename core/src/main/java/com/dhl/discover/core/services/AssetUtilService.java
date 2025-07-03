package com.dhl.discover.core.services;

import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.dam.api.RenditionPicker;
import com.dhl.discover.core.dam.RenditionPatternPicker;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.mime.MimeTypeService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import static com.adobe.cq.wcm.core.components.models.Page.NN_PAGE_FEATURED_IMAGE;
import static com.day.cq.commons.DownloadResource.PN_REFERENCE;
import static com.day.cq.dam.api.DamConstants.DC_DESCRIPTION;

@Component(service = AssetUtilService.class)
@Slf4j
public class AssetUtilService {

    public static final String DEFAULT_DELIVERY_QUALITY = "82";
    public static final RenditionPicker THUMBNAIL_RENDITION = new RenditionPatternPicker("cq5dam.thumbnail.140.100.png");
    public static final RenditionPicker WEB_RENDITION = new RenditionPatternPicker("cq5dam.web.1280.1280");

    @Reference
    protected MimeTypeService mimeTypeService;

    @Reference
    protected PathUtilService pathUtilService;

    @Reference
    protected PageUtilService pageUtilService;

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

        try(var resolver = resourceResolverHelper.getReadResourceResolver()) {
            var imageResource = getAssetResource(assetPath, resolver);
            var asset = adaptToAsset(imageResource);
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

    public Asset getAsset(String assetPath, ResourceResolver resolver) {
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
            var rendition = asset.getRendition(THUMBNAIL_RENDITION);
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
        try(var resourceResolver = resourceResolverHelper.getReadResourceResolver()) {
            return Optional.ofNullable(resourceResolver)
                    .map(resolver -> resolver.getResource(path))
                    .map(resource -> resource.adaptTo(Asset.class))
                    .map(func)
                    .orElse("");
        }
    }

    private String getPageFeaturedImage(Resource resource) {
        return Optional.ofNullable(resource)
                .map(res -> pageUtilService.getPage(res))
                .map(page -> page.getContentResource(	NN_PAGE_FEATURED_IMAGE))
                .map(featuredImageResource -> featuredImageResource.adaptTo(ValueMap.class))
                .map(properties -> properties.get(PN_REFERENCE, String.class))
                .orElse(StringUtils.EMPTY);
    }

    private String getPageFeaturedImageAltText(Resource resource) {
        return Optional.ofNullable(resource)
                .map(res -> pageUtilService.getPage(res))
                .map(page -> page.getContentResource(	NN_PAGE_FEATURED_IMAGE))
                .map(featuredImageResource -> featuredImageResource.adaptTo(ValueMap.class))
                .map(properties -> !Boolean.parseBoolean(properties.get("altValueFromDAM", StringUtils.EMPTY))
                            ? properties.get("alt", StringUtils.EMPTY)
                            : Optional.ofNullable(properties.get(PN_REFERENCE, String.class))
                            .map(imagePath -> getAssetResource(imagePath, resource.getResourceResolver()))
                            .map(this::adaptToAsset)
                            .map(a -> a.getMetadataValue(DC_DESCRIPTION))
                            .orElse(StringUtils.EMPTY))
                .orElse(StringUtils.EMPTY);
    }

    public String getPageImagePath(Resource resource) {
        return getPageFeaturedImage(resource);
    }

    public String getPageImageAltText(Resource resource) {
        return getPageFeaturedImageAltText(resource);
    }

    /**
     * Converts an asset to a Base64-encoded JPEG string.
     *
     * @param asset the asset to convert
     * @return Base64-encoded JPEG string or null if conversion fails
     */
    public String getBase64(Asset asset) {
        if (asset == null) {
            return null;
        }

        var rendition = asset.getRendition(WEB_RENDITION);
        try (var inputStream = rendition.getStream();
             var outputStream = new ByteArrayOutputStream()) {

            BufferedImage image = ImageIO.read(inputStream);
            if (image == null) {
                log.warn("Unsupported or corrupt image format.");
                return null;
            }

            var rgbImage = new BufferedImage(
                    image.getWidth(),
                    image.getHeight(),
                    BufferedImage.TYPE_INT_RGB
            );

            // Paint the original image onto the new RGB image (drops alpha)
            Graphics2D g = rgbImage.createGraphics();
            g.drawImage(image, 0, 0, Color.WHITE, null);
            g.dispose();

            boolean success = ImageIO.write(rgbImage, "jpg", outputStream);
            if (!success) {
                log.warn("Failed to encode image to JPEG");
                return null;
            }

            // Encode to Base64
            byte[] jpegBytes = outputStream.toByteArray();
            return "data:image/jpeg;base64," + Base64.encodeBase64String(jpegBytes);

        } catch (Exception e) {
            log.error("Error while converting asset to Base64 JPEG: {}", e.getMessage(), e);
            return null;
        }
    }
}
