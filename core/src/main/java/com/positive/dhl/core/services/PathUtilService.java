package com.positive.dhl.core.services;

import com.adobe.cq.wcm.spi.AssetDelivery;
import com.day.cq.dam.api.Asset;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.mime.MimeTypeService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component(service = PathUtilService.class)
@Slf4j
public class PathUtilService {
    @Reference
    private AssetUtilService assetUtilService;

    @Reference(cardinality = ReferenceCardinality.OPTIONAL)
    @Getter
    protected AssetDelivery assetDelivery;

    @Reference
    protected MimeTypeService mimeTypeService;

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    private static final List<String> UNSUPPORTED_CHARACTERS = Arrays.asList(
            "(",
            ")",
            "'"
    );

    public String encodeUnsupportedCharacters(String path) {
        String encodedPath = StringUtils.EMPTY;
        try {
            encodedPath = new URI(null, null, path, null).toASCIIString();
            if (UNSUPPORTED_CHARACTERS.stream().anyMatch(encodedPath::contains)) {
                for (String character : UNSUPPORTED_CHARACTERS) {
                    encodedPath = encodedPath.replace(character, URLEncoder.encode(character, StandardCharsets.UTF_8.toString()));
                }
            }
        } catch (UnsupportedEncodingException | URISyntaxException ex) {
            log.error("An error occurred encoding URL path", ex);
        }

        return StringUtils.isBlank(encodedPath) ? path : encodedPath;
    }

    public String resolveAssetPath(String assetPath) {
        return resolveAssetPath(assetPath, false);
    }

    public String resolveAssetPath(String assetPath, boolean useWebOptimized) {
        return resolveAssetPath(assetPath, useWebOptimized, null);
    }

    public String resolveAssetPath(String assetPath, boolean useWebOptimized, Map<String, Object> props) {
        if(StringUtils.isBlank(assetPath)) {
            return StringUtils.EMPTY;
        }

        if (useWebOptimized && assetDelivery != null) {
            try(ResourceResolver resolver = resourceResolverHelper.getReadResourceResolver()) {
                Resource imageResource = resolver.getResource(assetPath);
                Asset asset = Optional.ofNullable(imageResource).map(resource -> resource.adaptTo(Asset.class)).orElse(null);
                if(imageResource != null && asset != null) {
                    String mimeType = PropertiesUtil.toString(asset.getMimeType(), "image/jpeg").split(";")[0];
                    String extension = mimeTypeService.getExtension(mimeType);

                    Map<String, Object> defaultProps = new HashMap<>(Map.of(
                            "quality", "82",
                            "path", asset.getPath(),
                            "seoname", encodeUnsupportedCharacters(asset.getName()),
                            "format", extension,
                            "preferwebp", "true"
                    ));
                    if(props != null) {
                        defaultProps.putAll(props);
                    }

                    return assetDelivery.getDeliveryURL(imageResource, defaultProps);
                }
            }
        }

        return assetUtilService.resolvePath(encodeUnsupportedCharacters(assetPath));
    }
}
