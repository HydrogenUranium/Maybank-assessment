package com.positive.dhl.core.helpers;

import java.util.HashMap;
import java.util.Map;

public class OSGiConfigHelper {

    private OSGiConfigHelper() {
        throw new IllegalStateException("Utility class");
    }

    public static Map<String, String> arrayToMapWithDelimiter(String[] array, String delimiterRegex) {
        Map<String, String> map = new HashMap<>();

        for (String row : array) {
            String[] values = row.split(delimiterRegex);
            if (values.length == 2) {
                String key = values[0].trim();
                String value = values[1].trim();
                map.put(key, value);
            }
        }

        return map;
    }

    public static Map<String, String> arrayToMapWithDelimiter(String[] array) {
        return arrayToMapWithDelimiter(array, ":");
    }
}
