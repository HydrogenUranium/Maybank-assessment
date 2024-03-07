package com.positive.dhl.core.services;

import com.day.cq.dam.api.Asset;
import com.positive.dhl.core.components.EnvironmentConfiguration;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import java.util.Optional;

@Component(service = AssetUtilService.class)
@Designate(ocd = AssetUtilService.Config.class)
public class AssetUtilService {

    @Reference
    private EnvironmentConfiguration environmentConfiguration;

    @Reference
    private ResourceResolverHelper resourceResolverHelper;

    private String assetPrefix;

    public String resolvePath(String path) {
        return StringUtils.isNoneBlank(path) && (path.startsWith("/content") || path.startsWith("/adobe/dynamicmedia")) ? assetPrefix + path : path;
    }

    public String getMimeType(String path) {
        try(ResourceResolver resourceResolver = resourceResolverHelper.getReadResourceResolver()) {
            return Optional.ofNullable(resourceResolver)
                    .map(resolver -> resolver.getResource(path))
                    .map(resource -> resource.adaptTo(Asset.class))
                    .map(Asset::getMimeType)
                    .orElse("");
        }
    }

    @Activate
    @Modified
    public void activate(AssetUtilService.Config config) {
        assetPrefix = Optional.ofNullable(config.assetPrefix()).orElse(environmentConfiguration.getAssetPrefix());
    }

    @ObjectClassDefinition(name = "Asset Util")
    @interface Config {
        @AttributeDefinition(name = "Asset Prefix")
        String assetPrefix();
    }
}
