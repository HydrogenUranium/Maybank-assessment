package com.positive.dhl.core.injectors;

import com.positive.dhl.core.services.PathUtilService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
import org.apache.sling.models.spi.Injector;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Type;
import java.util.Optional;

import static org.osgi.framework.Constants.SERVICE_RANKING;

@Component(
        service = Injector.class,
        property = {SERVICE_RANKING + "=1"}
)
public class AssetInjector extends AbstractInjector {

    @Reference
    private PathUtilService pathUtilService;

    @Override
    public @NotNull String getName() {
        return "discover-asset";
    }

    @Override
    public @Nullable Object getValue(@NotNull Object object, String name, @NotNull Type type, @NotNull AnnotatedElement annotatedElement, @NotNull DisposalCallbackRegistry disposalCallbackRegistry) {
        if(!annotatedElement.isAnnotationPresent(InjectAsset.class)) {
            return null;
        }
        return  Optional.ofNullable(getResource(object))
                .map(Resource::getValueMap)
                .map(valueMap -> valueMap.get(name, ""))
                .map(path -> pathUtilService.resolveAssetPath(path))
                .orElse("");
    }
}
