package com.positive.dhl.core.components;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MailerComponentTest {

    private final MailerComponent mailer = new MailerComponent();

    @Test
    void executeWelcome() {
        assertThrows(UnsupportedOperationException.class, () -> {
           mailer.executeWelcome("", "");
        });
    }

    @Test
    void executeShipNowWelcome() {
        assertThrows(UnsupportedOperationException.class, () -> {
            mailer.executeShipNowWelcome("", "");
        });
    }

    @Test
    void executePasswordReset() {
        assertThrows(UnsupportedOperationException.class, () -> {
            mailer.executePasswordReset("", "", "", "");
        });
    }

    @Test
    void executePasswordResetConfirm() {
        assertThrows(UnsupportedOperationException.class, () -> {
            mailer.executePasswordResetConfirm("", "");
        });
    }

    @Test
    void executeDeleteAccount() {
        assertThrows(UnsupportedOperationException.class, () -> {
            mailer.executeDeleteAccount("", "");
        });
    }
}