package com.dhl.discover.core.models.common;

import com.google.gson.JsonObject;
import lombok.Getter;
import lombok.Setter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class AnalyticsConfig {
    private static final String ATTRIBUTES = "attributes";
    private static final String NAME = "name";
    private static final String TYPE = "type";
    private static final String INTERACTION = "interaction";
    private static final String POSITION = "position";
    private static final String DETAIL = "detail";
    private static final String CONTENT = "content";
    private static final String CONVERSION = "conversion";

    @ValueMapValue
    private String trackedInteractions;

    @ValueMapValue
    private String interactionType;

    @ValueMapValue
    private String name;

    @ValueMapValue
    private String position;

    @ValueMapValue
    private String detail;

    @Setter
    private String type = "component";

    @ChildResource
    @Named("customAttributes")
    private List<Resource> customAttributeResources;

    private final Map<String, String> customAttributes = new HashMap<>();

    @PostConstruct
    private void init() {
        if (customAttributeResources != null) {
            customAttributeResources.forEach(resource -> {
                var props = resource.getValueMap();
                var key = props.get(NAME, "");
                var value = props.get("value", "");
                customAttributes.put(key, value);
            });
        }
    }

    private JsonObject createJsonObject(String name, String type, String interaction, String position, String detail, Map<String, String> attributes) {
        var jsonObject = new JsonObject();
        var attributesJson = new JsonObject();

        jsonObject.addProperty(NAME, name);
        jsonObject.addProperty(TYPE, type);

        if (interaction != null) {
            jsonObject.addProperty(INTERACTION, interaction);
        }
        if (position != null) {
            jsonObject.addProperty(POSITION, position);
        }
        if (detail != null) {
            jsonObject.addProperty(DETAIL, detail);
        }
        if (attributes != null && !attributes.isEmpty()) {
            jsonObject.add(ATTRIBUTES, attributesJson);
            attributes.forEach(attributesJson::addProperty);
        }

        return jsonObject;
    }

    public String getJson() {
        var json = new JsonObject();
        json.addProperty("trackedInteractions", trackedInteractions);
        json.addProperty("interactionType", "dhl_utf_" + interactionType + "Interaction");

        if (CONVERSION.equals(interactionType)) {
            json.add(CONVERSION, createJsonObject(name, "Lead", null, null, detail, null));
        }
        json.add(CONTENT, createJsonObject(name, type, "Click", position, null, customAttributes));

        return json.toString();
    }
}