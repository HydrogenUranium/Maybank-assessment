package com.positive.dhl.core.utils;

import lombok.experimental.UtilityClass;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.AbstractMap;

@UtilityClass
public class OSGiConfigUtils {

    public static final String DEFAULT_DELIMITER = ":";

    public static Map<String, String> arrayToMapWithDelimiter(String[] array, String delimiterRegex) {
        Map<String, String> map = new HashMap<>();

        for (String row : array) {
            var entry = getEntry(row, delimiterRegex);
            if (entry != null) {
                map.put(entry.getKey(), entry.getValue());
            }
        }

        return map;
    }

    public static Set<Map.Entry<String, String>> arrayToEntrySetWithDelimiter(String[] array, String delimiterRegex) {
        Set<Map.Entry<String, String>> entrySet = new HashSet<>();

        for (String row : array) {
            var entry = getEntry(row, delimiterRegex);
            if (entry != null) {
                entrySet.add(entry);
            }
        }

        return entrySet;
    }

    public static Set<Map.Entry<String, String>> arrayToEntrySetWithDelimiter(String[] array) {
        return arrayToEntrySetWithDelimiter(array, DEFAULT_DELIMITER);
    }

    private static Map.Entry<String, String> getEntry(String value, String delimiterRegex) {
        String[] values = value.split(delimiterRegex);
        if (values.length == 2) {
            return new AbstractMap.SimpleEntry<>(values[0].trim(), values[1].trim());
        }
        return null;
    }

    public static Map<String, String> arrayToMapWithDelimiter(String[] array) {
        return arrayToMapWithDelimiter(array, DEFAULT_DELIMITER);
    }
}
