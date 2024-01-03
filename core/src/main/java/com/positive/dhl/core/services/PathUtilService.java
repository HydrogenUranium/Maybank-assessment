package com.positive.dhl.core.services;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Component(service = PathUtilService.class)
@Slf4j
public class PathUtilService {
    @Reference
    private AssetUtilService assetUtilService;

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
        return StringUtils.isNoneBlank(assetPath) ? assetUtilService.resolvePath(encodeUnsupportedCharacters(assetPath)) : StringUtils.EMPTY;
    }
}
