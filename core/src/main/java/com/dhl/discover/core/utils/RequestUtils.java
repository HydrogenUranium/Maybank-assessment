package com.dhl.discover.core.utils;

import lombok.experimental.UtilityClass;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.Resource;

import javax.jcr.Session;
import java.util.List;

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

    public static String getRequestValue(SlingHttpServletRequest request, String name) {
        return getRequestValue(request, name, "");
    }

    public static String getRequestValue(SlingHttpServletRequest request, String name, String defaultValue) {
        if (request != null) {
            List<RequestParameter> params = request.getRequestParameterList();
            for (RequestParameter param : params) {
                if (name.equals(param.getName())) {
                    return param.getString();
                }
            }
        }
        return defaultValue;
    }
}
