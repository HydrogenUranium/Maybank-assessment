package com.dhl.discover.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static junit.framework.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CarouselItemValidatorTest {

    private CarouselItemValidator validator;
    private ResourceResolver resourceResolver;

    @BeforeEach
    public void setUp() {
        validator = new CarouselItemValidator();
        resourceResolver = mock(ResourceResolver.class);
        validator.setResourceResolver(resourceResolver);
    }

    private void setResource(Resource resource) throws Exception {
        var field = CarouselItemValidator.class.getDeclaredField("resource");
        field.setAccessible(true);
        field.set(validator, resource);
    }


    @Test
     void testIsValid_whenResourceIsGhost() throws Exception {
        Resource resource = mock(Resource.class);
        when(resource.getResourceType()).thenReturn("wcm/msm/components/ghost");

        ValueMap vm = mock(ValueMap.class);
        when(resource.getValueMap()).thenReturn(vm);
        when(vm.get("linkURL", "")).thenReturn("/content/page");
        when(resourceResolver.getResource("/content/page")).thenReturn(mock(Resource.class));

        setResource(resource);
        assertFalse(validator.isValid(), "Validator should be invalid for ghost resource type");
    }



    @Test
     void testIsValid_whenLinkURLBlank() throws Exception {
        Resource resource = mock(Resource.class);
        when(resource.getResourceType()).thenReturn("nonGhost");

        ValueMap vm = mock(ValueMap.class);
        when(resource.getValueMap()).thenReturn(vm);
        when(vm.get("linkURL", "")).thenReturn("");

        setResource(resource);
        assertFalse(validator.isValid(), "Validator should be invalid when linkURL is blank");
    }

    @Test
    void testIsValid_whenLinkURLDoesNotExist() throws Exception {
        Resource resource = mock(Resource.class);
        when(resource.getResourceType()).thenReturn("nonGhost");

        ValueMap vm = mock(ValueMap.class);
        when(resource.getValueMap()).thenReturn(vm);
        when(vm.get("linkURL", "")).thenReturn("/content/nonexistent");
        when(resourceResolver.getResource("/content/nonexistent")).thenReturn(null);

        setResource(resource);
        assertFalse(validator.isValid(), "Validator should be invalid when linkURL resource does not exist");
    }

    @Test
     void testIsValid_whenValid() throws Exception {
        Resource resource = mock(Resource.class);
        when(resource.getResourceType()).thenReturn("nonGhost");

        ValueMap vm = mock(ValueMap.class);
        when(resource.getValueMap()).thenReturn(vm);
        when(vm.get("linkURL", "")).thenReturn("/content/valid");
        when(resourceResolver.getResource("/content/valid")).thenReturn(mock(Resource.class));

        setResource(resource);
        assertTrue("Validator should be valid for a non-ghost resource with an existing linkURL", validator.isValid());
    }

    @Test
     void testIsValid_whenResourceIsNull() {
        boolean result = validator.isValid();
        assertFalse(result, "Expected isValid() to return false when resource is null");
    }

}
