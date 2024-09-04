package com.positive.dhl.core.models.common;

import com.google.gson.JsonObject;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class AnalyticsConfig {

    @Setter
    private boolean enable;

    @Inject
    private String trackedInteractions;

    @Inject
    private String interactionType;

    @Inject
    private String name;

    @Inject
    private String position;

    @Setter
    private String type = "component";

    @Inject
    @Named("customAttributes")
    private List<Resource> customAttributeResources;

    private final Map<String, String> customAttributes = new HashMap<>();

    @PostConstruct
    private void init() {
        if (customAttributeResources != null) {
            customAttributeResources.forEach(resource -> {
                var props = resource.getValueMap();
                var key = props.get("name", "");
                var value = props.get("value", "");
                customAttributes.put(key, value);
            });
        }
    }

    public String getJson() {
        if(!enable || "off".equals(trackedInteractions)) {
            return null;
        }

        var json = new JsonObject();
        var content = new JsonObject();
        var attributes = new JsonObject();
        json.add("content", content);
        content.add("attributes", attributes);

        json.addProperty("trackedInteractions", trackedInteractions);
        json.addProperty("interactionType", "dhl_utf_" + interactionType + "Interaction");

        content.addProperty("name", name);
        content.addProperty("type", type);
        content.addProperty("interaction", "Click");
        content.addProperty("position", position);

        customAttributes.forEach(attributes::addProperty);

        return json.toString();
    }
}