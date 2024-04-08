package com.positive.dhl.core.components;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;

@Component(service = MailerComponent.class,configurationPolicy=ConfigurationPolicy.OPTIONAL)
public class MailerComponent {
	public boolean ExecuteWelcome(String firstname, String username) {
		throw new UnsupportedOperationException();
	}

	public boolean ExecuteShipNowWelcome(String firstname, String username) {
		throw new UnsupportedOperationException();
	}

	public boolean ExecutePasswordReset(String path, String firstname, String username, String token) {
		throw new UnsupportedOperationException();
	}

	public boolean ExecutePasswordResetConfirm(String firstname, String username) {
		throw new UnsupportedOperationException();
	}

	public boolean ExecuteDeleteAccount(String firstname, String username) {
		throw new UnsupportedOperationException();
	}
}