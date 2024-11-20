package com.dhl.discover.core.models;

import com.day.cq.wcm.api.components.Component;
import com.dhl.discover.core.models.common.AnalyticsConfig;
import lombok.Getter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import javax.annotation.PostConstruct;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy= DefaultInjectionStrategy.OPTIONAL)
public class TrackableComponent {

    @ScriptVariable
    private Component component;

    @ChildResource
    @Getter
    private AnalyticsConfig analytics;

    public String getJson() {
        return analytics == null ? null : analytics.getJson();
    }

    @PostConstruct
    private void initAnalytics() {
        if(analytics != null) {
            analytics.setType(component.getName());
        }
    }
}
