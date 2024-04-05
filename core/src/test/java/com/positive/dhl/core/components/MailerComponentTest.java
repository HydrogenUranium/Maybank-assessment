package com.positive.dhl.core.components;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MailerComponentTest {

    private final MailerComponent mailer = new MailerComponent();

    @Test
    void executeWelcome() {
        assertThrows(UnsupportedOperationException.class, () -> {
           mailer.ExecuteWelcome("", "");
        });
    }

    @Test
    void executeShipNowWelcome() {
        assertThrows(UnsupportedOperationException.class, () -> {
            mailer.ExecuteShipNowWelcome("", "");
        });
    }

    @Test
    void executePasswordReset() {
        assertThrows(UnsupportedOperationException.class, () -> {
            mailer.ExecutePasswordReset("", "", "", "");
        });
    }

    @Test
    void executePasswordResetConfirm() {
        assertThrows(UnsupportedOperationException.class, () -> {
            mailer.ExecutePasswordResetConfirm("", "");
        });
    }

    @Test
    void executeDeleteAccount() {
        assertThrows(UnsupportedOperationException.class, () -> {
            mailer.ExecuteDeleteAccount("", "");
        });
    }
}