package com.positive.dhl.core.services;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.helpers.OSGiConfigHelper;
import org.apache.jackrabbit.oak.commons.PathUtils;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component(
        service = PageContentExtractorService.class
)
@Designate(ocd = PageContentExtractorService.Config.class)
public class PageContentExtractorService {

    private Map<String, List<String>> componentsToExtract;

    @Activate
    @Modified
    public void activate(Config config) {
        componentsToExtract = OSGiConfigHelper
                .arrayToMapWithDelimiter(config.componentsWithProperties(), "::")
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> Arrays.asList(entry.getValue().split(","))
                ));
    }

    public String extract(Page page) {
        return extract(page.getContentResource());
    }

    public String extract(Resource resource) {
        var content = new StringBuilder();
        processResource(resource, content);
        return content.toString();
    }

    private String wrapHTML(String innerText, String className) {
        return innerText.isBlank()
                ? innerText
                : String.format("<div class=\"%s\">%s</div>", className, innerText);
    }

    private String getProperty(Resource resource, String propertyName) {
        return wrapHTML(resource.getValueMap().get(propertyName, ""), propertyName);
    }


    private String getComponent(Resource resource) {
        List<String> propertyNames = componentsToExtract.get(resource.getResourceType());
        String componentName = "component-" + PathUtils.getName(resource.getResourceType());
        var builder = new StringBuilder();

        if(propertyNames != null) {
            propertyNames.forEach(propertyName -> builder.append(getProperty(resource, propertyName)));
        }

        return wrapHTML(builder.toString(), componentName);
    }

    private void processResource(Resource resource, StringBuilder builder) {
        String resourceType = resource.getResourceType();
        if(componentsToExtract.containsKey(resourceType)) {
            builder.append(getComponent(resource));
        }
        resource.getChildren().forEach(child -> processResource(child, builder));
    }

    @ObjectClassDefinition
    @interface Config {

        @AttributeDefinition(
                name = "Components with properties to extract",
                description = "<component path>::<prop1>,<prop2>"
        )
        String[] componentsWithProperties();
    }

}
