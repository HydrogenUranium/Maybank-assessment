package com.positive.dhl.core.helpers;

import com.positive.dhl.core.utils.OSGiConfigUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Map;

class OSGiConfigHelperTest {
    @Test
    void testArrayToMapWithDelimiter() {
        String[] array = {
                "key1:  value1",
                "key2::value2",
                "key3  :value3",
                "key3 value3",
        };
        Map<String, String> expectedMap = Map.of(
                "key1", "value1",
                "key3", "value3"
        );

        Map<String, String> result = OSGiConfigUtils.arrayToMapWithDelimiter(array);

        Assertions.assertEquals(expectedMap, result);
    }

    @Test
    void testArrayToMapWithCustomDelimiter() {
        String[] array = {
                "key1| value1",
                "key2:value2",
                "key3 |value3"
        };
        Map<String, String> expectedMap = Map.of(
                "key1", "value1",
                "key3", "value3"
        );

        Map<String, String> result = OSGiConfigUtils.arrayToMapWithDelimiter(array, "\\|");

        Assertions.assertEquals(expectedMap, result);
    }
}