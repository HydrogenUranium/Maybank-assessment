package com.dhl.discover.core.services;

import com.dhl.discover.core.components.EnvironmentConfiguration;
import com.dhl.discover.core.utils.RequestUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URL;
import java.net.MalformedURLException;
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
    private EnvironmentConfiguration environmentConfiguration;

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
            log.error("An error occurred encoding URL path: {}", ex.getMessage());
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

    public boolean isExternalLink(String link) {
        try {
            var uri = new URI(link);

            String host = uri.getHost();

            if (host == null || host.isEmpty()) {
                return false;
            }

            host = removeWwwPrefix(host);
            var envHostname = removeWwwPrefix(environmentConfiguration.getAkamaiHostname());

            return !host.equals(envHostname);
        } catch (URISyntaxException e) {
            return false;
        }
    }

    private static String removeWwwPrefix(String domain) {
        if (domain.startsWith("www.")) {
            return domain.substring(4);
        }
        return domain;
    }
}
