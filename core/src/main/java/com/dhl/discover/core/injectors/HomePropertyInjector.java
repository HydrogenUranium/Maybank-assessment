package com.dhl.discover.core.injectors;

import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import org.apache.sling.api.SlingHttpServletRequest;
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
public class HomePropertyInjector extends AbstractInjector {

    @Reference
    protected PageUtilService pageUtils;

    @Override
    public @NotNull String getName() {
        return "discover-home-property";
    }

    @Override
    protected Resource getResource(Object object) {
        if (object instanceof SlingHttpServletRequest slingHttpServletRequest) {
            var resourceResolver = slingHttpServletRequest.getResourceResolver();
            return resourceResolver.resolve(slingHttpServletRequest.getPathInfo());
        }

        return null;
    }

    protected boolean isAnnotationPresent(AnnotatedElement annotatedElement) {
        return annotatedElement.isAnnotationPresent(InjectHomeProperty.class);
    }

    @Override
    public @Nullable Object getValue(@NotNull Object object, String name, @NotNull Type type, @NotNull AnnotatedElement annotatedElement, @NotNull DisposalCallbackRegistry disposalCallbackRegistry) {
        if (!isAnnotationPresent(annotatedElement)) {
            return null;
        }
        var resource = getResource(object);
        if (resource == null) {
            return null;
        }

        var resourceResolver = resource.getResourceResolver();
        var pagePath = resource.getPath().replaceAll("/jcr:content.*", "");

        Optional<Page> homePage = Optional.of(resourceResolver.resolve(pagePath))
                .map(pageResource -> pageResource.adaptTo(Page.class))
                .map(page -> pageUtils.getHomePage(page));

        if (type == Resource.class) {
            return homePage.map(Page::getContentResource)
                    .map(pageResource -> pageResource.getChild(name))
                    .orElse(null);
        }

        if (type == Boolean.class) {
            return homePage.map(Page::getProperties)
                    .map(valueMap -> valueMap.get(name, Boolean.class)).orElse(false);
        }

        return homePage.map(Page::getProperties)
                .map(valueMap -> valueMap.get(name))
                .orElse(null);
    }
}
