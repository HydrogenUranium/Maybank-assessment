package com.positive.dhl.core.injectors;

import com.positive.dhl.core.components.EnvironmentConfigurationData;
import com.positive.dhl.core.services.AssetUtilService;
import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
import org.apache.sling.models.spi.Injector;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;

import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Type;

import static org.osgi.framework.Constants.SERVICE_RANKING;

@Component(
        service = Injector.class,
        property = {SERVICE_RANKING + "=1"}
)
public class HomeAssetPropertyInjector extends HomePropertyInjector {

    @Reference
    protected PageUtilService pageUtilService;

    @Reference
    private AssetUtilService assetUtils;

    @Override
    public @NotNull String getName() {
        return "discover-home-asset-property";
    }

    @Activate
    @Modified
    protected void activate(EnvironmentConfigurationData environmentConfigurationData) {
        super.pageUtils = pageUtilService;
    }

    @Override
    protected boolean isAnnotationPresent(AnnotatedElement annotatedElement) {
        return annotatedElement.isAnnotationPresent(InjectHomeAssetProperty.class);
    }

    @Override
    public @Nullable Object getValue(@NotNull Object object, String name, @NotNull Type type, @NotNull AnnotatedElement annotatedElement, @NotNull DisposalCallbackRegistry disposalCallbackRegistry) {
        Object result = super.getValue(object, name, type, annotatedElement, disposalCallbackRegistry);
        if (result instanceof String) {
            return assetUtils.resolvePath((String) result);
        }
        return result;
    }
}
