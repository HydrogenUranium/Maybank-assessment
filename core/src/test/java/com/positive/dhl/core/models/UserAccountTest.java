package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import javax.jcr.Session;

import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.positive.dhl.core.components.DotmailerComponent;

import io.wcm.testing.mock.aem.junit5.AemContext;

class UserAccountTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);
    
    @Mock
    DotmailerComponent dotmailerComponent;
    
	@BeforeEach
	public void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/RegistrationsStore.json", "/content");
	    
	    dotmailerComponent = mock(DotmailerComponent.class);
	    Mockito.when(dotmailerComponent.ExecutePasswordReset(anyString(), anyString(), anyString(), anyString())).thenReturn(true);
	    Mockito.when(dotmailerComponent.ExecutePasswordResetConfirm(anyString(), anyString())).thenReturn(true);
	    Mockito.when(dotmailerComponent.ExecuteDeleteAccount(anyString(), anyString())).thenReturn(true);
	}

	@Test
	public void test() throws Exception {
		Registration registration = new Registration();
		registration.setFirstname("firstname");
		registration.setLastname("lastname");
		registration.setEmail("email@email.com");
		registration.setNewemail("new-email");
		registration.setPassword("password");
		registration.setSalt("salt");
		registration.setNewpassword("new-password");
		registration.setPosition("position");
		registration.setContactNumber("contact-number");
		registration.setBusinessSize("business-size");
		registration.setBusinessSector("business-sector");
		registration.setIslinkedin(true);
		registration.setInterest_categories("interest-categories");
		registration.setFullAccount(true);
		registration.setTcAgree(true);
	}

}
