package com.positive.dhl.core.helpers;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameter;

import java.util.List;

public class RequestHelpers {
    /**
     *
     */
    public static String GetRequestValue(SlingHttpServletRequest request, String name) {
        return RequestHelpers.GetRequestValue(request, name, "");
    }

    /**
     *
     */
    public static String GetRequestValue(SlingHttpServletRequest request, String name, String defaultValue) {
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
