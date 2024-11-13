package com.dhl.discover.core.models;

import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import java.util.UUID;

@Model(adaptables= Resource.class)
@Getter
public class UniqueId {

    private String id;

    @PostConstruct
    private void init() {
        id = UUID.randomUUID().toString();
    }
}
