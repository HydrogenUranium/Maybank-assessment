package com.dhl.discover.core.services;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
@ExtendWith(AemContextExtension.class)
class ResourceResolverHelperTest {

    private final AemContext context = new AemContext();

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

        ResourceResolver result = resourceResolverHelper.getUserManagerResourceResolver();

        assertNotNull(result);
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
}