package com.dhl.discover.core.injectors;

import com.adobe.cq.wcm.core.components.models.Image;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.models.spi.DisposalCallbackRegistry;
import org.apache.sling.models.spi.Injector;
import org.jetbrains.annotations.NotNull;
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
public class ChildImageModelInjector implements Injector {

    @Reference
    private ModelFactory modelFactory;

    @Override
    @NotNull
    public String getName() {
        return "discover-child-image-model";
    }

    @Override
    public Object getValue(@NotNull Object adaptable,
                           String name,
                           @NotNull Type declaredType,
                           @NotNull AnnotatedElement element,
                           @NotNull DisposalCallbackRegistry callbackRegistry) {
        if (!isAnnotationPresent(element)) {
            return null;
        }

        if (adaptable instanceof SlingHttpServletRequest request) {
            return Optional.of(request.getResource())
                    .map(resource -> resource.getChild(name))
                    .map(childResource -> getImageModel(request, childResource))
                    .orElse(null);
        }
        return null;
    }

    protected boolean isAnnotationPresent(AnnotatedElement annotatedElement) {
        return annotatedElement.isAnnotationPresent(InjectChildImageModel.class);
    }

    /**
     * Create an Image model from a resource
     * @param resource The image resource
     * @return Image model if resource has a file reference, null otherwise
     */
    protected Image getImageModel(SlingHttpServletRequest request, Resource resource) {
        if (!hasFileReference(resource)) {
            return null;
        }
        return modelFactory != null ?
                modelFactory.createModelFromWrappedRequest(request, resource, Image.class) : null;
    }

    /**
     * Check if a resource has a file reference
     * @param resource The resource to check
     * @return true if the resource has a file reference, false otherwise
     */
    protected boolean hasFileReference(Resource resource) {
        return resource != null && StringUtils.isNotBlank(resource.getValueMap().get("fileReference", String.class));
    }
}
