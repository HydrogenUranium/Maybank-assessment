package com.positive.dhl.core.models.common;

import com.day.cq.wcm.api.components.Component;
import com.positive.dhl.core.injectors.InjectHomeProperty;
import lombok.Getter;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import javax.annotation.PostConstruct;
import javax.inject.Named;

/**
 *   The model that extends TrackableAbstract should be adaptable from Resource and SlingHttpServletRequest.
 *   Model(adaptables = {Resource.class, SlingHttpServletRequest.class})
 */
public abstract class TrackableAbstract {

    @InjectHomeProperty
    @Named("eventTrackingComponents-enableAnalytics")
    private boolean enable;

    @ScriptVariable
    private Component component;

    @ChildResource
    @Optional
    @Getter
    private AnalyticsConfig analytics;

    public String getAnalyticsConfigJson() {
        return analytics == null ? null : analytics.getJson();
    }

    @PostConstruct
    private void initAnalytics() {
        if(analytics != null) {
            analytics.setType(component.getName());
            analytics.setEnable(enable);
        }
    }
}
