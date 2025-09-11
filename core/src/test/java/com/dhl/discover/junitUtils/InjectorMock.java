package com.dhl.discover.junitUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import lombok.experimental.UtilityClass;
import org.apache.sling.models.spi.Injector;

import java.util.Collections;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Utility class for mocking Sling Model injectors in unit tests using {@link AemContext}.
 * <p>
 * Supports mocking values returned by injectors with a specific name (e.g., "adaptable", "self").
 */
@UtilityClass
public class InjectorMock {

    public static final String INJECT_ADAPTABLE = "adaptable";
    public static final String INJECT_SELF = "self";
    public static final String INJECT_SCRIPT_BINDINGS = "script-bindings";
    public static final String INJECT_REQUEST_ATTRIBUTES = "request-attributes";
    public static final String INJECT_HOME_PAGE_PROPERTY = "discover-home-property";
    public static final String INJECT_CHILD_IMAGE_MODEL = "discover-child-image-model";

    public static void mockInjectHomeProperty(AemContext context, String name, Object value) {
        mockInject(context, INJECT_HOME_PAGE_PROPERTY, name, value);
    }

    public static void mockInjectHomeProperty(AemContext context, Map<String, Object> map) {
        mockInject(context, INJECT_HOME_PAGE_PROPERTY, map);
    }

    public static void mockInject(AemContext context, String name, Object value) {
        mockInject(context, INJECT_ADAPTABLE, name, value);
    }

    public static void mockInject(AemContext context, String injectorName, String name, Object value) {
        mockInject(context, injectorName, Collections.singletonMap(name, value));
    }

    public static void mockInject(AemContext context, Map<String, Object> map) {
        mockInject(context, INJECT_ADAPTABLE, map);
    }

    /**
     * Mocks multiple injected properties using a named injector and registers it in the given AEM context.
     *
     * @param context      the AemContext
     * @param injectorName the name of the injector to register
     * @param map          a map of property names and values to inject
     */
    public static void mockInject(AemContext context, String injectorName, Map<String, Object> map) {
        Injector injector = mock(Injector.class);

        lenient().when(injector.getValue(any(), anyString(), any(), any(), any())).thenReturn(null);
        when(injector.getName()).thenReturn(injectorName);
        map.forEach((name, value) -> lenient().when(injector.getValue(any(), eq(name), any(), any(), any())).thenReturn(value));
        context.registerService(Injector.class, injector);
    }
}
