package com.positive.dhl.core.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LogUtilsTest {

    @Test
    void test() {
        String value = "300\n\nweb – 2017-04-12 17:47:08,957 [main] INFO Amount reversed successfully";

        String forgedLogExpected = "web - 2017-04-12 17:52:14,124 [main] INFO  com.baeldung.logforging.\n" +
                "  LogForgingDemo - Amount credited = 300\n" +
                "\n" +
                "web – 2017-04-12 17:47:08,957 [main] INFO Amount reversed successfully";
        String encodedLogExpected = "web - 2017-04-12 17:52:14,124 [main] INFO  com.baeldung.logforging.\n" +
                "  LogForgingDemo - Amount credited = 300__web &ndash; 2017-04-12 17:47:08,957 [main] INFO Amount reversed successfully";

        String forgedLog = log("Amount credited = " + value);
        String encodedLog = log("Amount credited = " + LogUtils.encode(value));

        assertEquals(forgedLogExpected, forgedLog);

        assertEquals(encodedLogExpected, encodedLog);
    }

    private String log(String message) {
        return "web - 2017-04-12 17:52:14,124 [main] INFO  com.baeldung.logforging.\n" +
                "  LogForgingDemo - " + message;
    }
}