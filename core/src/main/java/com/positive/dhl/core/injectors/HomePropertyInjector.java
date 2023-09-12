package com.positive.dhl.core.injectors;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.PageUtilService;
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
    private PageUtilService pageUtils;

    @Override
    public @NotNull String getName() {
        return "discover-home-property";
    }

    @Override
    protected Resource getResource(Object object) {
        if (object instanceof SlingHttpServletRequest) {
            SlingHttpServletRequest request = ((SlingHttpServletRequest) object);
            var resourceResolver = request.getResourceResolver();
            return resourceResolver.resolve(request.getPathInfo());
        }

        return null;
    }

    @Override
    public @Nullable Object getValue(@NotNull Object object, String name, @NotNull Type type, @NotNull AnnotatedElement annotatedElement, @NotNull DisposalCallbackRegistry disposalCallbackRegistry) {
        if (!annotatedElement.isAnnotationPresent(InjectHomeProperty.class)) {
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

        return homePage.map(Page::getProperties)
                .map(valueMap -> valueMap.get(name))
                .orElse(null);
    }
}
