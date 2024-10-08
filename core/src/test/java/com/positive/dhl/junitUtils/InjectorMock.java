package com.positive.dhl.junitUtils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.models.spi.Injector;

import java.util.Collections;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class InjectorMock {

    public static String INJECT_ADAPTABLE = "adaptable";
    public static String INJECT_SCRIPT_BINDINGS = "script-bindings";
    public static String INJECT_REQUEST_ATTRIBUTES = "request-attributes";
    public static String INJECT_HOME_PAGE_PROPERTY = "discover-home-property";

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

    public static void mockInject(AemContext context, String injectorName, Map<String, Object> map) {
        Injector injector = mock(Injector.class);

        lenient().when(injector.getValue(any(), anyString(), any(), any(), any())).thenReturn(null);
        when(injector.getName()).thenReturn(injectorName);
        map.forEach((name, value) -> lenient().when(injector.getValue(any(), eq(name), any(), any(), any())).thenReturn(value));
        context.registerService(Injector.class, injector);
    }
}
