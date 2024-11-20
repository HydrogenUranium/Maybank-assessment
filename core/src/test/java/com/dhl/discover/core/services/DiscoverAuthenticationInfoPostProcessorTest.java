package com.dhl.discover.core.services;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.auth.core.spi.AuthenticationInfo;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.ValueFactory;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DiscoverAuthenticationInfoPostProcessorTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    ResourceResolverHelper resourceResolverHelper;

    @Mock
    ResourceResolver resolver;

    @Mock
    JackrabbitSession session;

    @Mock
    UserManager userManager;

    @Mock
    Authorizable user;

    @InjectMocks
    DiscoverAuthenticationInfoPostProcessor processor;

    @Mock
    AuthenticationInfo info;

    @Mock
    ValueFactory valueFactory;

    @Mock
    Value value;

    @Test
    void postProcess_shouldAddLastLogin() throws RepositoryException {
        when(resourceResolverHelper.getUserManagerResourceResolver()).thenReturn(resolver);
        when(resolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getUserManager()).thenReturn(userManager);
        when(userManager.getAuthorizable(anyString())).thenReturn(user);
        when(info.getUser()).thenReturn("user");
        when(session.getValueFactory()).thenReturn(valueFactory);
        when(valueFactory.createValue(anyString())).thenReturn(value);

        processor.postProcess(info, context.request(), context.response());
        verify(user, times(1)).setProperty("profile/lastloggedin", value);
    }

    @Test
    void postProcess_shouldIgnoreRequest_whenInfoIsNull() throws RepositoryException {
        processor.postProcess(null, context.request(), context.response());
        verify(user, times(0)).setProperty("profile/lastloggedin", value);
    }

    @Test
    void postProcess_shouldIgnoreRequest_whenUserIdIsNull() throws RepositoryException {
        processor.postProcess(info, context.request(), context.response());
        verify(user, times(0)).setProperty("profile/lastloggedin", value);
    }

    @Test
    void postProcess_shouldLogError_whenSessionISNull() throws RepositoryException {
        when(resourceResolverHelper.getUserManagerResourceResolver()).thenReturn(resolver);
        when(info.getUser()).thenReturn("user");

        processor.postProcess(info, context.request(), context.response());
        verify(user, times(0)).setProperty("profile/lastloggedin", value);
    }

    @Test
    void postProcess_shouldLogError_whenUserISNull() throws RepositoryException {
        when(resourceResolverHelper.getUserManagerResourceResolver()).thenReturn(resolver);
        when(resolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getUserManager()).thenReturn(userManager);
        when(info.getUser()).thenReturn("user");

        processor.postProcess(info, context.request(), context.response());
        verify(user, times(0)).setProperty("profile/lastloggedin", value);
    }
}
