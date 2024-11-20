package com.dhl.discover.junitUtils;

import org.xmlunit.builder.DiffBuilder;
import org.xmlunit.diff.Diff;

import static junit.framework.Assert.assertFalse;

public class AssertXml {
    public static void assertXmlEquals(String expected, String actual) {
        Diff xmlDiff = DiffBuilder.compare(expected)
                .withTest(actual)
                .ignoreWhitespace()
                .build();

        assertFalse("Expected XML response:\n" + expected + "\n\nActual XML response:\n" + actual + "\n\nXML responses are different: " + xmlDiff, xmlDiff.hasDifferences());
    }
}
