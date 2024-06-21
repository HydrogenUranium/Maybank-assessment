package com.positive.dhl.core.utils;

import lombok.experimental.UtilityClass;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;

import javax.jcr.Session;

@UtilityClass
public class RequestUtils {

    public static String getUrlPrefix(SlingHttpServletRequest request) {
        var url = new StringBuilder(request.getScheme());
        url.append("://");
        url.append(request.getServerName());

        int port = request.getServerPort();
        if (!(port == 80 || port == 443)) {
            url.append(":");
            url.append(port);
        }
        url.append(request.getContextPath());
        return url.toString();
    }

    public static Resource getResource(SlingHttpServletRequest request) {
        var resourceResolver = request.getResourceResolver();
        return resourceResolver.resolve(request.getPathInfo());
    }

    public static Session getSession(SlingHttpServletRequest request) {
        return request.getResourceResolver().adaptTo(Session.class);
    }
}
