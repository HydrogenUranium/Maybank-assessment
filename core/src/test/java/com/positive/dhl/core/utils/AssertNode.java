package com.positive.dhl.core.utils;

import junit.framework.Assert;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;

import static org.junit.jupiter.api.Assertions.*;

public class AssertNode {

    public static void assertNodeStructureEquals(Node expected, Node actual) throws RepositoryException {
        assertNodeStructureEquals(expected, actual, "");
    }

    private static String getResourceType(Node node) throws RepositoryException {
        return node.hasProperty("sling:resourceType") ? node.getProperty("sling:resourceType").getString() : null;
    }

    public static void assertNodeStructureEquals(Node expected, Node actual, String message) throws RepositoryException {
        assertEquals(expected.getName(), actual.getName(),
                message + "\nNode path: " + actual.getPath() +
                        ". Expected name: " + expected.getName() + " But was: " + actual.getName());

        String expectedResourceType = getResourceType(expected);
        String actualResourceType = getResourceType(actual);
        assertEquals(expectedResourceType, actualResourceType,
                message + "\nNode path: " + actual.getPath() +
                        "Expected resource type: " + expectedResourceType + " but was: " + actualResourceType);
        assertEquals(expected.getPrimaryNodeType(), actual.getPrimaryNodeType(),
                message + "\nNode path: " + actual.getPath() +
                        "Expected primary node type: " + expected.getPrimaryNodeType() + " but was: " + actual.getPrimaryNodeType());

        NodeIterator expectedChildren = expected.getNodes();
        NodeIterator actualChildren = actual.getNodes();

        int counter = 0;
        while (expectedChildren.hasNext()) {
            Node expectedChild = expectedChildren.nextNode();
            assertTrue(actualChildren.hasNext(), "Missing node under path: " + expectedChild.getPath());
            Node actualChild = actualChildren.nextNode();
            assertNodeStructureEquals(expectedChild, actualChild, "Expected position: " + counter++ + " under path: " + expected.getPath());
        }
        if (actualChildren.hasNext()) {
            Assert.fail("Unexpected node under path: " + actualChildren.nextNode().getPath());
        }

    }
}
