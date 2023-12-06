package com.positive.dhl.core.utils;

import com.positive.dhl.core.injectors.AssetInjector;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.models.spi.Injector;
import org.junit.platform.commons.util.StringUtils;

import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class InjectorMock {

    public static String INJECT_ADAPTABLE = "adaptable";
    public static String INJECT_ASSET = "discover-asset";
    public static String INJECT_HOME_PAGE_PROPERTY = "discover-home-property";
    public static String INJECT_HOME_PAGE_ASSET_PROPERTY = "discover-home-asset-property";

    public static void initAssetInjector(AemContext context) {
        initAssetInjector(context, "/prefix");
    }

    public static void initAssetInjector(AemContext context, String prefix) {
        PathUtilService pathUtilService = mock(PathUtilService.class);
        when(pathUtilService.resolveAssetPath(any())).thenAnswer(invocationOnMock -> {
            String path = invocationOnMock.getArgument(0, String.class);
            return StringUtils.isNotBlank(path) ? "/prefix" + invocationOnMock.getArgument(0, String.class) : "";
        });
        initAssetInjector(context, pathUtilService);
    }

    public static void initAssetInjector(AemContext context, PathUtilService pathUtilService) {
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerInjectActivateService(new AssetInjector());
    }

    public static void mockInjectAsset(AemContext context, String name, Object value) {
        mockInject(context, INJECT_ASSET, name, value);
    }

    public static void mockInjectAsset(AemContext context, Map<String, Object> map) {
        mockInject(context, INJECT_ASSET, map);
    }

    public static void mockInjectHomeAssetProperty(AemContext context, String name, Object value) {
        mockInject(context, INJECT_HOME_PAGE_ASSET_PROPERTY, name, value);
    }

    public static void mockInjectHomeAssetProperty(AemContext context, Map<String, Object> map) {
        mockInject(context, INJECT_HOME_PAGE_ASSET_PROPERTY, map);
    }

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
        mockInject(context, injectorName, Map.of(name, value));
    }

    public static void mockInject(AemContext context, Map<String, Object> map) {
        mockInject(context, INJECT_ADAPTABLE, map);
    }

    public static void mockInject(AemContext context, String injectorName, Map<String, Object> map) {
        Injector injector = mock(Injector.class);

        lenient().when(injector.getValue(any(), anyString(), any(), any(), any())).thenReturn(null);
        when(injector.getName()).thenReturn(injectorName);
        map.forEach((name, value) -> when(injector.getValue(any(), eq(name), any(), any(), any())).thenReturn(value));
        context.registerService(Injector.class, injector);
    }
}
