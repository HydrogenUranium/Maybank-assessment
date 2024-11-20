package com.dhl.discover.core.models;

import com.dhl.discover.core.models.common.Tab;
import lombok.Getter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;


@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Getter
public class Tabs {

    @ChildResource
    private List<Tab> tabList;

    @ValueMapValue
    @Default(values = "h4")
    private String titleElement;

    private final String id = "" + this.hashCode();

    @PostConstruct
    private void init() {
        if (tabList == null) {
            tabList = new ArrayList<>();
        }
    }
}
