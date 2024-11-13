package com.dhl.discover.core.components;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;

@Component(service = MailerComponent.class,configurationPolicy=ConfigurationPolicy.OPTIONAL)
public class MailerComponent {
	public boolean executeWelcome(String firstname, String username) {
		throw new UnsupportedOperationException();
	}

	public boolean executeShipNowWelcome(String firstname, String username) {
		throw new UnsupportedOperationException();
	}

	public boolean executePasswordReset(String path, String firstname, String username, String token) {
		throw new UnsupportedOperationException();
	}

	public boolean executePasswordResetConfirm(String firstname, String username) {
		throw new UnsupportedOperationException();
	}

	public boolean executeDeleteAccount(String firstname, String username) {
		throw new UnsupportedOperationException();
	}
}