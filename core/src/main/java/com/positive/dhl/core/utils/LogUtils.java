package com.positive.dhl.core.utils;

import lombok.experimental.UtilityClass;
import org.apache.commons.text.StringEscapeUtils;

@UtilityClass
public class LogUtils {
    public static String encode(String message) {
        message = message.replace('\n', '_')
                .replace('\r', '_')
                .replace('\t', '_');

        return StringEscapeUtils.escapeHtml4(message);
    }
}
