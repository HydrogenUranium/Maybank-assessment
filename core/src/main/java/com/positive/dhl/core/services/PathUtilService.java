package com.positive.dhl.core.services;

import com.positive.dhl.core.utils.RequestUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Component(service = PathUtilService.class)
@Slf4j
public class PathUtilService {

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    private static final List<String> UNSUPPORTED_CHARACTERS = Arrays.asList(
            "(",
            ")",
            "'"
    );

    public String encodeUnsupportedCharacters(String path) throws UnsupportedEncodingException {
        if (UNSUPPORTED_CHARACTERS.stream().anyMatch(path::contains)) {
            for (String character : UNSUPPORTED_CHARACTERS) {
                path = path.replace(character, URLEncoder.encode(character, StandardCharsets.UTF_8.toString()));
            }
        }
        return path;
    }

    public String encodePath(String path) {
        String encodedPath = StringUtils.EMPTY;
        try {
            encodedPath = new URI(null, null, path, null).toASCIIString();
            encodedPath = encodeUnsupportedCharacters(encodedPath);
        } catch (UnsupportedEncodingException | URISyntaxException ex) {
            log.error("An error occurred encoding URL path", ex);
        }

        return StringUtils.isBlank(encodedPath) ? path : encodedPath;
    }

    public String decodePath(String path) {
        return URLDecoder.decode(path, StandardCharsets.UTF_8);
    }

    public String map(String path) {
        if(path == null) {
            return null;
        }
        try (var resolver = resourceResolverHelper.getReadResourceResolver()) {
            return encodeUnsupportedCharacters(resolver.map(decodePath(path)));
        } catch (UnsupportedEncodingException e) {
            log.error("An error occurred encoding URL path", e);
            return path;
        }
    }

    public String getFullMappedPath(String path, SlingHttpServletRequest request) {
        if(path == null) {
            return null;
        }
        return RequestUtils.getUrlPrefix(request) + map(path);
    }
}
