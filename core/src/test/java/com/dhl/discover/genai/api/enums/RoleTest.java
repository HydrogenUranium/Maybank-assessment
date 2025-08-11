package com.dhl.discover.genai.api.enums;

import com.dhl.discover.genai.exception.InvalidRoleException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RoleTest {
    @Test
    void testFromStringValidRoles() throws InvalidRoleException {
        assertEquals(Role.USER, Role.fromString("user"));
        assertEquals(Role.ASSISTANT, Role.fromString("assistant"));
        assertEquals(Role.SYSTEM, Role.fromString("system"));
    }

    @Test
    void testFromStringInvalidRole() {
        assertThrows(InvalidRoleException.class, () -> Role.fromString("invalid"));
    }

    @Test
    void testToString() {
        assertEquals("user", Role.USER.toString());
        assertEquals("assistant", Role.ASSISTANT.toString());
        assertEquals("system", Role.SYSTEM.toString());
    }
}