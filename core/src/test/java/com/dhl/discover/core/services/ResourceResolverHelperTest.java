package com.dhl.discover.core.services;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.jcr.Session;

import static junit.framework.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
@ExtendWith(AemContextExtension.class)
class ResourceResolverHelperTest {

    @Mock
    private ResourceResolverFactory resourceResolverFactory;

    @InjectMocks
    private ResourceResolverHelper resourceResolverHelper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserManagerResourceResolver() throws Exception {
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        when(resourceResolverFactory.getServiceResourceResolver(any())).thenReturn(resourceResolver);

        // Mock the Resource returned by getResource
        org.apache.sling.api.resource.Resource resource = mock(org.apache.sling.api.resource.Resource.class);
        when(resourceResolver.getResource("a")).thenReturn(resource);

        // Mock the ValueMap returned by getValueMap
        org.apache.sling.api.resource.ValueMap valueMap = mock(org.apache.sling.api.resource.ValueMap.class);
        when(resource.getValueMap()).thenReturn(valueMap);

        ResourceResolver result = resourceResolverHelper.getUserManagerResourceResolver();
        assertNotNull(result);
        assertNotNull(result.getResource("a"));
        assertNotNull(result.getResource("a").getValueMap());
        verify(resourceResolverFactory, times(1)).getServiceResourceResolver(any());
    }

    @Test
    void testGetReadResourceResolver() throws Exception {
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        when(resourceResolverFactory.getServiceResourceResolver(any())).thenReturn(resourceResolver);

        ResourceResolver result = resourceResolverHelper.getReadResourceResolver();

        assertNotNull(result);
        verify(resourceResolverFactory, times(1)).getServiceResourceResolver(any());
    }

    @Test
    void testGetWriteResourceResolver() throws Exception {
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        when(resourceResolverFactory.getServiceResourceResolver(any())).thenReturn(resourceResolver);

        ResourceResolver result = resourceResolverHelper.getWriteResourceResolver();

        assertNotNull(result);
        verify(resourceResolverFactory, times(1)).getServiceResourceResolver(any());
    }

    @Test
    void testGetResourceResolverWithLoginException() throws Exception {
        // Mock the exception
        when(resourceResolverFactory.getServiceResourceResolver(any())).thenThrow(new LoginException("Login failed"));

        ResourceResolver result = resourceResolverHelper.getUserManagerResourceResolver();

        assertNull(result); // Ensure null is returned when an exception occurs
        verify(resourceResolverFactory, times(1)).getServiceResourceResolver(any());
    }

    @Test
    void testGetResourceResolverFromSession() throws Exception {
        Session mockSession = mock(Session.class);
        ResourceResolver mockResourceResolver = mock(ResourceResolver.class);

        when(resourceResolverFactory.getResourceResolver(
                argThat(map -> map.containsKey("user.jcr.session") &&
                        map.get("user.jcr.session") == mockSession)))
                .thenReturn(mockResourceResolver);

        ResourceResolver result = resourceResolverHelper.getResourceResolver(mockSession);

        assertNotNull(result);
        assertEquals(mockResourceResolver, result);
        verify(resourceResolverFactory, times(1))
                .getResourceResolver(argThat(map -> map.containsKey("user.jcr.session")));
    }

    @Test
    void testGetResourceResolverFromSessionWithLoginException() throws Exception {
        Session mockSession = mock(Session.class);

        when(resourceResolverFactory.getResourceResolver(any()))
                .thenThrow(new LoginException("Test login exception"));
        ResourceResolver result = resourceResolverHelper.getResourceResolver(mockSession);

        assertNull(result);
        verify(resourceResolverFactory, times(1)).getResourceResolver(any());
    }
}