package com.positive.dhl.core.helpers;

import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.osgi.service.cm.Configuration;
import org.osgi.service.cm.ConfigurationAdmin;

import java.io.IOException;
import java.util.Dictionary;

public class ConfigurationHelper {
    /**
     *
     */
    public static String GetEnvironmentProperty(ConfigurationAdmin configurationAdmin, String key, String defaultValue) {
        try {
            if (configurationAdmin != null) {
                Configuration config = configurationAdmin.getConfiguration("com.positive.dhl.core.components.impl.EnvironmentConfigurationImpl");
                if (config != null) {
                    Dictionary<String, Object> properties = config.getProperties();
                    return PropertiesUtil.toString(properties.get(key), defaultValue);
                }
            }

        } catch (IOException ignored) {

        }

        return defaultValue;
    }
}
